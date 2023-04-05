let users = [];
let user = [{
    firstname: 'Test',
    lastname: 'Zwei',
    mail: 'TestZwei@mail.de',
    phone: '012347596521'
}];

setURL('http://gruppe-5009.developerakademie.net/smallest_backend_ever');

/**
 * Load Data from server
 * 
 */
async function init() {
    await downloadFromServer();
    users = JSON.parse(backend.getItem('users')) || [];
    insertUsersToContactList();
};

/**
 * add User to Database
 */
async function addUser() {
    users.push(user);
    await backend.setItem('users', JSON.stringify(users));
}

/**
 * del all Users from Database
 */
async function deleteUsers() {
    await backend.deleteItem('users');
}

/**
 * load all Users to contacts list
 * 
 */
async function insertUsersToContactList() {
    let container = document.getElementById('contacts-list');
    container.innerHTML = '';

    users.forEach(user => {
        let shortname = user[0].firstname.charAt(0) + user[0].lastname.charAt(0);
        container.innerHTML += /*html */`
        <div class="list-contact">
                <span class="user-frame">${shortname}</span>
                <div>
                    <p>${user[0].firstname} ${user[0].lastname}</p>
                    <p>${user[0].mail}</p>
                </div>
            </div>   
        
        `;
    });
}
















/*Gen HTML Content */

