import { renderStock } from "./render-stock.js";
import * as stockDataCrud from "../crud/stockpage-crud.js";
import * as watchListCrud from "../crud/watchlist-crud.js";
import { readAllNews } from "../crud/news-crud.js";

/**
 * Generates a watchlist card element.
 * @param {string} ticker - The ticker symbol of the stock.
 * @param {string} name - The name of the stock.
 * @param {string} today_change - The change in price for today.
 * @returns {HTMLElement} - The generated watchlist card element.
 */
function watchlistCardGenerator(ticker, name, today_change) {
  let card = document.createElement("div");
  card.classList.add("col-sm-6");
  card.classList.add("col-md-4");
  card.classList.add("col-lg-2");
  let card_shape = document.createElement("div");
  card_shape.classList.add("card");
  card_shape.classList.add("rounded");

  let target = document.createElement("a");
  target.classList.add("card-block");
  target.classList.add("stretched-link");
  target.classList.add("text-decoration-none");

  target.addEventListener("click", async function () {
    await renderStock(ticker);
  });

  let card_body = document.createElement("div");
  card_body.classList.add("card-body");
  let card_title = document.createElement("h5");
  card_title.classList.add("card-title");
  card_title.innerText = ticker;
  let card_text = document.createElement("p");
  card_text.classList.add("card-text");
  card_text.innerText = name;
  card_text.style.height = "5rem";
  let card_footer = document.createElement("div");
  card_footer.classList.add("card-text");
  card_footer.innerText = today_change;

  card_body.appendChild(card_title);
  card_body.appendChild(card_text);
  card_body.appendChild(card_footer);

  target.appendChild(card_body);

  card_shape.appendChild(target);
  card.appendChild(card_shape);

  return card;
}

/**
 * Generates a news card element.
 * @param {string} newsTitle - The title of the news.
 * @param {string} newsSource - The source of the news.
 * @returns {HTMLElement} - The generated news card element.
 */
function createNewCardGenerator(newsTitle, newsSource) {
  let card = document.createElement("div");
  card.classList.add("card");
  card.classList.add("rounded");
  card.classList.add("mb-4");
  let card_body = document.createElement("div");
  card_body.classList.add("card-body");
  let card_title = document.createElement("h5");
  card_title.classList.add("card-title");
  card_title.innerText = newsTitle;
  let card_text = document.createElement("p");
  card_text.classList.add("card-text");
  card_text.innerText = newsSource;

  card_body.appendChild(card_title);
  card_body.appendChild(card_text);
  card.appendChild(card_body);

  return card;
}

/**
 * Creates a trend grid element.
 * @returns {HTMLElement} - The generated trend grid element.
 */
function createTrendGenerator() {
  let trendgrid = document.createElement("div");
  trendgrid.classList.add("col-md-6");
  trendgrid.classList.add("mt-4");
  let trendheader = document.createElement("p");
  trendheader.innerText = "Latest Trends";
  trendgrid.appendChild(trendheader);

  let trendviewcontainer = document.createElement("div");
  trendviewcontainer.classList.add("tradingview-widget-container");
  trendviewcontainer.style.height = "45vh";
  trendgrid.appendChild(trendviewcontainer);

  let trendview = document.createElement("div");
  trendview.id = "tradingview_7cf02";
  trendview.style.height = "100%";
  trendviewcontainer.appendChild(trendview);

  let trendCopyRight = document.createElement("div");
  trendCopyRight.classList.add("tradingview-widget-copyright");
  let trendCopyRightLink = document.createElement("a");
  trendCopyRightLink.href = "https://www.tradingview.com/symbols/NASDAQ-NDX/";
  trendCopyRightLink.rel = "noopener";
  trendCopyRightLink.target = "_blank";
  trendCopyRight.appendChild(trendCopyRightLink);
  trendviewcontainer.appendChild(trendCopyRight);

  return trendgrid;
}

/**
 * Creates and populates the user's watchlist.
 * @param {string} userID - The ID of the user.
 * @returns {HTMLElement} - The generated watchlist element.
 */
async function createMyWatchlist(userID) {
  let row = document.createElement("div");
  row.classList.add("row");
  let headerText = document.createElement("p");
  headerText.innerText = "My Watchlist";
  row.appendChild(headerText);
  let watchlistcarddeck = document.createElement("div");
  watchlistcarddeck.classList.add("watchlistcarddeck");
  watchlistcarddeck.classList.add("card-deck");
  watchlistcarddeck.classList.add("flex-row");
  watchlistcarddeck.classList.add("flex-nowrap");
  watchlistcarddeck.classList.add("overflow-auto");
  watchlistcarddeck.classList.add("scrollbar");
  watchlistcarddeck.classList.add("d-flex");
  row.appendChild(watchlistcarddeck);

  const watchlist_stocks = await watchListCrud.readAllWatchlistStocks(userID);

  for (let i = 0; i < watchlist_stocks.length; i++) { 
    const stock = watchlist_stocks[i]; 
    const stockPriceData = await stockDataCrud.get_stock_data(stock.ticker);
    const stockPrice = stockPriceData.price;
    let ticker = stock.ticker;
    let name = stock.name;
    watchlistcarddeck.appendChild(
      watchlistCardGenerator(ticker, name, stockPrice)
    );
  }

  return row;
}

/**
 * Creates the latest trends and news section.
 * @returns {HTMLElement} - The generated trends and news container element.
 */
async function createLatestTrendsandNews() {
  let container = document.createElement("div");
  container.classList.add("container");
  container.classList.add("text-center");
  let row = document.createElement("div");
  row.classList.add("row");

  // Eventually this changes to actual data and not mock data
  let trendgrid = createTrendGenerator();

  let newsgrid = document.createElement("div");
  newsgrid.classList.add("newsgrid");
  newsgrid.classList.add("col-md-6");
  newsgrid.classList.add("mt-4");
  let newsheader = document.createElement("p");
  newsheader.innerText = "Latest News";
  let newscontent = document.createElement("div");
  newscontent.classList.add("card-deck");
  newscontent.classList.add("overflow-auto");
  newscontent.style.height = "500px";

  // Eventually this changes to actual data and not mock data
  const newsData = await readAllNews();

  for (let j = 0; j < newsData.length; j++) {
    let newsTitle = newsData[j].title;
    let newsSource = newsData[j].source.name;
    newscontent.appendChild(createNewCardGenerator(newsTitle, newsSource));
  }

  newsgrid.appendChild(newsheader);
  newsgrid.appendChild(newscontent);

  row.appendChild(trendgrid);
  row.appendChild(newsgrid);

  container.appendChild(row);
  return container;
}

/**
 * Renders the content by generating the user's watchlist and the latest trends and news section.
 * @param {HTMLElement} content - The container element to render the content in.
 * @param {string} userID - The ID of the user.
 */
export async function renderContent(content, userID) {
  console.log("Render dashboard is called");

  // const content = document.getElementById("content");
  content.innerHTML = "";
  content.appendChild(await createMyWatchlist(userID));
  content.appendChild(await createLatestTrendsandNews());

  new TradingView.widget({
    autosize: false,
    width: "100%",
    height: "100%",
    symbol: "NASDAQ:NDX",
    interval: "D",
    timezone: "Etc/UTC",
    theme: "light",
    style: "1",
    locale: "en",
    toolbar_bg: "#f1f3f6",
    enable_publishing: false,
    allow_symbol_change: true,
    container_id: "tradingview_7cf02",
  });
}
