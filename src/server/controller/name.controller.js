import { connect } from "../db/user-db.js";
import yahooFinance from "yahoo-finance2";
import { ObjectId } from "mongodb";

const conn = await connect();
const db = conn.db;
const collection = db.collection("users");

export async function getName(response, userID) {
  try {
    const _userID = new ObjectId(userID);
    const user = await collection.findOne({ _id: _userID });
    const name = await user.name;
    if (user) {
      response.status(200).send(name);
    } else {
      response.status(404);
    }
  } catch (err) {
    console.log(err);
    response.status(400);
  }
}
