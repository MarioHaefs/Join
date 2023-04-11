let prio;
let checked;
let menuContactsOpen = false;
let contacts = [];
let initials = {
    'mail': [],
    'initials': []
};
let title;
let description;
let date;
let menuOpen = false;
let color;
let taskCategory
let subTasks = [];
let task = {
    'title': title,
    'description': description,
    'category': taskCategory,
    'color': color,
    'contacts': [],
    'date': date,
    'prio': prio,
    'subtasks': subTasks
};
let categorys = {
    'category': [],
    'color': []
};

//address of the backend server

setURL('https://gruppe-5009.developerakademie.net/smallest_backend_ever');

//displays the current date

function getDate() {
    document.getElementById('date').valueAsDate = new Date();
};

//sets the priority of the task

function setPrio(x) {
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
    prio = '';
};

//opens or close the category menu. When opened, the existing categories are displayed

function openCategory() {
    if (!menuOpen) {
        openMenu('categorys', 'dropDown')
        menuOpen = true;
        renderCategorys();
    } else {
        closeMenu('categorys', 'dropDown');
        menuOpen = false;
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
    for (let i = 0; i < contacts.length; i++) {
        let userName = contacts[i]['name'];
        renderContactsHTML(i, userName);
        if (initials['mail'].includes(contacts[i]['mail'])) {
            document.getElementById('Checkbox' + i).classList.add('custom_checkBox_child');
        }
    }
};

//deletes the selected contacts and closes the contacts menu if it's open

function clearContacts() {
    initials['initials'].length = 0;
    initials['mail'].length = 0;
    showInitials();
    if (menuContactsOpen) {
        closeMenu('contacts', 'dropDownContacts')
        menuContactsOpen = false;
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
        showInitials();
    } else {
        document.getElementById('Checkbox' + i).classList.remove('custom_checkBox_child');
        initials['initials'].splice(index, 1);
        initials['mail'].splice(index, 1);
        showInitials();
    }
};

//renders the initials of the selected contact on the screen

function showInitials() {
    document.getElementById('initials').innerHTML = '';
    for (let i = 0; i < initials['initials'].length; i++) {
        let initial = initials['initials'][i];
        document.getElementById('initials').innerHTML += `
        <div class="initials">
        ${initial}
        </div>`;
    }
}

//open the contact- or category menu

function openMenu(id1, id2) {
    document.getElementById(id1).style.borderBottom = `1px solid #D1D1D1`;
    document.getElementById(id2).classList.add('drop_down_open');
}

//close the contact- or category menu

function closeMenu(id1, id2) {
    document.getElementById(id1).innerHTML = ''
    document.getElementById(id2).classList.remove('drop_down_open');
    document.getElementById(id1).style.borderBottom = `0`;
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
    categorys['category'].splice(i, 1);
    categorys['color'].splice(i, 1);
    saveInLocalStorage();
    renderCategorys();
}

//renders the input field for a new category

function inputCategory() {
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
        alert('wird ersetzt')
    } else {
        categorys['color'].push(color);
        categorys['category'].push(categoryValue);
        saveInLocalStorage();
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
        showNotice('pleaseEnterName');
    } else {
        document.getElementById('subTask').value = '';
        document.getElementById('subtaskBox').innerHTML = '';
        subTasks.push(subtaskValue);
        for (let i = 0; i < subTasks.length; i++) {
            let subTask = subTasks[i];
            renderSubtasHTML(subTask, i);
        }
    }
};

//remove the subtask from the screen

function deleteSubtask(i) {
    subTasks.splice(i, 1);
    document.getElementById('subtaskBox').innerHTML = '';
    for (let i = 0; i < subTasks.length; i++) {
        let subTask = subTasks[i];
        renderSubtasHTML(subTask, i);
    }
};

// clear all inputfields en remove selected categorys and contacts

function clearAll() {
    document.getElementById('description').value = '';
    document.getElementById('title').value = '';
    document.getElementById('subtaskBox').innerHTML = '';
    color = '';
    taskCategory = '';
    subTasks.length = 0;
    initials['initials'].length = 0;
    clearInputField();
    removePrio();
    clearContacts();
};

// fill the task JSON

function createTask() {
    if (allFilled()) {
        showTasktoBoardBox();
        title = document.getElementById('title').value;
        description = document.getElementById('description').value;
        date = document.getElementById('date').value;
    } else {
        showNotice('missing');
    }
};


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


function showTasktoBoardBox() {
    document.getElementById('addBordBox').classList.add('addBord_box_active');
};


function showNotice(id) {
    document.getElementById(id).classList.remove('addBord_box_inactive')
    document.getElementById(id).classList.add('addBord_box_active');
    setTimeout(() => document.getElementById(id).classList.add('addBord_box_inactive'), 2000);
}

//save content on the backend server

async function saveInLocalStorage() {
    await backend.setItem('categorys', JSON.stringify(categorys));
};

//load content from the backend server

async function loadData() {
    await downloadFromServer();
    contacts = JSON.parse(backend.getItem('contacts')) || [];
    categorys = JSON.parse(backend.getItem('categorys')) || [];
};





