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

setURL('https://gruppe-5009.developerakademie.net/smallest_backend_ever');

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

function removePrio() {
    document.getElementById('prioUrgent').classList.remove('prio_button_urgent');
    document.getElementById('prioMedium').classList.remove('prio_button_medium');
    document.getElementById('prioLow').classList.remove('prio_button_low');
    prio = '';
};


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


function openContacts() {
    if (!menuContactsOpen) {
        document.getElementById('contacts').innerHTML = '';
        openMenu('contacts', 'dropDownContacts');
        menuContactsOpen = true;
        for (let i = 0; i < contacts.length; i++) {
            let userName = contacts[i]['name'];
            renderContactsHTML(i, userName);
        }
    } else {
        closeMenu('contacts', 'dropDownContacts')
        showInitials();
        menuContactsOpen = false;
    }
};


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


function openMenu(id1, id2) {
    document.getElementById(id1).style.borderBottom = `1px solid #D1D1D1`;
    document.getElementById(id2).classList.add('drop_down_open');
}


function closeMenu(id1, id2) {
    document.getElementById(id1).innerHTML = ''
    document.getElementById(id2).classList.remove('drop_down_open');
    document.getElementById(id1).style.borderBottom = `0`;
};


function renderCategorys() {
    document.getElementById('categorys').innerHTML = ''
    document.getElementById('categorys').innerHTML = `<div class="render_categorys" onclick="inputCategory()">New category</div>`;
    for (let i = 0; i < categorys['category'].length; i++) {
        let clr = categorys['color'][i];
        let category = categorys['category'][i];
        renderCategorysHTML(clr, i, category);
    }
};


function deleteCategory(i) {
    if (categorys['category'][i] == taskCategory) {
        document.getElementById('dropDown').innerHTML = `Select task category`;
    }
    categorys['category'].splice(i, 1);
    categorys['color'].splice(i, 1);
    saveInLocalStorage();
    renderCategorys();
}


function inputCategory() {
    showInputCategoryHTML();
}


function clearInputField() {
    showCategoryHTML();
    menuOpen = false;
};


function setColor(clr) {
    if (color) {
        document.getElementById(color).classList.remove('color_active');
    }
    document.getElementById(clr).classList.add('color_active');
    color = clr;
};


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


function setCategory(ctgry, clr) {
    color = clr;
    taskCategory = ctgry;
    showCategoryColorHTML();
    menuOpen = false;
};


function addSubtask() {
    subtaskValue = document.getElementById('subTask').value
    if (subtaskValue.length < 1) {
        alert('wird ersetzt');
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


function deleteSubtask(i) {
    subTasks.splice(i, 1);
    document.getElementById('subtaskBox').innerHTML = '';
    for (let i = 0; i < subTasks.length; i++) {
        let subTask = subTasks[i];
        renderSubtasHTML(subTask, i);
    }
};


function clearAll() {
    document.getElementById('description').value = '';
    document.getElementById('title').value = '';
    document.getElementById('subtaskBox').innerHTML = '';
    color = '';
    taskCategory = '';
    subTasks.length = 0;
    clearInputField();
    removePrio();
};


async function saveInLocalStorage() {
    await backend.setItem('categorys', JSON.stringify(categorys));
};


async function loadData() {
    await downloadFromServer();
    contacts = JSON.parse(backend.getItem('contacts')) || [];
    categorys = JSON.parse(backend.getItem('categorys')) || [];
};


function createTask() {
    title = document.getElementById('title').value;
    description = document.getElementById('description').value;
    date = document.getElementById('date').value;
}





