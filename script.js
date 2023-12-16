document.addEventListener('DOMContentLoaded', function () {
    displayItems();
});

let selectedRowIndex = -1;

function addItem() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Check for blank spaces in the password
    if (isValidEmail(email) && password.trim() !== '' && password === password.trim()) {
        // Check for duplicates
        if (!isDuplicate({ email, password })) {
            saveItem({ email, password });
            displayItems();
            clearForm();
        } else {
            alert('Item with the same email already exists.');
        }
    } else {
        alert('Please enter a valid email and fill in a non-empty password without leading or trailing spaces.');
    }
}


function isValidEmail(email) {
    // Simple email validation: Check if the email contains @ and a valid domain
    return /\S+@\S+\.\S+/.test(email);
}

function encryptPassword(password) {
    // Implement your encryption logic here (e.g., Caesar cipher)
    const shift = 3; // Example shift value
    let encryptedText = "";
    for (let i = 0; i < password.length; i++) {
        let char = password[i];
        if (char.match(/[a-z]/i)) {
            let isUpper = char === char.toUpperCase();
            char = char.toLowerCase();
            let encryptedChar = String.fromCharCode(((char.charCodeAt(0) - 97 + shift) % 26) + 97);
            if (isUpper) {
                encryptedChar = encryptedChar.toUpperCase();
            }
            encryptedText += encryptedChar;
        } else {
            encryptedText += char;
        }
    }
    return encryptedText;
}

function decryptPassword(encryptedPassword) {
    // Implement your decryption logic here (e.g., Caesar cipher)
    const shift = 3; // Example shift value for decryption
    let decryptedText = "";
    for (let i = 0; i < encryptedPassword.length; i++) {
        let char = encryptedPassword[i];
        if (char.match(/[a-z]/i)) {
            let isUpper = char === char.toUpperCase();
            char = char.toLowerCase();
            let decryptedChar = String.fromCharCode(((char.charCodeAt(0) - 97 - shift + 26) % 26) + 97);
            if (isUpper) {
                decryptedChar = decryptedChar.toUpperCase();
            }
            decryptedText += decryptedChar;
        } else {
            decryptedText += char;
        }
    }
    return decryptedText;
}

function encryptCaesarCipher(plaintext, shift) {
    let encryptedText = "";
    for (let i = 0; i < plaintext.length; i++) {
        let char = plaintext[i];
        if (char.match(/[a-z]/i)) {
            let isUpper = char === char.toUpperCase();
            char = char.toLowerCase();
            let encryptedChar = String.fromCharCode(((char.charCodeAt(0) - 97 + shift) % 26) + 97);
            if (isUpper) {
                encryptedChar = encryptedChar.toUpperCase();
            }
            encryptedText += encryptedChar;
        } else {
            encryptedText += char;
        }
    }
    return encryptedText;
}

function decryptCaesarCipher(ciphertext, shift) {
    return encryptCaesarCipher(ciphertext, -shift);
}

function isDuplicate(newItem) {
    const items = getItemsFromLocalStorage();
    return items.some(item => item.email === newItem.email);
}

function saveItem(item) {
    let items = getItemsFromLocalStorage();
    // Encrypt the password before saving
    item.password = encryptPassword(item.password);
    items.push(item);
    localStorage.setItem('items', JSON.stringify(items));
}

function getItemsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('items')) || [];
}

function displayItems() {
    const itemList = document.getElementById('itemList');
    itemList.innerHTML = '';

    const items = getItemsFromLocalStorage();
    items.forEach((item, index) => {
        const row = itemList.insertRow();
        row.insertCell(0).textContent = item.email;
        row.insertCell(1).textContent = item.password; // Display encrypted password

        row.onclick = function () {
            selectedRowIndex = index;
            highlightSelectedRow();
            displaySelectedPassword(); // Display decrypted password in the input field
        };
    });
}

function displaySelectedPassword() {
    const items = getItemsFromLocalStorage();
    const originalItem = items[selectedRowIndex];

    // Display decrypted password in the input field
    document.getElementById('password').value = decryptPassword(originalItem.password);
}



function highlightSelectedRow() {
    const rows = document.querySelectorAll('#itemList tr');
    rows.forEach((row, index) => {
        row.classList.toggle('selected', index === selectedRowIndex);
    });
}

function editSelected() {
    if (selectedRowIndex !== -1) {
        const items = getItemsFromLocalStorage();
        const originalItem = items[selectedRowIndex];

        const newPassword = document.getElementById('password').value;

        if (newPassword) {
            const encryptedPassword = encryptPassword(newPassword);

            // Only update the password field
            originalItem.password = encryptedPassword;

            localStorage.setItem('items', JSON.stringify(items));
            displayItems();
            clearForm();
        } else {
            alert('Please fill in the password field');
        }
    } else {
        alert('Please select an item to edit');
    }
}

function deleteSelected() {
    if (selectedRowIndex !== -1) {
        const items = getItemsFromLocalStorage();
        items.splice(selectedRowIndex, 1);
        localStorage.setItem('items', JSON.stringify(items));
        selectedRowIndex = -1; 
        displayItems();
        clearForm();
    } else {
        alert('Please select an item to delete');
    }
}

function clearForm() {
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    selectedRowIndex = -1;
    highlightSelectedRow(); 
}

function navigateToLogin() {
    window.location.href = 'login.html';
}

function navigateToIndex() {
    window.location.href = 'index.html';
}
//Backup Recovery
function backupData() {
    const items = getItemsFromLocalStorage();
    const backupData = JSON.stringify(items);

    // Save backupData to a file named 'backup.txt'
    const blob = new Blob([backupData], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'backup.txt';
    link.click();
}

function recoverData() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';

    fileInput.addEventListener('change', function (event) {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const backupData = e.target.result;
                const items = JSON.parse(backupData);

                // Save recovered data to local storage
                localStorage.setItem('items', JSON.stringify(items));

                // Refresh the displayed items
                displayItems();
            };

            reader.readAsText(file);
        }
    });

    fileInput.click();
}