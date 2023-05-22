// Importing CRUD functions from './login-crud.js'
import * as crud from './login-crud.js';

// Getting DOM elements
const emailTextBox = document.getElementById('email');
const passwordTextBox = document.getElementById('pw');
const loginButton = document.getElementById('login-button');

// Adding event listener to the password text box
passwordTextBox.addEventListener('keyup', (event) => {
    if (event.keyCode === 13 || event.key === 'Enter') {
        event.preventDefault();
        loginButton.click();
    }
});

// Adding event listener to the login button
loginButton.addEventListener('click', async () => {
    const email = emailTextBox.value;
    const password = passwordTextBox.value;

    // Validating the email using the CRUD function
    if (!crud.ValidateEmail(email)) {
        alert('Invalid email address');
        return;
    }

    // Calling the login function from the CRUD module with the provided email and password
    let result = await crud.login(email, password);

    if (!result) {  
        alert("Invalid email or password");
    } else {
        window.location.replace('../Main/index.html');
    }
});

// TODO: Add forgot password button and its event listener
// const forgotPasswordButton = document.getElementById('forgot-password-button');

// forgotPasswordButton.addEventListener('click', async () => {
//     const email = emailTextBox.value;
//     const newPassword = passwordTextBox.value;

//     if (!crud.ValidateEmail(email)) {
//         alert('Invalid email address');
//         return;
//     }

//     if(!crud.validatePassword(newPassword)) {
//         alert('Invalid password');
//         return;
//     }

//     const result = await crud.forgotPassword(email, newPassword);

//     // TODO: Handle result
//     window.location.replace('/');
// });
