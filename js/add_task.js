let prio;
let edit_active = false;
let you = false;
let enter_email = false;
let user;
let userId;
let current_user;
let button_delay = false;
let checkbox_subTask = false;
let task_id;
let checked;
let menuContactsOpen = false;
let contacts = [];
let initials = {
    'mail': [],
    'initials': [],
    'color': []
};
let title;
let boolians = [];
let description;
let date;
let menuOpen = false;
let color;
let taskCategory
let task_contacts = [];
let subTasks = [];
let tasks = [];
let task = {};
let categorys = {
    'category': [],
    'color': []
};

//address of the backend server

setURL('https://gruppe-5009.developerakademie.net/smallest_backend_ever');

//displays the current date

function getDate() {
    document.getElementById('date').valueAsDate = new Date();
    date = document.getElementById('date').value;
};

//sets the priority of the task

function setPrio(x) {
    document.getElementById('prio').style.borderColor = `#F6F7F8`;
    if (x == prio) removePrio();
    else {
        removePrio();
        if (x == 'urgent') {
            document.getElementById('prioUrgent').classList.add('prio_button_urgent');
            prio = 'urgent';
        }
        if (x == 'medium') {
            document.getElementById('prioMedium').classList.add('prio_button_medium');
            prio = 'medium';
        }
        if (x == 'low') {
            document.getElementById('prioLow').classList.add('prio_button_low');
            prio = 'low';
        }
    }
};

//remove the class properties from all prio-buttons

function removePrio() {
    document.getElementById('prioUrgent').classList.remove('prio_button_urgent');
    document.getElementById('prioMedium').classList.remove('prio_button_medium');
    document.getElementById('prioLow').classList.remove('prio_button_low');
    prio = undefined;
};

//opens or close the category menu. When opened, the existing categories are displayed

function openCategory() {
    if (!menuOpen) {
        openMenu('categorys', 'dropDown')
        menuOpen = true;
        renderCategorys();
    } else {
        closeMenu('categorys', 'dropDown');
    }
}

//opens or close the contacts menu. When opened, the existing contacts are displayed

function openContacts() {
    if (!menuContactsOpen) {
        document.getElementById('contacts').innerHTML = '';
        openMenu('contacts', 'dropDownContacts');
        menuContactsOpen = true;
        renderContacts();
    } else {
        closeMenu('contacts', 'dropDownContacts')
        showInitials();
        menuContactsOpen = false;
    }
};

//the individual contacts are rendered in the contacts-menu

function renderContacts() {
    document.getElementById('contacts').innerHTML = ``;
    document.getElementById('contacts').innerHTML += `<div class="render_categorys" onclick="inviteContact() ">Invite new contact</div>`;
    if (contacts.length > 0) {
        for (let i = 0; i < contacts.length; i++) {
            let userName = contacts[i]['name'];
            renderContactsHTML(i, userName);
            if (initials['mail'].includes(contacts[i]['mail'])) {
                document.getElementById('Checkbox' + i).classList.add('custom_checkBox_child');
            }
        }
    }
};


function inviteContact() {
    renderInviteContactHTML();
    enter_email = true;
}


function clearEmailField() {
    if (edit_active) renderEditClearEmailHTML();
     else renderClearEmaailHTML();
    menuContactsOpen = false;
    enter_email = false;
    
};


function sendEmail() {
    console.log('test')
    if (document.getElementById('inviteValue').value.includes('@')) {
        showNotice('emailSent');
        clearEmailField();
    } else {
        if (!button_delay) {
            button_delay = true;
            showNotice('enterEmail');
            setTimeout(() => button_delay = false, 2500);
        }
    }
};

//deletes the selected contacts and closes the contacts menu if it's open

function clearContacts() {
    initials['initials'].length = 0;
    initials['mail'].length = 0;
    initials['color'].length = 0;
    showInitials();
    if (menuContactsOpen) {
        closeMenu('contacts', 'dropDownContacts')
    }
};

//*
//*checks whether the contact has already been selected. if so, the contact is deleted and the checkbox is set to not active
//*if not, the checkbox is active and the contact is selected
//*

function setContacts(i) {
    let index = initials['mail'].indexOf(contacts[i]['mail'])
    if (index == -1) {
        document.getElementById('Checkbox' + i).classList.add('custom_checkBox_child');
        initials['initials'].push(contacts[i]['initials']);
        initials['mail'].push(contacts[i]['mail']);
        initials['color'].push(contacts[i]['color']);
        if (contacts[i]['name'] == 'You') contacts[i]['name'] = current_user;
        task_contacts.push(contacts[i]);
        showInitials();
    } else {
        document.getElementById('Checkbox' + i).classList.remove('custom_checkBox_child');
        initials['initials'].splice(index, 1);
        initials['mail'].splice(index, 1);
        initials['color'].splice(index, 1);
        task_contacts.splice(index, 1);
        showInitials();
    }
};

//renders the initials of the selected contact on the screen

function showInitials() {
    document.getElementById('initials').innerHTML = '';
    for (let i = 0; i < initials['initials'].length; i++) {
        let initial = initials['initials'][i];
        let bgrColor = initials['color'][i];
        document.getElementById('initials').innerHTML += `
        <div class="initials" style="background-color: ${bgrColor};">
        ${initial}
        </div>`;
    }
}

//open the contact- or category menu

function openMenu(id1, id2) {
    removeBorder(id2)
    document.getElementById(id1).style.borderBottom = `1px solid #D1D1D1`;
    document.getElementById(id2).classList.add('drop_down_open');
}

//close the contact- or category menu

function closeMenu(id1, id2) {
    document.getElementById(id1).innerHTML = ''
    document.getElementById(id2).classList.remove('drop_down_open');
    document.getElementById(id1).style.borderBottom = `0`;
    menuOpen = false;
    menuContactsOpen = false;
};

//renders the categories into the category menu

function renderCategorys() {
    document.getElementById('categorys').innerHTML = ''
    document.getElementById('categorys').innerHTML = `<div class="render_categorys" onclick="inputCategory()">New category</div>`;
    for (let i = 0; i < categorys['category'].length; i++) {
        let clr = categorys['color'][i];
        let category = categorys['category'][i];
        renderCategorysHTML(clr, i, category);
    }
};

//remove the category from the category menu

function deleteCategory(i) {
    if (categorys['category'][i] == taskCategory) {
        document.getElementById('dropDown').innerHTML = `
        Select task category
        <img class="down_image" src="assets/img/drop-down-arrow.png" onclick="openCategory()">
        `;
        taskCategory = undefined;
    }
    document.getElementById('ctgry' + i).classList.add('slide-out-right');
    categorys['category'].splice(i, 1);
    categorys['color'].splice(i, 1);
    saveInLocalStorage('categorys', categorys);
    setTimeout(() => renderCategorys(), 500);

}

//renders the input field for a new category

function inputCategory() {
    color = undefined;
    taskCategory = undefined;
    showInputCategoryHTML();
}

//sets the category menu to its initial state

function clearInputField() {
    showCategoryHTML();
    menuOpen = false;
};

//sets the color of the category

function setColor(clr) {
    if (color) {
        document.getElementById(color).classList.remove('color_active');
    }
    document.getElementById(clr).classList.add('color_active');
    color = clr;
};

//saves a new category

function addNewCategory() {
    let categoryValue = document.getElementById('categoryValue').value;
    if (categoryValue.length < 1 || !color) {
        if (!button_delay) {
            button_delay = true;
            showNotice('pleaseCategoryName');
            setTimeout(() => button_delay = false, 2500);
        }
    } else {
        categorys['color'].push(color);
        categorys['category'].push(categoryValue);
        saveInLocalStorage('categorys', categorys);
        taskCategory = categoryValue;
        showCategoryColorHTML();
        menuOpen = false;
    }
};

//renders the selected category into the input field

function setCategory(ctgry, clr) {
    color = clr;
    taskCategory = ctgry;
    showCategoryColorHTML();
    menuOpen = false;
};

//render a subtask to the screen

function addSubtask() {
    subtaskValue = document.getElementById('subTask').value
    if (subtaskValue.length < 1) {
        if (!button_delay) {
            button_delay = true;
            showNotice('pleaseEnterName');
            setTimeout(() => button_delay = false, 2500);
        }
    } else {
        document.getElementById('subTask').value = '';
        document.getElementById('subtaskBox').innerHTML = '';
        subTasks.push(subtaskValue);
        boolians.push(false);
        for (let i = 0; i < subTasks.length; i++) {
            let subTask = subTasks[i];
            renderSubtasHTML(subTask, i);
        }
    }
};

//remove the subtask from the screen

function deleteSubtask(i) {
    document.getElementById('subTask' + i).classList.add('slide-out-right');
    subTasks.splice(i, 1);
    setTimeout(() => {
        document.getElementById('subtaskBox').innerHTML = '';
        for (let i = 0; i < subTasks.length; i++) {
            let subTask = subTasks[i];
            renderSubtasHTML(subTask, i);
        }
    }, 500);

};

/**
 * saves whether the subtask is already completed
 */

function setSubtaskStatus(i) {
    if (document.getElementById('CheckboxTask' + i).checked == true) boolians[i] = true;
    else boolians[i] = false;
}

// clear all inputfields en remove selected categorys and contacts

function clearAll() {
    document.getElementById('description').value = '';
    document.getElementById('title').value = '';
    document.getElementById('subtaskBox').innerHTML = '';
    color = undefined;
    taskCategory = undefined;
    subTasks.length = 0;
    task_contacts.length = 0;
    clearInputField();
    removePrio();
    clearContacts();
};

// fill the task JSON when the mandatory fields are filled or shows the alert : something is missing

function createTask() {
    if (!button_delay) {
        button_delay = true;
        if (allFilled()) {
            closeMenu('contacts', 'dropDownContacts')
            showNotice('addBordBox');
            fillTaskjJson();
            loadBoardHTML();
        } else {
            if (!taskCategory) clearInputField();
            if (taskCategory) setCategory(taskCategory, color);
            if (enter_email) clearEmailField();
            closeMenu('contacts', 'dropDownContacts')
            showNotice('missing');
            checkWhichFieldIsEmpty()
            setTimeout(() => button_delay = false, 2500);
        }
    }
};

// fill the tasks Array with values and save it on the server

async function fillTaskjJson() {
    task['title'] = document.getElementById('title').value;
    task['description'] = document.getElementById('description').value
    task['category'] = taskCategory;
    task['category_color'] = color;
    task['contacts'] = task_contacts;
    task['done'] = boolians;
    task['date'] = date;
    task['task_id'] = task_id;
    task['prio'] = prio;
    task['subtasks'] = subTasks;
    task['status'] = 'todo';
    tasks.push(task);
    await saveInLocalStorage('tasks', tasks);
}

//move the body out of the screent and load the board.HTML

function loadBoardHTML() {
    setTimeout(() => document.getElementById('body').classList.add('body_move_right'), 2400);
    setTimeout(() => location.href = "board.html", 2000);
}

//validates which input field has no value and apply a red boarder

function checkWhichFieldIsEmpty() {
    if (document.getElementById('title').value.length < 1) document.getElementById('title').style.borderColor = `red`;
    if (document.getElementById('description').value.length < 1) document.getElementById('description').style.borderColor = `red`;
    if (!taskCategory) document.getElementById('dropDown').style.borderColor = `red`;
    if (initials['initials'].length < 1) document.getElementById('dropDownContacts').style.borderColor = `red`;
    if (!prio) document.getElementById('prio').style.borderColor = `red`;
};

// remove the red boarder from the priority section

function removeBorder(id) {
    document.getElementById(id).style.borderColor = `#D1D1D1`;
}

// Checks whether the mandatory fields are filled

function allFilled() {
    if (document.getElementById('title').value.length > 0 &&
        document.getElementById('description').value.length > 0 &&
        taskCategory &&
        initials['initials'].length > 0 &&
        prio) {
        return true;
    } else {
        return false;
    }
};

// displays a notice from the bottom edge of the screen

function showNotice(id) {
    document.getElementById(id).style.display = '';
    document.getElementById(id).style.zIndex = '20';
    setTimeout(() => {
        document.getElementById(id).style.display = '' 
        document.getElementById(id).style.display = 'none' 
    }, 1900); 
    document.getElementById(id).classList.remove('addBord_box_inactive')
    document.getElementById(id).classList.add('addBord_box_active');
    setTimeout(() => document.getElementById(id).classList.add('addBord_box_inactive'), 1500);
};


function renderOverlayAddTask() {
    document.getElementById('overlay').innerHTML = ``;
    renderOverlayHTML();
    loadDataTask();
}

/**
 * fills the contacts array with the user's contacts
 */

function getUserContacts() {
    user.forEach(e => {
        if (e.name === current_user) {
           if(e.contacts != undefined) contacts = e.contacts;
        }
    });
}

//save content on the backend server

async function saveInLocalStorage(key, array) {
    await backend.setItem(key, JSON.stringify(array));
};

//load content from the backend server

async function loadDataTask() {
    await downloadFromServer();
    current_user = localStorage.getItem('currentUser');
    user = JSON.parse(backend.getItem('users')) || [];
    categorys = JSON.parse(backend.getItem('categorys')) || [];
    tasks = JSON.parse(backend.getItem('tasks')) || [];
    task_id = backend.getItem('index');
    task_id++;
    await backend.setItem('index', task_id);
    getUserInfo();
};


function getUserInfo() {
    getUserContacts();
    getCurrentUserIndex();
    user[userId]['name'] = 'You';
    if (user[userId]['contacts'] != undefined) delete user[userId]['contacts'];
    contacts.splice(0, 0, user[userId]);
};

/**
 * fills the variable userId with the index of the user
 */

async function getCurrentUserIndex() {
    await user.forEach(function users(value, index) {
        if (value.name === current_user) {
            userData = value;
            userId = index;
        }
    });
};






