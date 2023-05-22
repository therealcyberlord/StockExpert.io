// read all news articles pulling from the news endpoint

export async function readAllNews() {
  const response = await fetch("/api/news/all", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.status === 401) {
    return { error: "Unauthorized" };
  }
  if (response.status === 500) {
    return { error: "Server Error" };
  }
  if (response.status === 404) {
    return { error: "Not Found" };
  } else {
    return await response.json();
  }
}

// read stock specific articles pulling from the news endpoint
export async function readStockNews(name) {
  const response = await fetch(`/api/news/${name}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.status === 401) {
    return { error: "Unauthorized" };
  }
  if (response.status === 500) {
    return { error: "Server Error" };
  }
  if (response.status === 404) {
    return { error: "Not Found" };
  } else {
    return await response.json();
  }
}
