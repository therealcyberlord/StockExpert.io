import "dotenv/config";
import { MongoClient, ServerApiVersion } from "mongodb";
import crypto from "crypto";

let collection = null;

// Hashing function, for security purposes on to the password
const hashNode = (val) => {
  return new Promise((resolve) =>
    setTimeout(
      () => resolve(crypto.createHash("sha256").update(val).digest("hex")),
      0
    )
  );
};

// Connect to the database, this is a mongoDB database. The credientials are stored in the .env file
async function connect() {
  const client = await MongoClient.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });
  const db = client.db("StockExpert");
  const collection = db.collection("users");
  return { db, client, collection };
}

// Find a user in the database, this is used for login purposes
async function findUser(email, password) {
  if (collection === null) {
    const conn = await connect();
    collection = conn.collection;
  }
  const res = await collection.findOne({
    email: email,
    password: await hashNode(password),
  });
  if (res === null) {
    return false;
  }
  return true;
  // return res.password === hashNode(password);
}

// This function is used to find the user id, this is used for the session to store the user id in cookies
async function findUserId(email, password) {
  if (collection === null) {
    const conn = await connect();
    collection = conn.collection;
  }
  const res = await collection.findOne({
    email: email,
    password: await hashNode(password),
  });
  if (res === null) {
    return null;
  }
  return res._id;
  // return res.password === hashNode(password);
}

export { connect, findUser, findUserId };
