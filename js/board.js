let currentDraggedElement;
let editors;
let tasks_board;
let categorys_board;
let filteredTasks;
let currentPrioEditTask;
let editContacts = [];



// set backend url
setURL('https://gruppe-5009.developerakademie.net/smallest_backend_ever');

async function initBoard() {
    await loadData();
    await loadDataTask();
    renderTasks(tasks_board);
}


//displays the current date
function getDateOverlay() {
    document.getElementById('dateOverlay').valueAsDate = new Date();
    date = document.getElementById('dateOverlay').value;
};


// load data from backend
async function loadData() {
    await downloadFromServer();
    // editors = JSON.parse(backend.getItem('users')) || [];
    tasks_board = JSON.parse(backend.getItem('tasks')) || [];
    categorys_board = JSON.parse(backend.getItem('categorys')) || [];
}

// save data to backend
async function saveData(key, array) {
    await backend.setItem(key, JSON.stringify(array));
};

function renderTasks(inputArray) {
    deleteTasksOnBoard();

    for (let i = 0; i < inputArray.length; i++) {
        const task = inputArray[i];
        // editors = task['contacts'];
        renderSingleTask(task);
    }
}

/**
 * render card for single task
 * @param {string} taskStatus - Status / column of the task
 * @todo complete task
 */
function renderSingleTask(task) {
    let destination = document.getElementById(`${checkTaskStatus(task)}`);//${task['category']}`);
    destination.innerHTML += `
        <div draggable="true" onclick="openTaskDetailView(${task['task_id']})" ondragstart="startDragging(${task['task_id']})" class="single-task" id="task${task['task_id']}">
            ${htmlTaskTopic(task)}
            ${htmlTaskTitle(task)}
            ${htmlTaskDescription(task)}
            ${htmlTaskSubtasks(task)}
            ${htmlTaskDivBottom(task)}
        </div>`;
}

/**
 * 
 * @returns html code for the topic of the task
 */
function htmlTaskTopic(task) {
    return `<div class="task-topic" style="background-color: ${getCategorysColor(task['category'])}">${task['category']}</div>`;
}

function getCategorysColor(category) {
    let index = categorys_board['category'].indexOf(category);
    return categorys_board['color'][index];
}

function htmlTaskTitle(task) {
    return `<h4>${task['title']}</h4>`;
}

function htmlTaskDescription(task) {
    return `<div class="task-description-board">${task['description']}</div>`;
}


/**
 * 
 * @param {Array of JSON} task includes all information to render the task on board - it is loaded from the server
 * @returns html code for progress in subtasks
 * check first for available subtasks
 * task has property 'done' as array with booleans, if true, subtask is already done
 * filter(Boolean) returns only true values of array
 */
function htmlTaskSubtasks(task) {
    if (task['subtasks'].length == 0) return '<div class="task-subtasks"></div>';
    return `<div class="task-subtasks">
                <div class="task-subtasks-line">
                    <div class="progress" style="width: ${calcProgress(task)}%"></div>
                </div>
                <span>${task['done'].filter(Boolean).length}/${task['subtasks'].length} Done</span>
            </div>`;
}

/**
 * 
 * @param {Array of JSON} task includes all information to render the task on board - it is loaded from the server
 * @returns progress of subtasks in %
 */
function calcProgress(task) {
    return task['done'].filter(Boolean).length / task['subtasks'].length * 100;
}

function htmlTaskDivBottom(task) {
    return `<div class="task-bottom">
                ${htmlTaskEditors(task)}
                ${htmlTaskPrio(task)}
            </div>`;
}

/**
 * 
 * @param {Array of JSON} task includes all information to render the task on board - it is loaded from the server
 * @returns html code for the editors of the task 
 * 
 * all available editors are loaded from server and are stored global
 * get assigned contact id's from param task
 * get initials and color with contact id from global editors
 * if more than 2 editors, only show number of left over editors
 */
function htmlTaskEditors(task) {
    let htmlCodeTemp = '';
    editors = task['contacts'];
    for (let i = 0; i < editors.length; i++) {
        const editor = editors[i];
        if (editor == null) break; // exit for each loop when no editor is available - prevent error
        if (moreThan2Editors(i)) {
            htmlCodeTemp += htmlTaskLeftOverEditors(editors);
            break;
        }
        htmlCodeTemp += htmlTaskSingleEditor(editor);
    }
    return `<div class="editors">${htmlCodeTemp}</div>`;
}

function htmlTaskSingleEditor(editor) {
    return `<div class="contact-frame" style="background-color: ${editor['color']}">
                ${editor['initials']}
            </div>`;
}

function htmlTaskLeftOverEditors(editors) {
    return `<div class="contact-frame">
                +${editors.length - 2}
            </div>`;
}

function moreThan2Editors(i) {
    return i > 1;
}

function htmlTaskPrio(task) {
    return `<div class="task-prio">
                <img src="assets/img/prio${capitalizeFirstLetter(task['prio'])}.png">
            </div>`;
}

function openTaskDetailView(id) {
    editContacts.length = 0
    let task = tasks_board.find((e => e['task_id'] == id));
    renderTaskDetailView(task);
    document.body.classList.add('overflow-hidden');
}

// todo
function renderTaskDetailView(task) {
    let detailView = document.getElementById('taskDetailView');
    detailView.classList.remove('display-none');
    detailView.innerHTML = htmlTaskDetailView(task);
}

function htmlTaskDetailView(task) {
    return `
        <div class="content" onclick="noClose(event)">
            <div class="close">
                <img src="./assets/img/close.png" onclick="closeDetailView()">
            </div>
            <div id="content" class="task-details">
                <div class="category" style="background-color: ${task['category_color']}">${task['category']}</div>
                <div class="title">${task['title']}</div>
                <div>${task['description']}</div>
                <div class="date">
                    <b>Due date:</b>
                    <div>${task['date']}</div>
                </div>
                <div class="priority">
                    <b>Priority:</b>
                    <div class="prio-icon" style="background-color: ${getCategoryColor(task['prio'])}">
                        <div>${task['prio']}</div>
                        <img src="./assets/img/prio${capitalizeFirstLetter(task['prio'])}.png">
                    </div>
                </div>
                <div class="editors">
                    <b>Assigned To:</b>
                    ${htmlAllEditors(task)}
                </div>
            </div>
            <div id="icons" class="icons">
                <div class="delete-button" onclick="deleteTask(${tasks_board.indexOf(task)})">
                    <img src="./assets/img/board-icons/delete.png">
                </div>
                <div class="edit-button" onclick="editTask(${tasks_board.indexOf(task)})">
                    <img src="./assets/img/board-icons/edit.png">
                </div>
            </div>
        </div>
    `;
}

async function editTask(index) {
    let content = document.getElementById('content');
    let icons = document.getElementById('icons');
    content.innerHTML = '';
    content.classList.remove('task-details');
    content.classList.add('edit-task');
    icons.innerHTML = htmlCheckIcon(index);
    content.innerHTML = htmlEditTask(tasks_board[index]);
    setPrioInEditTask(tasks_board[index]);
    renderEditorsInitials();
    pushEditorstoContacts();
};


function pushEditorstoContacts() {
    let edit_colors = [];
    editors.forEach(element => {
        console.log(element.color)
        editContacts.push(element)
        edit_colors.push(element.color)
    });
    contacts.forEach(element => {
        if(edit_colors.includes(element.color) == false) editContacts.push(element)
    });
};


function renderEditorsInitials() {
    document.getElementById('initials').innerHTML = '';
    for (let i = 0; i < editors.length; i++) {
        let initial = editors[i]['initials'];
        let bgrColor = editors[i]['color'];
        document.getElementById('initials').innerHTML += `
        <div class="initials" style="background-color: ${bgrColor};">
        ${initial}
        </div>`;
    }
}

function setPrioInEditTask(task) {
    currentPrioEditTask = task['prio'];
    document.getElementById(`editPrio${capitalizeFirstLetter(currentPrioEditTask)}`).classList.add(`prio_button_${currentPrioEditTask}`);
}

function editPrio(prio) {
    document.getElementById(`editPrio${capitalizeFirstLetter(currentPrioEditTask)}`).classList.remove(`prio_button_${currentPrioEditTask}`);
    currentPrioEditTask = prio;
    document.getElementById(`editPrio${capitalizeFirstLetter(currentPrioEditTask)}`).classList.add(`prio_button_${currentPrioEditTask}`);
}

function htmlEditTask(task) {
    return `
            <div class="title">
                Title
                <input type="text" id="editTaskTitle" value="${task['title']}">
            </div>
            <div class="description">
                Description
                <textarea id="editTaskDescription" rows="5" required>${task['description']}</textarea>
            </div>
            <div class="date">
                Due date:
                <input type="date" id="editTaskDueDate" value="${task['date']}">
            </div>
            <div class="priority">
                Prio
                <div class="edit-prio-buttons">
                    <div class="prio_button" id="editPrioUrgent" onclick="editPrio('urgent')">
                        Urgent
                        <img src="./assets/img/prioUrgent.png">
                    </div>
                    <div class="prio_button" id="editPrioMedium" onclick="editPrio('medium')">
                        Medium
                        <img src="./assets/img/prioMedium.png">
                    </div>
                    <div class="prio_button" id="editPrioLow" onclick="editPrio('low')">
                        Low
                        <img src="./assets/img/prioLow.png">
                    </div>
                </div>
            </div>
            <div class="editors">
                Assigned to
                <div id="contactBox">
                    <div class="drop_down" id="dropDownEditContacts" onclick="openEditTaskContacts()">
                        Select contacts to assign
                        <img class="down_image" src="assets/img/drop-down-arrow.png">
                    </div>
                    <div id="editContacts" class="render_categorys_box"></div>
                </div>
                <div id="initials" class="initials_box"></div>
            </div>
    `;
}

function htmlCheckIcon(index) {
    return `
        <div class="check-button" onclick="saveTask(${index})">
            OK
            <img src="./assets/img/board-icons/check.png">
        </div>`;
}

async function saveTask(idx) {
    saveChangedDataLocal(idx);
    await saveData('tasks', tasks_board);
    document.getElementById('taskDetailView').classList.add('display-none');
    document.body.classList.remove('overflow-hidden');
    menuContactsOpen = false;
    await initBoard();
}

function saveChangedDataLocal(idx) {
    tasks_board[idx]['title'] = document.getElementById('editTaskTitle').value;
    tasks_board[idx]['description'] = document.getElementById('editTaskDescription').value;
    tasks_board[idx]['date'] = document.getElementById('editTaskDueDate').value;
    tasks_board[idx]['prio'] = currentPrioEditTask;
    tasks_board[idx]['contacts'] = editors;
}


async function deleteTask(index) {
    tasks_board.splice(index, 1);
    document.getElementById('taskDetailView').classList.add('display-none');
    await saveData('tasks', tasks_board);
    await initBoard();
}

function htmlAllEditors(task) {
    let htmlCodeTemp = '';
    editors = task['contacts'];
    for (let i = 0; i < editors.length; i++) {
        const editor = editors[i];
        if (editor == null) break; // exit for each loop when no editor is available - prevent error
        htmlCodeTemp += htmlTaskSingleEditorDetail(editor);
    }
    return htmlCodeTemp;
}

function htmlTaskSingleEditorDetail(ed) {
    return `
        <div class="single-editor">
            <div class="ed-initials" style="background-color: ${ed['color']}">${ed['initials']}</div>
            <div>${ed['name']}</div>
        </div>
    `;
}

function getCategoryColor(prio) {
    if (prio == 'low') {
        return '#7AE229';
    } else if (prio == 'medium') {
        return '#FFA800';
    } else if (prio == 'urgent') {
        return '#FF3D00';
    } else {
        return '#000000';
    };
}

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function startDragging(id) {
    currentDraggedElement = id;
    markDraggableArea(`2px dotted #a8a8a8`);
}

function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * 
 * @param {String} status assign column in board - todo, progress, feedback, done
 * task_id != currentDraggedElement, therefore find Index of task in task with task_id
 */
function moveTo(status) {
    let taskIndex = tasks_board.findIndex((task) => task['task_id'] == currentDraggedElement);
    tasks_board[taskIndex]['status'] = status;
    markDraggableArea(``);
    saveData('tasks', tasks_board);
    renderTasks(tasks_board);
}

function deleteTasksOnBoard() {
    document.getElementById('tasks-todo').innerHTML = '';
    document.getElementById('tasks-progress').innerHTML = '';
    document.getElementById('tasks-feedback').innerHTML = '';
    document.getElementById('tasks-done').innerHTML = '';
}

/**
 * 
 * @param {Array of JSON} task includes all information to render the task on board - it is loaded from the server
 * @returns column where task has to be rendered
 * if no status is available, task is new and not started
 */
function checkTaskStatus(task) {
    if (task['status'] != null) {
        return `tasks-${task['status']}`;
    } else {
        return 'tasks-todo';
    }
}

function markDraggableArea(style) {
    let draggableArea = document.getElementsByClassName('task-body');
    for (let i = 0; i < draggableArea.length; i++) {
        const area = draggableArea[i];
        area.style.border = style;
    }
}

function overlayAddTask() {
    document.getElementById('overlayAddTask').classList.remove('display-none');
    document.getElementById('overlayAddTask').classList.add('overlay-add-task');
    document.getElementById('mobileCreate').style.visibility = 'visible';
    document.body.classList.add('overflow-hidden');
    renderOverlayAddTask();
    getDateOverlay();
}

function closeOverlay() {
    clearAll();
    // todo animation ein ausblenden
    document.getElementById('overlayAddTask').classList.remove('overlay-add-task');
    document.getElementById('overlayAddTask').classList.add('display-none');
    document.body.classList.remove('overflow-hidden');
    document.getElementById('mobileCreate').style.visibility = 'hidden';
    // document.getElementsByClassName('add-task')[0].classList.add('test');
}

function closeDetailView() {
    editContacts = [];
    document.getElementById('taskDetailView').classList.add('display-none');
    document.body.classList.remove('overflow-hidden');
    menuContactsOpen = false;
}

function noClose(event) {
    event.stopPropagation();
}

function filterTasks() {
    filteredTasks = [];
    let inputValue = document.getElementById('search-input').value;
    for (let i = 0; i < tasks_board.length; i++) {
        const task = tasks_board[i];
        if (inputValueIsInTask(inputValue, task)) filteredTasks.push(task);
    }
    renderTasks(filteredTasks);
}

function inputValueIsInTask(input, task) {
    return task['title'].toLowerCase().includes(input.toLowerCase()) || task['description'].toLowerCase().includes(input.toLowerCase());
}


function createTaskonBoard() {
    if (allFilled()) addTask();
    else showTasknotFull();
};


async function addTask() {
    closeMenu('contacts', 'dropDownContacts')
    showNotice('addBordBox');
    await fillTaskjJson();
    task = {};
    contacts = {};
    editors = {};
    clearAll();
    closeOverlay();
    initBoard();
};


function showTasknotFull() {
    if (!button_delay) {
        button_delay = true;
        if (!taskCategory) clearInputField();
        if (taskCategory) setCategory(taskCategory, color);
        if (enter_email) clearEmailField();
        closeMenu('contacts', 'dropDownContacts')
        showNotice('missing');
        checkWhichFieldIsEmpty()
        setTimeout(() => button_delay = false, 2500);
    }
}

function openEditTaskContacts() {
    if (!menuContactsOpen) {
        document.getElementById('editContacts').innerHTML = '';
        openMenu('editContacts', 'dropDownEditContacts');
        menuContactsOpen = true;
        renderEditContacts();
    } else {
        closeMenu('editContacts', 'dropDownEditContacts')
        menuContactsOpen = false;
    }
};

function renderEditContacts() {
    document.getElementById('editContacts').innerHTML = ``;
    document.getElementById('editContacts').innerHTML += `<div class="render_categorys" onclick="inviteContact() ">Invite new contact</div>`;
    for (let i = 0; i < editContacts.length; i++) {
            let userName = editContacts[i]['name'];
            renderEditTaskContactsHTML(i, userName);
            if (editors.includes(editContacts[i])) {
                document.getElementById('Checkbox' + i).classList.add('custom_checkBox_child');
            }
        }
};

function renderEditTaskContactsHTML(i, userName) {
    document.getElementById('editContacts').innerHTML += `
            <div class="render_categorys" onclick="editTaskSetContacts(${i})">
                ${userName}  
                <div class="custom_checkBox">
                    <div id="Checkbox${i}"></div>
                </div>
            </div>`;
};

function editTaskSetContacts(i) {
    let index = editors.indexOf(editContacts[i])
    if (index == -1) {
        document.getElementById('Checkbox' + i).classList.add('custom_checkBox_child');
        if (editContacts[i]['name'] == 'You') editContacts[i]['name'] = current_user;
        editors.push(editContacts[i]);
        renderEditorsInitials()
    } else {
        document.getElementById('Checkbox' + i).classList.remove('custom_checkBox_child');
        editors.splice(index, 1);
        renderEditorsInitials()
    }
};