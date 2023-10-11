setURL('https://mario-haefs.developerakademie.net/smallest_backend_ever');
let guest = {
    name: "Guest",
    mail: "guest@web.de",
    phone: '123456789',
    initials: "G",
    color: "#091931"
};
let users = [];
let currentUser;
let today = new Date().toISOString().split("T")[0];


/**
 * fill your empty array with users from the server
 */
async function initUsers() {
    await downloadFromServer();
    users = JSON.parse(backend.getItem('users')) || [];
    contact = JSON.parse(backend.getItem('contacts')) || [];
}


/**
 * delete all user
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
 * register user on sign_up.html including hashed password 
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
    let newUser = { name: nameInput.value, mail: emailInput.value, password: hashedPassword.toString(), initials: getInitial(nameInput.value), color: getRandomColor() };
    let newContact = { name: nameInput.value, mail: emailInput.value, phone: '', initials: getInitial(nameInput.value), color: getRandomColor() };
    addNewUser(newUser);
    addNewContact(newContact);
    showSuccessMessage();
    setTimeout(goToLogin, 1500);
}


/**
 * 
 * @param {mail} email 
 * @returns check if email alreay registered
 */
function isEmailAlreadyRegistered(email) {
    return users.some(user => user.mail === email);
}


/**
 * executed if email already registered. show error message
 * 
 * @param {string} nameInput 
 * @param {mail} emailInput 
 * @param {mixed} passwordInput 
 */
function handleEmailAlreadyRegisteredError(nameInput, emailInput, passwordInput) {
    let errorMessage = document.getElementById('register-error');
    errorMessage.style.display = 'block';
    nameInput.value = '';
    emailInput.value = '';
    passwordInput.value = '';
    setTimeout(hideMailAlreadyUsed, 3000);
}


/**
 * add new user to backend
 * 
 * @param {JSON} newUser 
 */
function addNewUser(newUser) {
    users.push(newUser);
    backend.setItem('users', JSON.stringify(users));
}


/**
 * add new user to backend
 * 
 * @param {JSON} newContact 
 */
function addNewContact(newContact) {
    contact.push(newContact);
    backend.setItem('contacts', JSON.stringify(contact));
}


/**
 * show register success message
 */
function showSuccessMessage() {
    const successMessage = document.getElementById('register-success');
    successMessage.style.display = 'block';
}


/**
 * add/remove class d-none to your object
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


/**
 * 
 * @param {mixed} password 
 * @param {mixed} hashedPassword 
 * @returns  comparison whether password and hash password agree
 */
async function isPasswordValid(password, hashedPassword) {
    return await hashWithSHA256(password) === hashedPassword;
}


/**
 * checks if login data is correct and if so go forward
 * 
 * @param {mail} email 
 * @param {mixed} password 
 * @param {boolean} rememberMe 
 * @param {JSON} user 
 */
function handleLoginSuccess(email, password, rememberMe, user) {
    if (rememberMe) {
        saveLoginData(email, password);
    } else {
        clearLoginData();
    }
    setCurrentUser(user);
    goToSummary();
    window.location.href = 'summary.html';
}


/**
 * handle false login
 */
function handleLoginFailure() {
    showLoginFailureMessage();
    clearLoginFields();
}


/**
 * save login data in local storage if remember me checkbox is checked
 * 
 * @param {mail} email 
 * @param {mixed} password 
 */
function saveLoginData(email, password) {
    localStorage.setItem("login-email", email);
    localStorage.setItem("login-password", password);
    localStorage.setItem("rememberMeChecked", true);
}


/**
 * if remember me is unchecked remove login data
 */
function clearLoginData() {
    localStorage.removeItem("login-email");
    localStorage.removeItem("login-password");
    localStorage.removeItem("rememberMeChecked");
}


/**
 * set current user to user name
 * 
 * @param {string} user 
 */
function setCurrentUser(user) {
    localStorage.setItem("currentUser", user.name);
}


/**
 * show login failure message
 */
function showLoginFailureMessage() {
    document.getElementById('login-false').style.display = 'block';
    setTimeout(hideFalseData, 3000);
}


/**
 * clear login fields after submit
 */
function clearLoginFields() {
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
}


/**
 * load login data from local storage if remeber me was checked last site visit
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
 * guest login 
 */
function guestLogin() {
    event.preventDefault();
    currentUser = users[0];
    localStorage.setItem('currentUser', 'Guest');
    goToSummary();
    window.location.href = 'summary.html';

}


/**
 * logout 
 */
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html"
}


/**
 * hide "false login" message
 */
function hideFalseData() {
    document.getElementById('login-false').style.display = 'none';
}


/**
 * hide "mail already registered" message
 */
function hideMailAlreadyUsed() {
    document.getElementById('register-error').style.display = 'none';
}


/**
 * show and hide log out button in desktop_template.html
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
 * show and hide help "goTo" site only @media (max-width: 600px) in desktop_template.html
 */
function openHelpMobile() {
    if (window.matchMedia('(max-width: 600px)').matches) {
        let helpMobile = document.getElementById('help-mobile');

        if (helpMobile.style.display === 'block') {
            helpMobile.style.display = 'none';
        } else {
            helpMobile.style.display = 'block';
        }
    }
}


/**
 * show and hide legal notice "goTo" site only @media (max-width: 600px) in desktop_template.html
 */
function openLegalNoticeMobile() {
    if (window.matchMedia('(max-width: 600px)').matches) {
        let legalNoticeMobile = document.getElementById('legal-notice-mobile');

        if (legalNoticeMobile.style.display === 'block') {
            legalNoticeMobile.style.display = 'none';
        } else {
            legalNoticeMobile.style.display = 'block';
        }
    }
}



/**
 * go to sign_up.html
 */
function goToSignUp() {
    window.location.href = "sign_up.html"
}


/**
 * show email sent popup
 */
function showEmailSentMessage() {
    let popup = document.getElementById('email-sent-popup');
    let mailInput = document.getElementById('forgot-pw-mail');
    popup.style.display = 'flex';
    setTimeout(hideEmailSentMessage, 3000);
    mailInput.value = '';
}


/**
 * hide email sent popup
 */
function hideEmailSentMessage() {
    document.getElementById('email-sent-popup').style.display = 'none';
}


/**
 * show reset password popup
 */
function showResetPasswordMessage() {
    let popup = document.getElementById('reset-password-message');
    popup.style.display = 'block';
    setTimeout(hideResetPasswordMessage, 3000);
}


/**
 * hide reset password popup
 */
function hideResetPasswordMessage() {
    document.getElementById('reset-password-message').style.display = 'none';
}


/**
 * save status in local storage for bgc
 */
function goToSummary() {
    localStorage.setItem('selectedMenuItem', 'summary');
}


/**
 * save status in local storage for bgc & go to summary.html
 */
function goToSummaryLogo() {
    localStorage.setItem('selectedMenuItem', 'summary');
    window.location.href = 'summary.html';
}


/**
 * save status in local storage for bgc
 */
function goToBoard() {
    localStorage.setItem('selectedMenuItem', 'board');
}


/**
 * save status in local storage for bgc & go to board.html
 */
function goToBoardAddTask() {
    localStorage.setItem('selectedMenuItem', 'board');
    window.location.href = 'board.html';
}


/**
 * save status in local storage for bgc
 */
function goToAddTask() {
    localStorage.setItem('selectedMenuItem', 'addTask');
}


/**
 * save status in local storage for bgc
 */
function goToContacts() {
    localStorage.setItem('selectedMenuItem', 'contacts');
}


/**
 * save status in local storage for bgc
 */
function goToLegalNotice() {
    localStorage.setItem('selectedMenuItem', 'legalNotice');
}


/**
 * go to legal_notice.html and save status in local storage for bgc on mobile devices
 */
function goToLegalNoticeMobile() {
    window.location.href = 'legal_notice.html';
    localStorage.setItem('selectedMenuItem', 'legalNotice');
}


/**
 * highlight the menu nav with a backgorund color. necessary because on page change CSS classes are resettet and now we get status from local storage
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