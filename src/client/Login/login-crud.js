/**
 * Sets a cookie with the provided name, value, and expiration days.
 * @param {string} cName - The name of the cookie.
 * @param {string} cValue - The value of the cookie.
 * @param {number} expDays - The number of days until the cookie expires.
 */
async function setCookie(cName, cValue, expDays) {
  let date = new Date();
  date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
}

/**
 * Logs in a user by sending a POST request to the "/api/login" endpoint with the provided email and password.
 * If the login is successful, it sets a "userId" cookie with the received user ID.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<boolean>} - A promise that resolves to true if the login is successful, false otherwise.
 */
export async function login(email, password) {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  }).then(async (res) => {
    if (res.status === 200) {
      const data = await res.json();
      await setCookie("userId", data.id, 1);
      return true;
    } else {
      console.log("Invalid email or password");
      return false;
    }
  });
  return response;
}

/**
 * Sends a POST request to the "/api/forgotPassword" endpoint with the provided email and new password.
 * @param {string} email - The user's email address.
 * @param {string} newPassword - The new password to set.
 * @returns {Promise<Object>} - A promise that resolves to the response JSON object received from the server.
 */
export async function forgotPassword(email, newPassword) {
  const response = await fetch("/api/forgotPassword", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      newPassword,
    }),
  });
  return await response.json();
}

/**
 * Validates an email address using a regular expression.
 * @param {string} mail - The email address to be validated.
 * @returns {boolean} - Returns true if the email address is valid, false otherwise.
 */
export async function ValidateEmail(mail) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true;
  }
  return false;
}

/**
 * Validates a password using a regular expression.
 * @param {string} password - The password to be validated.
 * @returns {boolean} - Returns true if the password is valid, false otherwise.
 */
async function validatePassword(password) {
  if (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(password)) {
    return true;
  }
  return false;
}
