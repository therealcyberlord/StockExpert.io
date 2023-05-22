import 'dotenv/config';
import yahooFinance from 'yahoo-finance2';

// convert form string to number and round to 2 decimal places
function ston(str) {
    return parseFloat(str).toFixed(2);
}

// handle the request for stock data (exchange name, price, change, changePercent)
export async function getStockData(response, ticker) {
    const result = await yahooFinance.quote(ticker);

    const formattedData = {
        "_id": ticker,
        "exchange": result.fullExchangeName.toLowerCase().startsWith("nasdaq") ? "NASDAQ" : "NYSE",
        "price": ston(result.regularMarketPrice),
        "change": ston(result.regularMarketChange),
        "changePercent": ston(result.regularMarketChangePercent),
    };
    response.json(formattedData);
}

// handle the request for "expert analysis" or "company summary"
export async function getSummary(response, ticker) {
    const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`;
    const result = await fetch(url).then(response => response.json());
    response.json({ "summary": result.Description });
}