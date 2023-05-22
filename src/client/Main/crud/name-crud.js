export async function getName(userID) {
  try {
    const response = await fetch(`/api/name/${userID}`, {
      method: "GET",
      headers: { "Content-Type": "plain/text" },
    });
    return await response.text();
  } catch (err) {
    console.log(err);
  }
}
