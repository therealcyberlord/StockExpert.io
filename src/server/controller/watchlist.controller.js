import { connect } from "../db/user-db.js";
import yahooFinance from "yahoo-finance2";
import { ObjectId } from "mongodb";

const conn = await connect();
const db = conn.db;
const collection = db.collection("watchlist");

/**

This function retrieves the name of a stock based on its ticker symbol using the Yahoo Finance API.
@param {string} ticker - The ticker symbol of the stock.
@returns {string} - The name of the stock.
@throws {Error} - If there is an error retrieving the stock data.
*/
async function getStockName(ticker) {
  try {
    const data = await yahooFinance.quote(ticker);
    const name = data.longName;
    return name;
  } catch (err) {
    console.log(err);
  }
}

/**

This function retrieves all stocks from the user's watchlist and sends the response as JSON.
@param {object} response - The HTTP response object.
@param {string} userID - The ID of the user.
*/
export async function getAllStocks(response, userID) {
  try {
    const _userID = new ObjectId(userID);
    const stocksCursor = await collection.find({ userID: _userID });
    const stocksArr = await stocksCursor.toArray();
    response.status(200).json(stocksArr);
  } catch (err) {
    response.status(400).send("Could not retrieve stocks");
  }
}

/**

This function deletes a stock from the user's watchlist in the database based on the ticker symbol and user ID.
@param {object} response - The HTTP response object.
@param {string} ticker - The ticker symbol of the stock to be deleted.
@param {string} userID - The ID of the user.
*/
export async function deleteStock(response, ticker, userID) {
  try {
    const _userID = new ObjectId(userID);
    const result = await collection.deleteOne({ userID: _userID, ticker: ticker });
    if (result.deletedCount > 0) {
      response.status(200).send("Succesfully Deleted Stock");
    }
    else {
      response.status(404).send("Could not find stock");
    }
  } catch (err) {
    response.status(400).send("There was an error trying to delete the stock");
  }
}

/**

This function creates a new stock in the user's watchlist in the database with the provided information.
@param {object} response - The HTTP response object.
@param {string} userID - The ID of the user.
@param {string} ticker - The ticker symbol of the stock.
*/
export async function createStock(response, userID, ticker) {
  try {
    const _userID = new ObjectId(userID);
    const name = await getStockName(ticker);
    const stock = {
      userID: _userID,
      ticker: ticker,
      name: name,
    };

    const alreadyExistingCursor = await collection.find({
      userID: _userID,
      ticker: ticker,
    });
    const alreadyExistingArr = await alreadyExistingCursor.toArray();
    if (name === undefined) {
      response.status(404).send(`Stock with symbol ${ticker} not found`);
    } else if (alreadyExistingArr.length > 0) {
      response.status(409).send(`Stock is already in your portfolio`);
    } else {
      await collection.insertOne(stock);
      response.status(200).send("Succesfull Creation");
    }
  } catch (err) {
    response.status(400).send(err);
  }
}
