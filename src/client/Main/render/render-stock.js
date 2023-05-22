import { get_stock_data, get_news_data, get_sentiment_data, get_summary } from "../crud/stockpage-crud.js";

// create back blob
function get_back_blob(){
    const backblob = createDiv("back-blob", []);
    const placeholder = createDiv("", ["placeholder-of-h10px"]);
    backblob.appendChild(placeholder);
    const backbtn = document.createElement("a");
    backbtn.id = "back-btn";
    backbtn.href = "dashboard.html";
    const arrow = document.createElement("object");
    arrow.data = "../../resources/icons/leftarrow.svg";
    arrow.type = "image/svg+xml";
    backbtn.appendChild(arrow);
    backbtn.appendChild(document.createTextNode(" back"));
    backblob.appendChild(backbtn);
    backblob.appendChild(placeholder.cloneNode(true));
    return backblob;
}

// create the stockchart container
const getView = (ticker, exchange) => {
    const container = createDiv("", ["tradingview-widget-container"]);
    container.style.height = "100%";
    const view = createDiv("tradingview_38d82", []);
    view.style.height = "100%";
    container.appendChild(view);
    const copyright = createDiv("", ["tradingview-widget-copyright"]);
    const link = document.createElement("a");
    link.href = `https://www.tradingview.com/symbols/${exchange}-${ticker}/`;
    link.rel = "noopener";
    link.target = "_blank";
    link.innerHTML = `<span class="blue-text">${ticker} stock chart</span> by TradingView`;
    copyright.appendChild(link);
    container.appendChild(copyright);
    return container;
};

// create a div with id and classes
function createDiv(id, classes) {
    const div = document.createElement("div");
    if (classes.length > 0) {
        div.classList.add(...classes);
    }
    if (id !== ""){
        div.id = id;
    }
    return div;
}

// create a paragraph node with text
function createP(text) {
    const p = document.createElement("p");
    p.appendChild(document.createTextNode(text));
    return p;
}

// create the latext trend widget
function create_ltst_trnd(ticker, data) {
    const ltsttrnd = createDiv("ltst-trnd", ["centered"]);
    const desc1 = createDiv("", ["desc-txt"]);
    desc1.appendChild(createP("Latest Trend"));
    ltsttrnd.appendChild(desc1);
    const content1 = createDiv("", ["main-content"]);
    const stkprice = document.createElement("h2");
    stkprice.innerText = "$" + data.price + " ";
    const stkchange = document.createElement("span");
    stkchange.innerText = (`${ data.change > 0 ? "+" : ""}${data.change}( ${data.changePercent} %)`);
    stkchange.classList.add(data.change > 0 ? "poschg" : "negchg");
    stkchange.classList.add("chg");
    stkprice.appendChild(stkchange);
    content1.appendChild(stkprice);
    const stkchrt = createDiv("stockchart", []);
    stkchrt.appendChild(getView(ticker));
    content1.appendChild(stkchrt);
    ltsttrnd.appendChild(content1);
    return ltsttrnd;
}

// create the expert analysis widget
function create_xprt_anal_frame(data){
    const xprtanal = createDiv("xprt-anal", ["centered"]);
    const desc3 = createDiv("", ["desc-txt"]);
    desc3.appendChild(createP("Stock Expert Review"));
    xprtanal.appendChild(desc3);
    const content3 = createDiv("", ["main-content"]);
    content3.style.overflow = "hidden";
    xprtanal.appendChild(content3);
    // content3.appendChild(createP("GPT Generated Summary"));
    content3.appendChild(createP("Expert Review"));
    const scrollable = createDiv("", ["scrollable"]);
    scrollable.style.overflowY = "scroll";
    // scrollable.appendChild(createP(data.expertReview));
    content3.appendChild(scrollable);
    return [scrollable, xprtanal];
}

// create the expert analysis widget
async function create_xprt_anal(scrollable, ticker) {
    const data = await get_summary(ticker);
    scrollable.appendChild(createP(data.summary));
}

// create the latest news widget
function create_ltst_news(news){
    const ltstnews = createDiv("ltst-news", ["centered"]);
    const desc4 = createDiv("", ["desc-txt"]);
    desc4.appendChild(createP("Latest News"));
    ltstnews.appendChild(desc4);
    const content4 = createDiv("", ["main-content"]);
    ltstnews.appendChild(content4);
    const scrollable2 = createDiv("", ["scrollable"]);
    content4.appendChild(scrollable2);
    // populate the news entries
    for (let news_entry of news) {
        console.log(news_entry);       // debug msg
        const newslink = document.createElement("a");
        newslink.classList.add("newslink");
        newslink.href = news_entry.url;
        newslink.target = "_blank";
        const pill = createDiv("", ["pill"]);
        newslink.appendChild(pill);
        const title = createP(news_entry.title);
        pill.appendChild(title);
        const source = createP(news_entry.source.name);
        source.classList.add("news-source");
        pill.appendChild(source);
        scrollable2.appendChild(newslink);
    }
    return ltstnews;
}

// get the frame for sentiment analysis
function get_sent_anal_frame() {
    const sentanal = createDiv("sent-anal", ["centered"]);
    const desc2 = createDiv("", ["desc-txt"]);
    desc2.appendChild(createP("Sentiment Analysis"));
    sentanal.appendChild(desc2);
    const content2 = createDiv("", ["main-content"]);
    sentanal.appendChild(content2);
    return [sentanal, content2];
}

// create the sentiment analysis widget
async function create_sent_anal(parent, sentiment){
    sentiment = await sentiment;
    console.log(sentiment);
    sentiment = sentiment.result[0][0].label;
    const sentscore = document.createElement("h2");
    sentscore.appendChild(document.createTextNode(`Sentiment: ${sentiment}`));
    parent.appendChild(sentscore);
    const senticon = createDiv("sent-icon", []);
    const senttxt = document.createElement("p");
    if (sentiment === "positive") {
        senticon.appendChild(document.createTextNode("👍"));
        senttxt.appendChild(document.createTextNode("Based on our model prediction, there is a positive sentiment"));
    } else if (sentiment === "negative"){
        senticon.appendChild(document.createTextNode("👎"));
        senttxt.appendChild(document.createTextNode("Based on our model prediction, there is a negative sentiment"));
    } else {
        senticon.appendChild(document.createTextNode("🤷"));
        senttxt.appendChild(document.createTextNode("Based on our model prediction, there is a neutral sentiment"));
    }
    parent.appendChild(senticon);
    parent.appendChild(senttxt);
}

export async function renderStock(ticker) {
    ticker = ticker.toUpperCase();
    const content = document.getElementById("content");
    content.innerHTML = "";

    // get data using crud (which calls the server apis)
    const data = await get_stock_data(ticker);
    const news = await get_news_data(ticker);

    // get sentiment by combining headlines and calling hugging face sentiment api
    let headlines = "";
    for (let news_entry of news) {
        headlines += news_entry.title + " ";
    }
    if (headlines.length > 1000) {
        headlines = headlines.substring(0, 1000);
    }
    console.log(headlines);
    let sentiment = get_sentiment_data(headlines);

    // content.appendChild(get_back_blob());

    const row2 = createDiv("row2", ["row"]);
    content.appendChild(row2);

    // left column
    const leftcol = createDiv("", ["col-md-6", "half-col"]);
    row2.appendChild(leftcol);

    // row 1 of left column
    const ltsttrnd = create_ltst_trnd(ticker, data);
    leftcol.appendChild(ltsttrnd);
    
    // row 2 of left column
    const [sentanal, content2] = get_sent_anal_frame();
    leftcol.appendChild(sentanal);
    // sentiment analysis will be populated after everything else loads to avoid delay


    // right column
    const rightcol = createDiv("", ["col-md-6", "half-col"]);
    row2.appendChild(rightcol);

    // row 1 of right column
    // const xprtanal = create_xprt_anal(data);
    const [scrollable, xprtanal] = create_xprt_anal_frame(data);
    rightcol.appendChild(xprtanal);
    
    // row 2 of right column
    const ltstnews = create_ltst_news(news);
    rightcol.appendChild(ltstnews);


    // =========================== basic frames are loaded ===========================
    // anything from now on might take longer to load (hopefully not too long)

    // populate stock chart
    new TradingView.widget(
        {
        "autosize": true,
        "symbol": `NASDAQ:${ticker}`,
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "light",
        "style": "1",
        "locale": "en",
        "toolbar_bg": "#f1f3f6",
        "enable_publishing": false,
        "allow_symbol_change": false,
        "container_id": "tradingview_38d82"
      }
    );

    // populate the expert analysis
    await create_xprt_anal(scrollable, ticker);
    // populate sentiment analysis
    await create_sent_anal(content2, sentiment);
}
