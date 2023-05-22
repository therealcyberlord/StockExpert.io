import { readAllNews } from "../crud/news-crud.js";

function createNewsCard(src, title, description, date, source, link) {
  const newsContainer = document.getElementById("news-container");
  const list = document.createElement("li");
  list.classList.add("list-group-item", "mt-3", "mb-3");

  // Create a card element
  const card = document.createElement("div");
  card.classList.add("card");

  // Create a card body element
  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  // create an image element
  const image_node = document.createElement("IMG");
  image_node.classList.add("card-img-top");
  image_node.src = src;
  cardBody.appendChild(image_node);

  // Create a title element
  const title_node = document.createElement("h5");
  title_node.classList.add("card-title");
  title_node.textContent = title;
  cardBody.appendChild(title_node);

  // Create a description element
  const description_node = document.createElement("p");
  description_node.classList.add("card-text");
  description_node.textContent = description;
  cardBody.appendChild(description_node);

  // Create a date element
  const date_node = document.createElement("p");
  date_node.classList.add("card-text");
  date_node.textContent = date;
  cardBody.appendChild(date_node);

  // Create a source element
  const source_node = document.createElement("p");
  source_node.classList.add("card-text");
  source_node.textContent = source;
  cardBody.appendChild(source_node);

  // Create a link element
  const link_node = document.createElement("a");
  link_node.classList.add("btn", "btn-primary");
  link_node.href = link;
  link_node.textContent = "Read More";
  cardBody.appendChild(link_node);

  card.appendChild(cardBody);
  list.appendChild(card);

  // Append the card to the news container
  newsContainer.appendChild(list);
}

const PAGE_SIZE = 3; // Number of news cards per page
let currentPage = 1; // Current page number
const titleLimit = 30;
const descriptionLimit = 50;

let content_inner_html = `<div class="container-fluid custom-bg mt-5">
<div class="row custom-bg">
  <div class="col-lg-6 col-md-12">
    <div class="card">
      <div class="card-body">
        <div class="MajorIndexes">
          <div class="MajorIndexesHeader">
            <h1>Major Indices 📈</h1>
            <p></p>
          </div>
          <div class="MajorIndexesContent">
            <div class="container">
              <div id="navbar-nav" class="d-flex flex-row"></div>
              <!-- TradingView Widget BEGIN -->
              <div
                class="tradingview-widget-container"
                style="height: 45vh"
              >
                <div id="tradingview_7cf02" style="height: 100%"></div>
                <div class="tradingview-widget-copyright">
                  <a
                    href="https://www.tradingview.com/symbols/NASDAQ-NDX/"
                    rel="noopener"
                    target="_blank"
                  ></a>
                </div>
                <script
                  type="text/javascript"
                  src="https://s3.tradingview.com/tv.js"
                ></script>
              </div>
              <!-- TradingView Widget END -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="col-lg-6 col-md-12">
    <div class="card">
      <div class="card-body">
        <div class="LatestNews">
          <div class="LatestNewsHeader">
            <h1>Latest News</h1>
          </div>
          <div class="MajorIndexesContent">
            <div class="LatestNews">
              <ul
                class="list-group list-group-flush overflow-auto"
                style="max-height: 500px"
              >
                <div id="news-container" class="container"></div>
              </ul>
              <div class="row justify-content-evenly mt-3">
                <div class="col-auto">
                  <button
                    id="prevBtn"
                    class="btn btn-outline-secondary btn-lg"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"
                      />
                      <path d="M0 0h24v24H0z" fill="none" />
                    </svg>
                  </button>
                </div>
                <div class="col-auto text-center">
                  <span id="page-number"> </span>
                </div>
                <div class="col-auto">
                  <button
                    id="nextBtn"
                    class="btn btn-outline-secondary btn-lg"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"
                      />
                      <path d="M0 0h24v24H0z" fill="none" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>`;

// renders news page
export async function renderNews(content) {
  console.log("Render news is called");
  content.innerHTML = "";
  content.innerHTML = content_inner_html;

  new TradingView.widget({
    autosize: true,
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

  function createIndex(index) {
    const navbar = document.getElementById("navbar-nav");
    const listItem = document.createElement("div");
    listItem.classList.add("active");

    // Create a new button element
    const button = document.createElement("button");
    button.classList.add("btn", "btn-secondary");
    button.id = index;
    button.textContent = index;

    // Append the button to the list item
    listItem.appendChild(button);
    navbar.appendChild(listItem);
  }

  const stockIndices = ["NASDAQ", "S&P 500", "FTSE", "BAT100"];

  // stockIndices.forEach((stockIndex) => {
  //   createIndex(stockIndex);
  // });

  const newsData = await readAllNews();
  console.log(newsData);

  // Function to display news cards for a given page
  function displayNewsCards(page) {
    // Clear existing news cards
    const newsContainer = document.getElementById("news-container");
    newsContainer.innerHTML = "";

    // Calculate start and end index of news items for the current page
    const startIndex = (page - 1) * PAGE_SIZE;
    const endIndex = Math.min(startIndex + PAGE_SIZE, newsData.length);

    // Iterate over the newsData array and call createNewsCard function on each element
    for (let i = startIndex; i < endIndex; i++) {
      const imageSrc = newsData[i].urlToImage;
      const title = newsData[i].title;
      const description = newsData[i].description;
      const date = new Date(newsData[i].publishedAt);
      const source = newsData[i].source.name;
      const link = newsData[i].url;

      // create news card, it will feature image, title, description, date, source and link
      createNewsCard(
        imageSrc,
        title.length > titleLimit ? `${title.slice(0, titleLimit)}...` : title,
        description.length > descriptionLimit
          ? `${description.slice(0, descriptionLimit)}...`
          : description,
        date.toLocaleDateString(),
        source,
        link
      );
    }

    // Display the current page number and total number of pages to the user
    const pageDisplay = document.getElementById("page-number");
    const totalPages = Math.ceil(newsData.length / PAGE_SIZE);
    pageDisplay.textContent = `Page ${page} out of ${totalPages}`;
  }

  // Call the displayNewsCards function for the initial page
  displayNewsCards(currentPage);

  // Function to handle page navigation
  function navigateToPage(page) {
    currentPage = page;
    displayNewsCards(currentPage);
  }

  // Event listener for previous button
  document.getElementById("prevBtn").addEventListener("click", () => {
    if (currentPage > 1) {
      navigateToPage(currentPage - 1);
    }
  });

  // Event listener for next button
  document.getElementById("nextBtn").addEventListener("click", () => {
    if (currentPage < Math.ceil(newsData.length / PAGE_SIZE)) {
      navigateToPage(currentPage + 1);
    }
  });
}
