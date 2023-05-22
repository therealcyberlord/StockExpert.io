/**

This function creates a watchlist stock for a given user.
@param {string} userID - The ID of the user.
@param {string} ticker - The ticker symbol of the stock to be added to the watchlist.
@returns {Promise} - A promise that resolves with the response from the API.
@throws {Error} - If an error occurs during the API request.
*/
export async function createWatchlistStock(userID, ticker) {
  try {
    const body = JSON.stringify({
      userID: userID,
      ticker: ticker,
    });
    const response = await fetch("/api/watchlist/stock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });
    return response;
  } catch (err) {
    console.log(err);
  }
}

/**

This function deletes a stock from the watchlist of a given user.
@param {string} ticker - The ticker symbol of the stock to be deleted.
@param {string} userID - The ID of the user.
@returns {Promise} - A promise that resolves with the response from the API.
@throws {Error} - If an error occurs during the API request.
*/
export async function deleteStock(ticker, userID) {
  try {
    const response = await fetch(`/api/watchlist/stock/${ticker}/${userID}`, {
      method: "DELETE",
    });
    return response;
  } catch (err) {
    console.log(err);
  }
}

/**

This function retrieves all watchlist stocks for a given user.
@param {string} userID - The ID of the user.
@returns {Promise} - A promise that resolves with the watchlist stock data as JSON.
@throws {Error} - If an error occurs during the API request.
*/
export async function readAllWatchlistStocks(userID) {
  try {
    const res = await fetch(`/api/watchlist/stock/${userID}`, {
      method: "GET",
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
}
