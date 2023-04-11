let contacts = [];
let contact = {};
let orderedContacts = new Array([], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []);
setURL('https://gruppe-5009.developerakademie.net/smallest_backend_ever');

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
    orderContacts();
    for (let i = 0; i < orderedContacts.length; i++) {
        if (orderedContacts[i].length > 0) {
            container.innerHTML += genContactsHeader(i);
            for (let j = 0; j < orderedContacts[i].length; j++) {
                const contact = orderedContacts[i][j];
                container.innerHTML += genContactHtml(orderedContacts[i][j]);
            }
        }
    }
}

/**
 * Sort Contacts by Firstname from A to Z
 */
function sortContacts() {
    contacts = contacts.sort(function (a, b) {
        return a.name.toLowerCase().localeCompare(
            b.name.toLowerCase()
        );
    });
}

/**
 * Sort Contacts alphabetical to orderedContacts
 * 
 */
function orderContacts() {
    orderedContacts = new Array([], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []);
    for (let i = 0; i < contacts.length; i++) {
        contacts[i].id = i;
        let letter = contacts[i].name.toLowerCase().toString();
        letter = letter.replace(/\u00e4/g, "ae").replace(/\u00fc/g, "ue").replace(/\u00f6/g, "oe");
        letter = letter.slice(0, 1);
        letter = letter.charCodeAt(0) - 97;
        orderedContacts[letter].push(contacts[i]);
    }
}

/**
 * Create Contact || Add Contact to the list.
 */
function createContact() {
    let name = document.getElementById('name-input').value;
    let email = document.getElementById('email-input').value;
    let phone = document.getElementById('phone-input').value;
    let initials = getInitial(name);
    contact = {
        name: name,
        mail: email,
        phone: phone,
        initials: initials
    }
    addUser();
    toggleDNone('overlayContent');
    insertContactsToContactList()
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












/*Gen HTML Content */


/**
 * 
 * @param {JSON} contact - User from Database
 * @returns html template
 */
function genContactHtml(contact) {
    return /*html */`
    <div class="list-contact" onclick="showDetails(${contact.id})">
            <span class="contact-frame">${contact.initials}</span>
            <div>
                <p>${contact.name}</p>
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


function showDetails(id) {
    document.getElementById('contactDetails').innerHTML = '';
    document.getElementById('contactDetails').innerHTML = /*html */`
    <div class="contact-details-head">
    <span class="list-contact-frame">${contacts[id].initials}</span>
    <div class="contactInfo">
        <span class="contact-name">${contacts[id].name}</span>
        <div class="add-task"> + Add Task</div>
    </div>
    </div>
    <div class="contact-info-head">
        <p>Contact Information</p>
        <div class="contact-edit">
            <img src="./assets/img/contacts-icons/pen.png" alt="">
            <p>Edit Contact</p>
        </div>
    </div>
    <div class="contact-info-container">
        <div class="contact-info-segment">
            <span class="contact-info-title">Email</span>
            <a href="mailto:mail@egal.de">${contacts[id].mail}</a>
        </div>
        <div class="contact-info-segment">
            <span class="contact-info-title">Phone</span>
            <a href="tel:+4915166456">${contacts[id].phone}</a>
        </div>
    </div>`;
}