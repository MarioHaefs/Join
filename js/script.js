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
    let name = document.getElementById('register-name')
    let email = document.getElementById('register-email')
    let password = document.getElementById('register-password')

    for (let i = 0; i < users.length; i++) {
        if (users[i].email === email.value) {
            // If Mail already registered, stop sign in
            document.getElementById('register-error').style.display = 'block';
            name.value = '';
            email.value = '';
            password.value = '';
            setTimeout(hideMailAlreadyUsed, 3000);
            return;
        }
    }

    const hashedPassword = await hashWithSHA256(password.value);

    users.push({ name: name.value, email: email.value, password: hashedPassword.toString() })
    await backend.setItem('users', JSON.stringify(users));

    document.getElementById('register-success').style.display = 'block';

    setTimeout(goToLogin, 3000);
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
    let email = document.getElementById('login-email');
    let password = document.getElementById('login-password');
    let rememberMe = document.querySelector('input[name="remember-me"]');

    let user = users.find(u => u.email == email.value);

    if (user) {
        const hashedPassword = await hashWithSHA256(password.value);
        // compare the hashed password with the stored hashed password
        if (hashedPassword === user.password) {
            // If remember me is checked, save login data in localStorage
            if (rememberMe.checked) {
                localStorage.setItem("login-email", email.value);
                localStorage.setItem("login-password", password.value);
                localStorage.setItem("rememberMeChecked", true);
            } else {
                // If remember me is not checked, remove login data from localStorage
                localStorage.removeItem("login-email");
                localStorage.removeItem("login-password");
                localStorage.removeItem("rememberMeChecked");
            }
            currentUser = user;
            localStorage.setItem("currentUser", JSON.stringify(user));
            window.location.href = "summary.html";
        } else {
            document.getElementById('login-false').style.display = 'block';
            setTimeout(hideFalseData, 3000);
            email.value = '';
            password.value = '';
        }
    } else {
        document.getElementById('login-false').style.display = 'block';
        setTimeout(hideFalseData, 3000);
        email.value = '';
        password.value = '';
    }
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

    // If login data is stored and remember me is checked, fill in input fields and check the checkbox
    if (storedEmail && storedPassword && rememberMeChecked) {
        document.getElementById("login-email").value = storedEmail;
        document.getElementById("login-password").value = storedPassword;
        rememberMe.checked = true;
    } else {
        // If remember me is not checked or there is no stored login data, uncheck the checkbox
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
    window.location.href = 'summary.html';
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
