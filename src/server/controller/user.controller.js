import { connect } from "../db/user-db.js";
import crypto from "crypto";

let db = null;
let client = null;
let collection = null;

// Initialize the a database
export async function init() {
  try {
    const conn = await connect();
    db = conn.db;
    client = conn.client;
    collection = conn.collection;
  } catch (err) {
    console.log(err);
  }
}

const hashNode = (val) =>
  new Promise((resolve) =>
    setTimeout(
      () => resolve(crypto.createHash("sha256").update(val).digest("hex")),
      0
    )
  );

async function ValidateEmail(mail) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true;
  }
  return false;
}

async function validatePassword(password) {
  if (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(password)) {
    return true;
  }
  return false;
}

export async function login(response, email, password) {
  try {
    if (db === null) {
      await init();
    }

    if (email === undefined || password === undefined) {
      console.log("email undefined");
      response.status(400).json({ error: "email or password is undefined" });
      return false;
    }

    if (ValidateEmail(email) === false) {
      console.log("email invalid");
      response.status(400).json({ error: "email is invalid" });
      return false;
    }

    const res = await collection.findOne({
      email: email,
      password: await hashNode(password),
    });
    if (res === null) {
      response.status(400).json({ error: "email or password incorrect" });
      console.log("email or password incorrect");
      return false;
    }
    response.status(200).json({ message: "login successful" });
    return res.password === hashNode(password);
  } catch (err) {
    console.log(err);
  }
}

export async function forgotPassword(response, email, newPassword) {
  try {
    if (db === null) {
      await init();
    }

    if (email === undefined || newPassword === undefined) {
      console.log("email or new password is undefined");
      response
        .status(400)
        .json({ error: "email or new password is undefined" });
      return false;
    }

    if (ValidateEmail(email) === false) {
      console.log("email invalid");
      response.status(400).json({ error: "email is invalid" });
      return false;
    }

    if (validatePassword(newPassword) === false) {
      console.log("new password invalid");
      response.status(400).json({ error: "new password is invalid" });
      return false;
    }

    collection
      .updateOne(
        { email: email },
        { $set: { password: hashNode(newPassword) } }
      )
      .then(
        (res) => {
          res
            .status(200)
            .json({ message: "password changed successfully" });
          return true;
        },
        (err) => {
          console.error(`Something went wrong: ${err}`);
          response.status(400).json({ error: "email not found" });
          return false;
        }
      );
  } catch (err) {
    console.log(err);
  }
}

export async function register(response, name, email, password) {
  try {
    if (db === null) {
      await init();
    }

    if (email === undefined || password === undefined) {
      console.log("email undefined");
      response.status(400).json({ error: "email or password is undefined" });
      return false;
    }

    if (ValidateEmail(email) === false) {
      console.log("email invalid");
      response.status(400).json({ error: "email is invalid" });
      return false;
    }

    if (validatePassword(password) === false) {
      console.log("password invalid");
      response.status(400).json({ error: "password is invalid" });
      return false;
    }

    const res = await collection.findOne({ email: email });
    if (res !== null) {
      response.status(400).json({ error: "email already exists" });
      console.log("email already exists");
      return false;
    }

    await collection.insertOne({
      name: name,
      email: email,
      password: await hashNode(password),
    });

    response.status(200).json({ message: "register is successful" });
    return true;
  } catch (err) {
    console.error(err);
  }
}

export async function close() {
  await client.close();
}
