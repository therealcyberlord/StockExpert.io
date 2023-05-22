/**
 * Registers a user by sending a POST request to the "/api/register" endpoint with the provided name, email, and password.
 * @param {string} name - The user's name.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} - A promise that resolves to the response JSON object received from the server.
 */
export async function register(name, email, password) {
  const response = await fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
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
 * The regular expression ensures that the password contains at least one digit, one lowercase letter, 
 * one uppercase letter, and is between 6 and 20 characters long.
 * @param {string} password - The password to be validated.
 * @returns {boolean} - Returns true if the password is valid, false otherwise.
 */
export async function validatePassword(password) {
  if (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(password)) {
    return true;
  }
  return false;
}
