let users = [];
loadUser();


// Registrierung auf sign_up.html
function addUser() {
    let name = document.getElementById('register-name')
    let email = document.getElementById('register-email')
    let password = document.getElementById('register-password')

    users.push({name: name.value, email: email.value, password: password.value})

    document.getElementById('register-success').style.display = 'block';

    setTimeout(forwardToLogin, 3000);
    saveUser();
}


// Weiterleitung zur Log In Seite
function forwardToLogin() {
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


// Login Vorgang erfolgreich, wenn Daten aus der Registrierung verwendet werden!
function login() {
    let email = document.getElementById('login-email');
    let password = document.getElementById('login-password');
    let user = users.find(u => u.email == email.value && u.password == password.value);

    if (user) {
        window.location.href = "summary.html"
    }
}
