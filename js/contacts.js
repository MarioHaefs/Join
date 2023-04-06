let contacts = [];
let contact = {
    firstname: 'daran',
    lastname: 'tollername',
    mail: 'Test4@mail.de',
    phone: '012347596521'
};
let orderedContacts = new Array([], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []);
setURL('http://gruppe-5009.developerakademie.net/smallest_backend_ever');

/**
 * Load Data from server
 * 
 */
async function init() {
    await downloadFromServer();
    contacts = JSON.parse(backend.getItem('contacts')) || [];
    insertContactsToContactList();
};

/**
 * add User to Database
 */
async function addUser() {
    contacts.push(contact);
    await backend.setItem('contacts', JSON.stringify(contacts));
}

/**
 * del all Contacts from Database
 */
async function deleteContacts() {
    await backend.deleteItem('contacts');
}

/**
 * load all Contacts to contacts list
 * 
 */
async function insertContactsToContactList() {
    let container = document.getElementById('contacts-list');
    container.innerHTML = '';
    sortContacts();
    orderContacts();
    for (let i = 0; i < orderedContacts.length; i++) {
        if (orderedContacts[i].length > 0) {
            container.innerHTML += genContactsHeader(i);
            for (let j = 0; j < orderedContacts[i].length; j++) {
                const contact = orderedContacts[i][j];
                let shortname = contact.firstname.charAt(0) + contact.lastname.charAt(0);
                container.innerHTML += genContactHtml(orderedContacts[i][j], shortname);
            }
        }
    }
}

/**
 * Sort Contacts by Firstname from A to Z
 */
function sortContacts() {
    contacts = contacts.sort(function (a, b) {
        return a.firstname.toLowerCase().localeCompare(
            b.firstname.toLowerCase()
        );
    });
}

/**
 * Sort Contacts alphabetical to orderedContacts
 * 
 */
function orderContacts() {
    for (let i = 0; i < contacts.length; i++) {
        contacts[i].id = i;
        let letter = contacts[i].firstname.toLowerCase().toString();
        letter = letter.replace(/\u00e4/g, "ae").replace(/\u00fc/g, "ue").replace(/\u00f6/g, "oe");
        letter = letter.slice(0, 1);
        letter = letter.charCodeAt(0) - 97;
        orderedContacts[letter].push(contacts[i]);
    }
}









/*Gen HTML Content */


/**
 * 
 * @param {JSON} contact - User from Database
 * @param {String} shortname - Combinate first Char from Firstname and Lastname
 * @returns html template
 */
function genContactHtml(contact, shortname) {
    return /*html */`
    <div class="list-contact">
            <span class="contact-frame">${shortname}</span>
            <div>
                <p>${contact.firstname} ${contact.lastname}</p>
                <p>${contact.mail}</p>
            </div>
        </div>   
    
    `;
}

/**
 * 
 * @param {Number} i formCharCode  
 * @returns HTML template Contactlist header
 */
function genContactsHeader(i) {
    return /*html */ `
        <div class="list-header">
               ${String.fromCharCode(i + 97).toUpperCase()}
        </div>
    `;
}
