/**
This function creates a portfolio stock for a given user.
@param {string} userID - The ID of the user.
@param {string} ticker - The ticker symbol of the stock.
@param {number} shares - The number of shares to add to the portfolio.
@param {number} buyPrice - The price at which the shares were bought.
@returns {Promise} - A promise that resolves with the response from the API.
@throws {Error} - If an error occurs during the API request.
*/
export async function createPortfolioStock(userID, ticker, shares, buyPrice) {
  try {
    const body = JSON.stringify({
      userID: userID,
      ticker: ticker,
      shares: shares,
      buyInPrice: buyPrice,
    });
    const response = await fetch("/api/portfolio/stock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });
    return response;
  } catch (err) {
    console.log(err);
  }
}

/**

This function deletes a stock from the portfolio of a given user.
@param {string} ticker - The ticker symbol of the stock to be deleted.
@param {string} userID - The ID of the user.
@returns {Promise} - A promise that resolves with the response from the API.
@throws {Error} - If an error occurs during the API request.
*/
export async function deleteStock(ticker, userID) {
  try {
    const response = await fetch(`/api/portfolio/stock/${ticker}/${userID}`, {
      method: "DELETE",
    });
    return response;
  } catch (err) {
    console.log(err);
  }
}

/**

This function retrieves all portfolio stocks for a given user.
@param {string} userID - The ID of the user.
@returns {Promise} - A promise that resolves with the portfolio stock data as JSON.
@throws {Error} - If an error occurs during the API request.
*/
export async function readAllPortfolioStocks(userID) {
  try {
    const res = await fetch(`/api/portfolio/stock/${userID}`, {
      method: "GET",
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
}
