let users = [];
loadUser();


// Registrierung auf sign_up.html
function addUser() {
    let name = document.getElementById('register-name')
    let email = document.getElementById('register-email')
    let password = document.getElementById('register-password')

    for (let i = 0; i < users.length; i++) {
        if (users[i].email === email.value) {
            // Wenn die E-Mail-Adresse bereits registriert ist, die Funktion abbrechen
            document.getElementById('register-error').style.display = 'block';
            name.value = '';
            email.value = '';
            password.value = '';
            setTimeout(hideMailAlreadyUsed, 3000);
            return;
        }
    }

    users.push({ name: name.value, email: email.value, password: password.value })

    document.getElementById('register-success').style.display = 'block';

    setTimeout(goToLogin, 3000);
    saveUser();
}

/**
 * add/remove class d-none to your Object
 * @param {string} id - need the id from your Object
 */
function toggleDNone(id) {
    document.getElementById(`${id}`).classList.toggle('d-none');
}


// Weiterleitung zur Log In Seite
function goToLogin() {
    window.location.href = "index.html"
}

// Speichert User-Daten
function saveUser() {
    let user = JSON.stringify(users);
    localStorage.setItem('users', user);
}


// Lädt User-Daten
function loadUser() {
    let user = localStorage.getItem('users');

    if (user) {
        users = JSON.parse(user);
    }
}


// Login Vorgang erfolgreich, wenn Daten aus der Registrierung verwendet werden! Wenn nicht wird im "else" Teil darauf hingewiesen!
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


// Guest Log In 
function goToSummary() {
    window.location.href = "summary.html"
}


// Anzeige von nicht korrekter Email und Passwort Nachricht wieder verbergen!
function hideFalseData() {
    document.getElementById('login-false').style.display = 'none';
}

// Anzeige von bereits registrierter Email Nachricht wieder verbergen!
function hideMailAlreadyUsed() {
    document.getElementById('register-error').style.display = 'none';
}


// Anzeige des Log out Buttons
function openProfilIconMenu() {
    let logOutField = document.getElementById('log-out-field');

    if (logOutField.style.display === 'block') {
        logOutField.style.display = 'none';
    } else {
        logOutField.style.display = 'block';
    }
}
