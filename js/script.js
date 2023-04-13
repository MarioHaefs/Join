setURL('https://gruppe-5009.developerakademie.net/smallest_backend_ever');
let users = [];


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
 * register User on sign_up.html
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

    users.push({ name: name.value, email: email.value, password: password.value })
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
 * Login Function
 */
function login() {
    let email = document.getElementById('login-email');
    let password = document.getElementById('login-password');
    let user = users.find(u => u.email == email.value && u.password == password.value);

    if (user) {
        window.location.href = "summary.html";
    } else {
        document.getElementById('login-false').style.display = 'block';
        setTimeout(hideFalseData, 3000);
        email.value = '';
        password.value = '';
    }
}


/**
 * Guest Login
 */ 
function goToSummary() {
    window.location.href = "summary.html"
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
