import express from "express";
import logger from "morgan";

import expressSession from "express-session";
import * as userController from "./server/controller/user.controller.js";
import * as stockController from "./server/controller/stock.controller.js";
import * as newsController from "./server/controller/news.controller.js";
import * as portfolioController from "./server/controller/portfolio.controller.js";
import * as watchlistController from "./server/controller/watchlist.controller.js";
import * as nameController from "./server/controller/name.controller.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import auth from "./auth.js";

// We will use __dirname later on to send files back to the client.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(dirname(__filename));

const app = express();
const port = 3000;

// Session configuration
const sessionConfig = {
  // set this encryption key in Heroku config (never in GitHub)!
  secret: process.env.SECRET || "SECRET",
  cookie: { maxAge: 3600000 },
  resave: false,
  saveUninitialized: false,
};

// Setup the session middleware
app.use(expressSession(sessionConfig));
app.use(logger("dev"));
// Allow JSON inputs
app.use(express.json());
// Allow URLencoded data
app.use(express.urlencoded({ extended: true }));
// Allow static file serving
app.use("/client", express.static("src/client/"));
// Configure our authentication strategy
auth.configure(app);

// Our own middleware to check if the user is authenticated
function checkLoggedIn(request, response, next) {
  if (request.isAuthenticated()) {
    // If we are authenticated, run the next route.
    next();
  } else {
    // Otherwise, redirect to the login page
    response.status(401).json({ message: "user is not logged in" });
  }
}

// Routes for / to redirect to login page
app.get("/", async (request, response) => {
  response.redirect("/client/Login/login.html");
});

// Routes for register to register a user
app.post("/api/register", async (request, response) => {
  const options = request.body;
  console.log("options", options);
  userController.register(
    response,
    options.name,
    options.email,
    options.password
  );
});

// Routes for login to login a user, this redirects to the success/ failure redirects below while authenticating the user
// The auth middleware is used to authenticate the user, made using passport 
app.post(
  "/api/login",
  auth.authenticate("local", {
    successRedirect: "/api/login/success",
    failureRedirect: "/api/login/failure",
  })
);

app.get("/api/verifyUser", checkLoggedIn, async (request, response) => {
  console.log("user is logged in");
  response.status(200).json({ message: "user is logged in" });
});

// Redirect routes for login failure
app.get("/api/login/failure", (req, res) => {
  res.sendFile("/client/Login/login.html", { root: __dirname });
});

// Redirect routes for login success
app.get("/api/login/success", checkLoggedIn, async (req, res) => {
  res.status(200).json({ message: "login successful", id: req.user });
});

// Route for logout, this just logs the user out and redirects to the login page
app.get("/api/logout", (request, response) => {
  request.logout(function (err) {
    if (err) {
      return next(err);
    }
    response.redirect("/client/Login/login.html");
  });
});

// TODO: For future another feature, forgot password
app.post("/api/forgotPassword", async (request, response) => {
  const options = request.body;
  userController.forgotPassword(response, options.email, options.newPassword);
});

app.get("/api/stockpage/:ticker", checkLoggedIn, async (request, response) => {
  const ticker = request.params.ticker;
  stockController.getStockData(response, ticker);
});

// app.get("/api/stockpage/sentiment", checkLoggedIn, async (request, response) => {
app.post(
  "/api/stockpage/sentiment",
  checkLoggedIn,
  async (request, response) => {
    const data = request.body.data;
    newsController.runInference(response, data);
  }
);

app.post(
  "/api/stockpage/summary/",
  checkLoggedIn,
  async (request, response) => {
    const ticker = request.body.ticker;
    stockController.getSummary(response, ticker);
  }
);

// handles everything related to news
app.get("/api/news/all", checkLoggedIn, async (request, response) => {
  newsController.genericNews(response);
});

app.get("/api/news/:name", checkLoggedIn, async (request, response) => {
  const name = request.params.name;
  newsController.stockNews(response, name);
});

// Routes For Portfolio
app.get(
  "/api/portfolio/stock/:userID",
  checkLoggedIn,
  async (request, response) => {
    const userID = request.params.userID;
    portfolioController.getAllStocks(response, userID);
  }
);

app.post("/api/portfolio/stock", checkLoggedIn, async (request, response) => {
  const body = request.body;
  portfolioController.createStock(
    response,
    body.userID,
    body.ticker,
    body.shares,
    body.buyInPrice
  );
});

app.delete(
  "/api/portfolio/stock/:ticker/:userID",
  checkLoggedIn,
  async (request, response) => {
    const ticker = request.params.ticker;
    const userID = request.params.userID;
    portfolioController.deleteStock(response, ticker, userID);
  }
);

// Routes For Watchlist
app.get(
  "/api/watchlist/stock/:userID",
  checkLoggedIn,
  async (request, response) => {
    const userID = request.params.userID;
    watchlistController.getAllStocks(response, userID);
  }
);

app.post("/api/watchlist/stock", checkLoggedIn, async (request, response) => {
  const body = request.body;
  watchlistController.createStock(response, body.userID, body.ticker);
});

app.delete(
  "/api/watchlist/stock/:ticker/:userID",
  checkLoggedIn,
  async (request, response) => {
    const ticker = request.params.ticker;
    const userID = request.params.userID;
    watchlistController.deleteStock(response, ticker, userID);
  }
);

// Route for name
app.get("/api/name/:userID", checkLoggedIn, async (request, response) => {
  const userID = request.params.userID;
  nameController.getName(response, userID);
});

app.listen(port, () => {
  console.log(`Server started on port http://localhost:${port}`);
});

app.get("*", async (request, response) => {
  response.status(404).send(`Not found: ${request.path}`);
});
