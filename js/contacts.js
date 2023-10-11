let contactsA = [];
let contact = {};
let allUsersDB;
let regUser = localStorage.getItem('currentUser');
let userData;
let userArryId;
let orderedContacts = new Array([], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []);

setURL('https://mario-haefs.developerakademie.net/smallest_backend_ever');


/**
 * load data from server
 */
async function init() {
    await downloadFromServer();
    await getAllUsers();
    contact = JSON.parse(backend.getItem('contacts')) || [];
    contactsA = JSON.parse(backend.getItem('contacts')) || [];
    insertContactsToContactList();
    showContact(0);
    document.body.classList.add('overflow');
};


/**
 * delete all contacts
 */
function deleteUser() {
    backend.deleteItem('contacts');
}


/**
 * add contacts to backend
 */
async function addContacts() {
    await backend.setItem('contacts', JSON.stringify(contactsA));
}


/**
 * load all contacts to contacts list
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
 * sort contacts by firstname from a to z
 */
function sortContacts() {
    contactsA = contactsA.sort(function (a, b) {
        return a.name.toLowerCase().localeCompare(
            b.name.toLowerCase()
        );
    });
}


/**
 * sort contacts alphabetical to orderedContacts()
 */
function orderContacts() {
    sortContacts();
    orderedContacts = new Array([], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []);
    for (let i = 0; i < contactsA.length; i++) {
        contactsA[i].id = i;
        let letter = contactsA[i].name.toLowerCase().toString();
        letter = letter.replace(/\u00e4/g, "ae").replace(/\u00fc/g, "ue").replace(/\u00f6/g, "oe");
        letter = letter.slice(0, 1);
        letter = letter.charCodeAt(0) - 97;
        orderedContacts[letter].push(contactsA[i]);
    }
}


/**
 * return a random color-hexcode 
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


/**
 * returns the first letter of the first name and last name.
 * if the last name does not exist, then only the first letter of the first name is output
 * @example
 * getInitial('Max Mustermann');
 * @returns {String} MM
 * @param {String} username the name of the person you want to get the initials of.
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
 * change activ contact and highlight it in contact list
 */
function changeActiv() {
    let btnContainer = document.getElementById('contacts-list');
    let btns = btnContainer.getElementsByClassName('list-contact');
    for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function () {
            var current = document.getElementsByClassName("list-contact-activ");
            current[0].className = current[0].className.replace("list-contact-activ", "");
            this.className += " list-contact-activ";
        }
        );
    }
}


/**
 * shows the first contact at the details
 */
async function showContact(id) {
    changeActiv();
    let btnContainer = document.getElementById('contacts-list');
    let btns = btnContainer.getElementsByClassName('list-contact');
    let contactId;
    if (id) {
        contactId = id;
    } else {
        if (btns.length > 0) {
            contactId = btns[0].id;
        } else {
            return;
        }
    }
    let contactElement = document.getElementById(contactId);
    Array.from(document.querySelectorAll('.list-contact.list-contact-activ')).forEach((el) => el.classList.remove('list-contact-activ'));
    contactElement.className += " list-contact-activ";
    showDetails(contactId);
}


/**
 * get all users from backend 
 */
async function getAllUsers() {
    allUsersDB = await JSON.parse(backend.getItem('users')) || [];
    getCurrentUserData();
}


/**
 * get current user data from backend array users
 */
async function getCurrentUserData() {
    await allUsersDB.forEach(function users(value, index) {
        if (value.name === regUser) {
            userData = value;
            userArryId = index;
            contactsA = value.contacts || [];
        }
    })
}


/**
 * delete user from contacts
 * @param {number} userId 
 */
function delContact(userId) {
    contactsA.splice(userId, 1);
    addContacts();
    insertContactsToContactList();
    animationAndPushToServer();
}


/**
 * add contact to contacts
 */
async function addContact() {
    let name = document.getElementById('name-input').value;
    let email = document.getElementById('email-input').value;
    let phone = document.getElementById('phone-input').value;

    let initials = getInitial(name);
    let color = getRandomColor();
    let newContact = {
        name: name,
        mail: email,
        phone: phone,
        initials: initials,
        color: color
    };

    // Retrieve contacts from the server
    await downloadFromServer();
    // Add the new contact to the contacts array
    contactsA.push(newContact);
    // Save the updated contacts to the server
    await addContacts();
    // Refresh the contact list and display the newly added contact
    insertContactsToContactList();
    showContact(newContact.id);
    toggleDNone('overlayContent');
}



/**
 * edit contact infos
 * @param {Integer} id - id from user you want to edit
 */
function editContact(id) {
    let name = document.getElementById('name-input').value;
    let email = document.getElementById('email-input').value;
    let phone = document.getElementById('phone-input').value;
    let initials = getInitial(name);
    contactsA[id].name = name;
    contactsA[id].mail = email;
    contactsA[id].phone = phone;
    contactsA[id].initials = initials;
    animationAndPushToServer();
    addContacts();
    showContact(id);
}


/**
 * starts animation of edit contact && add contacts to contact list and backend server
 */
function animationAndPushToServer() {
    addContactsToUser();
    toggleDNone('overlayContent');
    insertContactsToContactList();
    showContact(0);
}


/**
 * push user to backend server
 */
async function pushToServer() {
    await backend.setItem('users', JSON.stringify(allUsersDB))
}


/**
 * add contacts to user
 */
function addContactsToUser() {
    userData = { ...userData, contacts: contactsA };
    allUsersDB.splice(userArryId, 1);
    allUsersDB.push(userData);
    pushToServer();
}


/**
 * media querys for devices  windowWidth < 1000px 
 */
function showDetailsAtMobile() {
    let windowWidth = window.innerWidth;
    if (windowWidth < 1000) {
        document.getElementById('contacts-list').classList.add('d-none')
        document.getElementsByClassName('contact-info')[0].classList.remove('d-none-mobile')
        document.getElementsByClassName('new-contact')[0].classList.add('d-none')
        document.getElementById('mobile-menu').innerHTML = /*html */`
                <div class="mobile-icon"><img src="./assets/img/contacts-icons/pen-white.png" alt=""></div>
        `;
    }
}


/**
 * hide infos of contacts
 */
function hideContactInfo() {
    document.getElementById('contacts-list').classList.remove('d-none')
    document.getElementsByClassName('contact-info')[0].classList.add('d-none-mobile')
    document.getElementsByClassName('new-contact')[0].classList.remove('d-none')
    document.getElementById('mobile-menu').innerHTML = '';
}


/**
 * add scroll function
 */
function addScroll() {
    document.getElementById('overlayAddTask').classList.remove('display-none');
    document.getElementById('overlayAddTask').classList.add('overlay-add-task');
    document.getElementById('mobileCreate').style.visibility = 'visible';
    renderOverlayAddTask();
    getDateOverlay();
}


/**
 * close overlay contacts add task
 */
function closeOverlayContacts() {
    clearAll();
    document.getElementById('overlayAddTask').classList.remove('overlay-add-task');
    document.getElementById('overlayAddTask').classList.add('display-none');
    document.body.classList.remove('overflow-hidden');
    document.getElementById('mobileCreate').style.visibility = 'hidden';
}


/**********Gen HTML Content ***********/

/**
 * 
 * @param {JSON} contact - User from Database
 * @returns html template
 */
function genContactHtml(contact) {
    return /*html */`
    <div class="list-contact" onclick="showDetails(${contact.id}); showDetailsAtMobile(${contact.id});" id="${contact.id}">
            <span class="contact-frame" style="background-color: ${contact.color}" >${contact.initials}</span>
            <div class="list-contact-info">
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


/**
 * html code of contact details
 * @param {number} id 
 */
function showDetails(id) {
    let editname = id;
    document.getElementById('contactDetails').innerHTML = '';
    document.getElementById('contactDetails').innerHTML = /*html */`
        <div class="contact-details-head">
        <span class="list-contact-frame" style="background-color: ${contactsA[id].color}">${contactsA[id].initials}</span>
        <div class="contactInfo">
            <span class="contact-name">${contactsA[id].name}</span>
        </div>
        </div>
        <div class="contact-info-head">
            <p>Contact Information</p>
            <div class="contact-edit">
                <img src="./assets/img/contacts-icons/pen.png" alt="">
                <p onclick="editShowContact(${editname})">Edit Contact</p>
            </div>
        </div>
        <div class="contact-info-container">
            <div class="contact-info-segment">
                <span class="contact-info-title">Email</span>
                <a href="mailto:mail@egal.de">${contactsA[id].mail}</a>
            </div>
            <div class="contact-info-segment">
                <span class="contact-info-title">Phone</span>
                <a href="tel:+4915166456">${contactsA[id].phone}</a>
            </div>
        </div>
        <div id="mobile-menu" onclick="editShowContact(${editname})"></div>`;
}


/**
 * show contact details if contact is already registered. show create contact details if not
 * @param {Array} contact 
 */
function editShowContact(contact) {
    document.getElementById('overlayContent').innerHTML = ''; //createContact

    if (typeof contact !== 'undefined') {
        showEditContact(contact);
    } else {
        showCreateContact();
    }
    toggleDNone('overlayContent');
}


/**
 * show create contact window
 */
function showCreateContact() {
    document.getElementById('overlayContent').innerHTML =  /*html */`
    <div class="close-top">
        <img src="./assets/img/contacts-icons/close-white.png" alt="" onclick="toggleDNone('overlayContent')" class="white">
    </div><div class="overlay-left">        
    <img src="./assets/img/menu-logo.png" alt="" id="logo">
    <p class="overlay-title">Add contact</p>
    <p>Task are better with a team!</p>
    <div class="overlay-sep"></div>
</div>
<!-- createContact -->
<div class="overlay-right">
    <img src="./assets/img/contacts-icons/userIcon.png" alt="" class="user-icon">
    <form action="#" onsubmit="addContact(); return false">
        <input class="name-input" id="name-input" placeholder="Name" type="text" pattern="[a-zA-ZÄäÜüÖöß ]*" maxlength="30" required>
        <input class="email-input" id="email-input" placeholder="Email" type="email" required>
        <input class="phone-input" id="phone-input" placeholder="Phone" type="number" minlength="6" maxlength="30" required>
        <div class="buttons">
            <button type="button" class="cancel-contact-btn" onclick="toggleDNone('overlayContent')">Cancel </button>
            <button type="submit" class="add-contact-btn" >
                Create contact
            </button>
        </div>
    </form>
    <div class="close">
        <img src="./assets/img/contacts-icons/close.png" alt="" onclick="toggleDNone('overlayContent')" class="dark">
    </div>
</div>`
}


/**
 * show edit contact window
 * @param {number} id 
 */
function showEditContact(id) {
    let userId = id;
    document.getElementById('overlayContent').innerHTML =  /*html */`<div class="overlay-left">
        <div class="close-top">
        <img src="./assets/img/contacts-icons/close-white.png" alt="" onclick="toggleDNone('overlayContent')" class="white">
    </div>
    <img src="./assets/img/menu-logo.png" alt="" id="logo">
    <p class="overlay-title">Edit contact</p>
    <div class="overlay-sep"></div>
</div>
<div class="overlay-right">
    <img class="img-d-none" src="./assets/img/contacts-icons/userIcon.png" alt="">    
    <form action="#" onsubmit="editContact(${userId}); return false">
        <input class="name-input" id="name-input" placeholder="Name" type="text" pattern="[a-zA-ZÄäÜüÖöß ]*" maxlength="30" required value="${contactsA[id].name}">
        <input class="email-input" id="email-input" placeholder="Email" type="email" required value="${contactsA[id].mail}">
        <input class="phone-input" id="phone-input" placeholder="Phone" type="number" minlength="6" maxlength="30" required value="${contactsA[id].phone}">
        <div class="buttons">
            <button type="button" class="cancel-contact-btn" onclick="delContact(${userId})">Delete</button>
            <button type="submit" class="add-contact-btn" >
                Save
            </button>
        </div>        
    </form>
    <div class="close">
        <img src="./assets/img/contacts-icons/close.png" alt="" onclick="toggleDNone('overlayContent')" class="dark">
    </div>
</div>`
}