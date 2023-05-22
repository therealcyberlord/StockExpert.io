import dotenv from "dotenv";
import NewsAPI from "newsapi";
dotenv.config();

const newsApiKey = process.env.NEWS_API_KEY;
const hfApiKey = process.env.HUGGINGFACE_API_KEY;
const newsapi = new NewsAPI(newsApiKey);

// display generic news sorted by popularity
async function genericNews(response) {
  try {
    newsapi.v2
      .topHeadlines({
        category: "business",
        language: "en",
        country: "us",
        sortBy: "popularity",
      })
      .then((data) => {
        const result = data.articles;
        response.status(200).json(result);
      });
  } catch (err) {
    response.status(400).json({ error: "error fetching news" });
  }
}

// display news by stock name
async function stockNews(response, name) {
  if (name === undefined) {
    response.status(400).json({ error: "stock is not defined" });
    return;
  }

  try {
    newsapi.v2
      .everything({
        q: name,
        language: "en",
        sortBy: "relevancy",
        page: 1,
      })
      .then((data) => {
        const result = data.articles;
        response.status(200).json(result);
      });
  } catch (err) {
    response.status(400).json({ error: "error fetching news" });
  }
}

// huggingface inference for sentiment analysis
async function runInference(response, data) {
  if (data === undefined) {
    response.status(400).json({ error: "data is not defined" });
  }
  try {
    const res = await fetch(
      // "https://api-inference.huggingface.co/models/huggingface/CodeBERTa-small-v1",
      "https://api-inference.huggingface.co/models/mrm8488/distilroberta-finetuned-financial-news-sentiment-analysis",
      {
        headers: {
          Authorization: hfApiKey,
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = await res.json();
    response.status(200).json({ result: result });
  } catch (error) {
    response.status(400).json({ error: "error fetching model inference" });
    console.error("Error: ", error);
  }
}

export { genericNews, stockNews, runInference };
