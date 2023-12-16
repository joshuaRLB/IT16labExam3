// login.js
document.addEventListener('DOMContentLoaded', function () {
    // You can add any initialization logic here
});


function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (isValidEmail(email) && password) {
        const items = getItemsFromLocalStorage();
        const user = items.find(item => item.email === email);

        if (user) {
            const decryptedPassword = decryptPassword(user.password);
            if (password === decryptedPassword) {
                // Store username for later use
                localStorage.setItem('loggedInUser', user.email);
                alert('Login successful!');

                // Redirect to index.html after successful login
                window.location.href = 'index.html';

                // Display a welcome message (optional)
                displayWelcomeMessage();
            } else {
                displayErrorMessage('Incorrect password. Please try again.');
            }
        } else {
            displayErrorMessage('User not found. Please check your email.');
        }
    } else {
        displayErrorMessage('Please enter a valid email and password.');
    }
}

function displayErrorMessage(message) {
    // Display an error message to the user
    alert('Error: ' + message);
}

function displayWelcomeMessage() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        alert('Hello ' + loggedInUser + '! Welcome back!');
        // You can also update the HTML content or perform other actions to display the welcome message on the page
    }
}

function navigateToLogin() {
    window.location.href = 'login.html';
}

function navigateToIndex() {
    window.location.href = 'index.html';
}


// Include other functions from your existing code as needed
// ...

// You may also want to add event listeners for additional functionalities.
