/// This file will export a function which make a request to the server to check if user is verified and authenticated
/// If the user is not authenticated, the user will be redirected to the login page
/// If the user is authenticated, the user will be redirected to the home page
export async function verifyUserLoggedIn() {
  const response = await fetch("/api/verifyUser", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(async (res) => {
    console.log(res);
    if (res.status === 200) {
      return true;
    } else {
      console.log("User not logged in");
      window.location.href = "/client/Login/login.html";
      return false;
    }
  });
  return response;
}
