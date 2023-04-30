setURL('https://gruppe-5009.developerakademie.net/smallest_backend_ever');
let users = [];
let currentUser;

/**
 * fill your empty array with users from the Server
 */
async function initUsers() {
    await downloadFromServer();
    users = JSON.parse(backend.getItem('users')) || [];
}


/**
 * delete all User from your Array
 */
function deleteUser() {
    backend.deleteItem('users');
}


/**
* hash a string with SHA-256
*/
async function hashWithSHA256(string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(string);
    const hash = await crypto.subtle.digest('SHA-256', data);
    // convert hash to hex string
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}


/**
 * register User on sign_up.html including hashed Password 
 */
async function addUser() {
    let nameInput = document.getElementById('register-name');
    let emailInput = document.getElementById('register-email');
    let passwordInput = document.getElementById('register-password');

    if (isEmailAlreadyRegistered(emailInput.value)) {
        handleEmailAlreadyRegisteredError(nameInput, emailInput, passwordInput);
        return;
    }

    let hashedPassword = await hashWithSHA256(passwordInput.value);
    let newUser = { name: nameInput.value, mail: emailInput.value, password: hashedPassword.toString(), initials: getInitial(nameInput.value), color: getRandomColor()};
    addNewUser(newUser);
    showSuccessMessage();
    setTimeout(goToLogin, 3000);
}


function isEmailAlreadyRegistered(email) {
    return users.some(user => user.mail === email);
}


function handleEmailAlreadyRegisteredError(nameInput, emailInput, passwordInput) {
    let errorMessage = document.getElementById('register-error');
    errorMessage.style.display = 'block';
    nameInput.value = '';
    emailInput.value = '';
    passwordInput.value = '';
    setTimeout(hideMailAlreadyUsed, 3000);
}


function addNewUser(newUser) {
    users.push(newUser);
    backend.setItem('users', JSON.stringify(users));
}


function showSuccessMessage() {
    const successMessage = document.getElementById('register-success');
    successMessage.style.display = 'block';
}


/**
 * add/remove class d-none to your Object
 * @param {string} id - need the id from your Object
 */
function toggleDNone(id) {
    document.getElementById(`${id}`).classList.toggle('d-none');
}


/**
 * go to index.html
 */
function goToLogin() {
    window.location.href = "index.html"
}


/**
 * Login Function including hashed Password and remember me functionality
 */
async function login() {
    let email = document.getElementById('login-email').value;
    let password = document.getElementById('login-password').value;
    let rememberMe = document.querySelector('input[name="remember-me"]').checked;
    let user = users.find(u => u.mail == email);

    if (user && await isPasswordValid(password, user.password)) {
        handleLoginSuccess(email, password, rememberMe, user);
    } else {
        handleLoginFailure();
    }
}


async function isPasswordValid(password, hashedPassword) {
    return await hashWithSHA256(password) === hashedPassword;
}


function handleLoginSuccess(email, password, rememberMe, user) {
    if (rememberMe) {
        saveLoginData(email, password);
    } else {
        clearLoginData();
    }
    setCurrentUser(user);
    goToSummary();
}


function handleLoginFailure() {
    showLoginFailureMessage();
    clearLoginFields();
}


function saveLoginData(email, password) {
    localStorage.setItem("login-email", email);
    localStorage.setItem("login-password", password);
    localStorage.setItem("rememberMeChecked", true);
}


function clearLoginData() {
    localStorage.removeItem("login-email");
    localStorage.removeItem("login-password");
    localStorage.removeItem("rememberMeChecked");
}


function setCurrentUser(user) {
    localStorage.setItem("currentUser", user.name);
}


function showLoginFailureMessage() {
    document.getElementById('login-false').style.display = 'block';
    setTimeout(hideFalseData, 3000);
}


function clearLoginFields() {
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
}


/**
 * Remember Me Checkbox on index.html load
 */
function loadLoginData() {
    let storedEmail = localStorage.getItem("login-email");
    let storedPassword = localStorage.getItem("login-password");
    let rememberMe = document.querySelector('input[name="remember-me"]');
    let rememberMeChecked = localStorage.getItem("rememberMeChecked");
    rememberMeChecked = rememberMeChecked === "true";

    if (storedEmail && storedPassword && rememberMeChecked) {
        document.getElementById("login-email").value = storedEmail;
        document.getElementById("login-password").value = storedPassword;
        rememberMe.checked = true;
    } else {
        rememberMe.checked = false;
    }
}


/**
 * Guest Login
 */
function guestLogin() {
    event.preventDefault();
    currentUser = 'Guest';
    localStorage.setItem('currentUser', 'Guest');
    goToSummary();
}


/**
 * Logout 
 */
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html"
}



/**
 * hide "false Login" Message
 */
function hideFalseData() {
    document.getElementById('login-false').style.display = 'none';
}


/**
 * hide "Mail already registered" Message
 */
function hideMailAlreadyUsed() {
    document.getElementById('register-error').style.display = 'none';
}


/**
 * show and hide Log out Button in desktop_template.html
 */
function openProfilIconMenu() {
    let logOutField = document.getElementById('log-out-field');

    if (logOutField.style.display === 'block') {
        logOutField.style.display = 'none';
    } else {
        logOutField.style.display = 'block';
    }
}


/**
 * go to sign_up.html
 */
function goToSignUp() {
    window.location.href = "sign_up.html"
}


/**
 * show and hide E-Mail sent Popup
 */
function showEmailSentMessage() {
    let popup = document.getElementById('email-sent-popup');
    popup.style.display = 'flex';
    setTimeout(hideEmailSentMessage, 3000);
}


function hideEmailSentMessage() {
    document.getElementById('email-sent-popup').style.display = 'none';
}


/**
 * show and hide reset Password Popup
 */
function showResetPasswordMessage() {
    let popup = document.getElementById('reset-password-message');
    popup.style.display = 'block';
    setTimeout(hideResetPasswordMessage, 3000);
}


function hideResetPasswordMessage() {
    document.getElementById('reset-password-message').style.display = 'none';
}

/**
 * go to Page and save status in local storage for bg
 */
function goToSummary() {
    window.location.href = 'summary.html';
    localStorage.setItem('selectedMenuItem', 'summary');
}


function goToBoard() {
    window.location.href = 'board.html';
    localStorage.setItem('selectedMenuItem', 'board');
}


function goToAddTask() {
    window.location.href = 'add_task.html';
    localStorage.setItem('selectedMenuItem', 'addTask');
}


function goToContacts() {
    window.location.href = 'contacts.html';
    localStorage.setItem('selectedMenuItem', 'contacts');
}


function goToLegalNotice() {
    window.location.href = 'legal_notice.html';
    localStorage.setItem('selectedMenuItem', 'legalNotice');
}

/**
 * highlight the Menu Nav with a Bg. necessary because on Page change CSS Classes are resettet and now we get status from Local Storage
 */
function highlightSelectedMenuItem() {
    const selectedMenuItem = localStorage.getItem('selectedMenuItem');
    const bgSummary = document.getElementById('bg-summary');
    const bgBoard = document.getElementById('bg-board');
    const bgAddTask = document.getElementById('bg-add-task');
    const bgContacts = document.getElementById('bg-contacts');
    const bgLegalNotice = document.getElementById('bg-legal-notice');
    
    switch (selectedMenuItem) {
        case 'summary':
            bgSummary.classList.add('highlight-nav');
            break;
        case 'board':
            bgBoard.classList.add('highlight-nav');
            break;
        case 'addTask':
            bgAddTask.classList.add('highlight-nav');
            break;
        case 'contacts':
            bgContacts.classList.add('highlight-nav');
            break;
        case 'legalNotice':
            bgLegalNotice.classList.add('highlight-nav');
            break;
        default:
            break;
    }
}


/**
 * The function returns the first letter of the first name and last name.
 * If the last name does not exist, then only the first letter of the first name is output
 * @example
 * getInitial('Max Mustermann');
 * @returns {String} MM
 * @param {String} username The name of the person you want to get the initials of.
 * @returns first letter of the first name and last name or only the first letter of the first name.
 * 
 */
function getInitial(username) {
    if (username.includes(' ')) {
        return username.charAt(0).toUpperCase() + username.charAt(username.lastIndexOf(' ') + 1).toUpperCase();
    } else {
        return username.charAt(0).toUpperCase();
    }
}


/**
 * Retrunt a random Color-Hexcode 
 * @returns random color hexcode (#7D735F)
 */
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}