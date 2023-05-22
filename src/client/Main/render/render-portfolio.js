import * as crud from "../crud/portfolio-crud.js";
import * as stockDataCrud from "../crud/stockpage-crud.js";
import { renderStock } from "./render-stock.js";

/**

This function resets the content of an HTML element by removing all child elements.
@param {HTMLElement} element - The HTML element to be reset.
*/
function reset(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

/**

This function creates a portfolio pill element representing a stock in the portfolio.
@param {string} tick - The ticker symbol of the stock.
@param {string} company - The name of the company.
@param {string} price - The price of the stock.
@param {number} shares - The number of shares owned.
@param {string} changePercent - The percentage change in stock price.
@param {string} userID - The ID of the user.
@returns {HTMLElement} - The created portfolio pill element.
*/
function createPill(tick, company, price, shares, changePercent, userID) {
  const pill = document.createElement("div");
  pill.classList.add(
    "portfolio-pill",
    "row",
    "align-items-center",
    "mt-3",
    "me-1",
    "ms-1"
  );
  pill.innerHTML = `
    <div class="col mt-3 align-items-center">
      <div class="row">
        <a id="stock-ref" href="#">
          <h3 id="tick">${tick}</h3>
        </a>
      </div>
      <div class="row">
        <p>${company}</p>
      </div>
    </div>
    <div class="col mt-2 mb-2">
      <!-- TradingView Widget BEGIN -->
      <div class="tradingview-widget-container">
        <div id="tradingview_${tick}"></div>
        <div class="tradingview-widget-copyright"><a href="https://www.tradingview.com/symbols/NASDAQ-${tick}/" rel="noopener" target="_blank"><span class="blue-text">${tick} stock chart</span></a> by TradingView</div>
      </div>
    <!-- TradingView Widget END -->
    </div>
    <div class="col mt-3 align-items-center">
      <div class="row">
        <h3>${shares}</h3>
      </div>
      <div class="row">
        <p style="color: rgb(71, 183, 67)">shares</p>
      </div>
    </div>
    <div class="col mt-3 align-items-center sm">
      <div class="row">
        <h3>${price}</h3>
      </div>
      <div class="row">
        <p style="color: rgb(71, 183, 67)">${changePercent}</p>
      </div>
    </div>
    <div class="col-1 mt-3">
      <button type="button" id="remove-stock" class="btn-close" aria-label="Close"></button>
    </div>
  `;
  const removeButton = pill.querySelector("#remove-stock");
  removeButton.addEventListener("click", async () => {
    try {
      await crud.deleteStock(tick, userID);
      await renderPortfolio(content, userID);
    } catch (err) {
      console.log(err);
    }
  });
  const stockRef = pill.querySelector("#stock-ref");
  stockRef.addEventListener("click", async function () {
    await renderStock(tick);
  });
  return pill;
}

/**

This function creates portfolio pills for all stocks in the user's portfolio and appends them to the given element.
@param {HTMLElement} element - The HTML element to which the portfolio pills will be appended.
@param {string} userID - The ID of the user.
@returns {Promise} - A promise that resolves with an array of created portfolio pill elements.
*/
async function createAllPills(element, userID) {
  const stocks = await crud.readAllPortfolioStocks(userID);
  const pills = await Promise.all(
    stocks.map(async (stock) => {
      const stockPriceData = await stockDataCrud.get_stock_data(stock.ticker);
      const stockPrice = stockPriceData.price;
      const gain = (stockPrice - stock.buyInPrice / stockPrice).toFixed(2);
      // const gain = "--";
      const pill = createPill(
        stock.ticker,
        stock.name,
        `$${stockPrice}USD`,
        stock.shares,
        `${gain}%`,
        userID
      );
      element.appendChild(pill);
      return pill;
    })
  );

  return pills;
}

async function populateGraphs(userID) {
  const stocks = await crud.readAllPortfolioStocks(userID);

  for (const stock of stocks) {
    const tick = stock.ticker;
    new TradingView.widget({
      autosize: true,
      symbol: `NASDAQ:${tick}`,
      interval: "D",
      timezone: "Etc/UTC",
      theme: "light",
      style: "1",
      locale: "en",
      toolbar_bg: "#f1f3f6",
      enable_publishing: false,
      hide_top_toolbar: true,
      hide_legend: true,
      save_image: false,
      container_id: `tradingview_${tick}`,
    });
  }
}

function createForm(userID) {
  const form = document.createElement("form");
  form.innerHTML = `
    <div class="mb-3 mt-3">
      <label for="input-ticker" class="form-label">Company Ticker</label>
      <input type="text" class="form-control" id="input-ticker" aria-describedby="tickerHelp">
      <div id="tickerHelp" class="form-text">i.e. AAPL, MSFT, AMZN, GS, TSLA</div>
    </div>
    <div class="mb-3">
      <label for="input-shares" class="form-label">Shares Owned</label>  
      <input type="number" class="form-control" id="input-shares">
    </div>
    <div class="mb-3">
      <label for="input-price" class="form-label">Buy-in Price ($USD)</label>
      <input type="number" class="form-control" id="input-price">
    </div>
    <button type="button" id="add-button" class="btn btn-primary">Add</button>
  `;

  const tickerInput = form.querySelector("#input-ticker");
  const sharesInput = form.querySelector("#input-shares");
  const priceInput = form.querySelector("#input-price");
  const addButton = form.querySelector("#add-button");

  addButton.addEventListener("click", async () => {
    try {
      const addResult = await crud.createPortfolioStock(
        userID,
        tickerInput.value,
        parseInt(sharesInput.value),
        parseFloat(priceInput.value)
      );
      if (addResult.ok) {
        await renderPortfolio(content, userID);
      } else {
        alert(addResult.statusText);
      }
    } catch (err) {
      alert(err);
    }
  });

  return form;
}

export async function renderPortfolio(element, userID) {
  // Resetting the main content
  reset(element);

  // Creating the stock browser
  const contentRow = document.createElement("div");
  contentRow.classList.add("row", "mt-5", "align-items-top", "h-75");
  contentRow.id = "content-row";

  const portfolioCol = document.createElement("div");
  portfolioCol.classList.add("col-9", "h-100");
  portfolioCol.id = "portfolio-col";

  const title = document.createElement("div");
  title.classList.add("title");

  const titleParagraph = document.createElement("p");
  titleParagraph.textContent = "Portfolio";

  title.appendChild(titleParagraph);
  portfolioCol.appendChild(title);

  const mainContentPortfolio = document.createElement("div");
  mainContentPortfolio.classList.add("main-content-portfolio", "h-100");

  const inputGroup = document.createElement("div");
  inputGroup.classList.add("input-group", "mb-3", "mt-3");

  const inputGroupSpan = document.createElement("span");
  inputGroupSpan.classList.add("input-group-text");
  inputGroupSpan.id = "basic-addon1";

  const inputGroupObject = document.createElement("object");
  inputGroupObject.data = "../resources/icons/portfolio-icon.svg";
  inputGroupObject.type = "image/svg+xml";

  inputGroupSpan.appendChild(inputGroupObject);

  const input = document.createElement("input");
  input.type = "text";
  input.classList.add("form-control");
  input.placeholder = "Search for Stock Tick";
  input.setAttribute("aria-label", "Username");
  input.setAttribute("aria-describedby", "basic-addon1");

  inputGroup.appendChild(inputGroupSpan);
  inputGroup.appendChild(input);

  const containerFluid = document.createElement("div");
  containerFluid.classList.add(
    "container-fluid",
    "overflow-auto",
    "border",
    "rounded",
    "h-100"
  );

  // Generating pills and adding them to the DOM
  await createAllPills(containerFluid, userID);

  // Creating the add stock form and adding it to DOM
  const addCol = document.createElement("div");
  addCol.classList.add("col-3");
  addCol.id = "add-col";

  const addTitle = document.createElement("div");
  addTitle.classList.add("title");

  const addTitleP = document.createElement("p");
  addTitleP.textContent = "Add Stock";

  addTitle.appendChild(addTitleP);

  const mainContentAdd = document.createElement("div");
  mainContentAdd.classList.add("main-content-portfolio");

  const form = createForm(userID);
  mainContentAdd.appendChild(form);

  input.addEventListener("keyup", () => {
    const pills = containerFluid.children;
    const text = input.value;
    for (const pill of pills) {
      const tick = pill.querySelector("#tick").innerText;
      if (tick.toLowerCase().indexOf(text.toLowerCase()) > -1) {
        pill.style.display = "";
      } else {
        pill.style.display = "none";
      }
    }
  });

  // Appending remaining elements
  mainContentPortfolio.appendChild(inputGroup);
  mainContentPortfolio.appendChild(containerFluid);
  portfolioCol.appendChild(title);
  addCol.appendChild(addTitle);
  portfolioCol.appendChild(mainContentPortfolio);
  contentRow.appendChild(portfolioCol);
  addCol.appendChild(mainContentAdd);
  contentRow.appendChild(addCol);
  element.appendChild(contentRow);

  // Populating graphs
  populateGraphs(userID);
}
