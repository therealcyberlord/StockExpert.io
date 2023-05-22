// Importing CRUD functions from './registration-crud.js'
import * as crud from './registration-crud.js';

// Getting DOM elements
const nameTextBox = document.getElementById('name');
const emailTextBox = document.getElementById('email');
const passwordTextBox = document.getElementById('pw');
const confirmPasswordTextBox = document.getElementById('confirmpw');
const registerButton = document.getElementById('register-button');

console.log('Register button', registerButton);

// Adding event listener to the register button
registerButton.addEventListener('click', async () => {
    // Getting values from text boxes
    const name = nameTextBox.value;
    const email = emailTextBox.value;
    const password = passwordTextBox.value;
    const confirmPassword = confirmPasswordTextBox.value;

    // Validating the password using the CRUD function
    if (!crud.validatePassword(password)) {
        alert('Invalid password');
        return;
    }
    
    // Checking if the passwords match
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    // Validating the email using the CRUD function
    if (!crud.ValidateEmail(email)) {
        alert('Invalid email address');
        return;
    }
    
    // Calling the register function from the CRUD module with the provided parameters
    const result = await crud.register(name, email, password);

    // Checking the status of the result object
    if (result.status === 404) {
        alert(result.message);
        return;
    }

    // TODO: Handle result
    // Redirecting to the login page
    window.location.replace("../Login/login.html");
});