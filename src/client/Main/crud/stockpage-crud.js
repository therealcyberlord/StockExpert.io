export async function get_stock_data(ticker){
  const data = await fetch(`/api/stockpage/${ticker}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
  }).then((res) => { return res.json(); });
  return data;
}

export async function get_news_data(ticker) {
  const data = await fetch(`/api/news/${ticker}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
  }).then((res) => { return res.json(); });
  return data;
}

export async function get_sentiment_data(news_headlines) {
  const data = await fetch(`/api/stockpage/sentiment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: news_headlines })
  }).then((res) => { return res.json(); });
  return data;
}

export async function get_summary(ticker) {
  const data = await fetch(`/api/stockpage/summary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "ticker": ticker })
  }).then((res) => { return res.json(); });
  return data;
}