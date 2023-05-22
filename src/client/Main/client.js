import { verifyUserLoggedIn } from "./utils/verify-user.js";

await verifyUserLoggedIn();

import { renderContent } from "./render/render-dashboard.js";
import { renderPortfolio } from "./render/render-portfolio.js";
import { renderWatchlist } from "./render/render-watchlist.js";
import { renderNews } from "./render/render-news.js";
import { getCookieValue } from "./utils/cookies.js";
import { getName } from "./crud/name-crud.js";

const dashboardButton = document.getElementById("dashboard-btn");
const portfolioButton = document.getElementById("portfolio-btn");
const watchlistButton = document.getElementById("watchlist-btn");
const newsButton = document.getElementById("news-btn");
const logoutButton = document.getElementById("logout-btn");
const content = document.getElementById("content");
const userID = getCookieValue("userId");
const name = await getName(userID);

// Setting name
const welcome = document.getElementById("welcome-msg");
welcome.innerText = `Welcome back, ${name}`;

// rendering dashboard
renderContent(content, userID);

dashboardButton.addEventListener("click", () => {
  console.log("dashboard clicked");
  renderContent(content, userID);
});
portfolioButton.addEventListener("click", () => {
  renderPortfolio(content, userID);
});
watchlistButton.addEventListener("click", () => {
  renderWatchlist(content, userID);
});
newsButton.addEventListener("click", () => {
  renderNews(content);
});
logoutButton.addEventListener("click", () => {
  console.log("logout clicked");
  fetch("/api/logout", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        window.location.href = "/client/Login/login.html";
        // TODO remove cookie
      } else {
        const error = new Error(response.error);
        throw error;
      }
    })
    .catch((error) => {
      console.error(error);
    });
});
