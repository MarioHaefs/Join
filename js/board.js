let currentDraggedElement;
let editors;
let tasks_board;
let categorys_board;
let filteredTasks;
let currentPrioEditTask;
let editContacts = [];



setURL('https://mario-haefs.developerakademie.net/smallest_backend_ever');

/**
 * initialises board  
 */
async function initBoard() {
    await loadData();
    await loadDataTask();
    renderTasks(tasks_board);
}


/**
 * displays the current date 
 */
function getDateOverlay() {
    var dateOverlay = document.getElementById('dateOverlay');
    if (dateOverlay !== null) {
        dateOverlay.valueAsDate = new Date();
        date = dateOverlay.value;
    }
}


/**
 * load data from backend 
 */
async function loadData() {
    await downloadFromServer();
    tasks_board = JSON.parse(backend.getItem('tasks')) || [];
    categorys_board = JSON.parse(backend.getItem('categorys')) || [];
    users = JSON.parse(backend.getItem('users')) || [];
}


/**
 * save data to backend
 * 
 * @param {string} key 
 * @param {array} array
 */
async function saveData(key, array) {
    await backend.setItem(key, JSON.stringify(array));
};


/**
 * render tasks 
 * 
 * @param {array} inputArray - task array
 */
function renderTasks(inputArray) {
    deleteTasksOnBoard();

    for (let i = 0; i < inputArray.length; i++) {
        const task = inputArray[i];
        renderSingleTask(task);
    }
}


/**
 * render card for single task
 * 
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
    let mobileArrowUpStyle = '';
    let mobileArrowDownStyle = '';

    if (task.status === 'todo') {
        mobileArrowUpStyle = 'display: none;';
    } else if (task.status === 'done') {
        mobileArrowDownStyle = 'display: none;';
    }

    return /*html*/`
    <div class="mobile-task-topic">
        <div class="task-topic" style="background-color: ${getCategorysColor(task['category'])}">
            ${task['category']}
        </div>
        <div class="mobile-arrows"> 
            <img id="mobileArrowUp" onclick="event.stopPropagation(); moveMobile(${task['task_id']}, 'up')"  src="assets/img/arrow-up.png" style="${mobileArrowUpStyle}">
            <img id="mobileArrowDown" onclick="event.stopPropagation(); moveMobile(${task['task_id']}, 'down')" src="assets/img/arrow-down.png" style="${mobileArrowDownStyle}">
        </div>
    </div>
    `;
}



/**
 * Move tasks to other areas on mobile devices
 * @param {number} taskId 
 * @returns task.status
 */
function moveMobile(taskId, direction) {
    const task = tasks_board.find((t) => t.task_id === taskId);
    if (!task) return;

    const currentCategory = task.status;
    const newCategory = getNewCategory(currentCategory, direction);

    if (!newCategory) return;

    task.status = newCategory;
    saveData("tasks", tasks_board);
    renderTasks(tasks_board);
}


/**
 * 
 * @param {string} currentCategory 
 * @param {string} direction 
 * @returns task.status
 */
function getNewCategory(currentCategory, direction) {
    const categoryMapping = {
        up: {
            todo: "done",
            progress: "todo",
            feedback: "progress",
            done: "feedback"
        },
        down: {
            todo: "progress",
            progress: "feedback",
            feedback: "done",
            done: "todo"
        }
    };

    return categoryMapping[direction][currentCategory];
}


/**
 * get the color of a Task in addTask
 * 
 * @param {color} category 
 * @returns color from category of a task
 */
function getCategorysColor(category) {
    let index = categorys_board['category'].indexOf(category);
    return categorys_board['color'][index];
}


/**
 * 
 * @param {Array of JSON} task 
 * @returns task title
 */
function htmlTaskTitle(task) {
    return `<h4>${task['title']}</h4>`;
}

/**
 * 
 * @param {Array of JSON} task 
 * @returns task description
 */
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

    let subtaskStatus = JSON.parse(localStorage.getItem('subtaskStatus')) || {};
    let taskSubtaskStatus = subtaskStatus[task['task_id']] || {};

    let doneCount = Object.values(taskSubtaskStatus).filter(Boolean).length;
    let progress = calcProgress(task, taskSubtaskStatus);

    return `<div class="task-subtasks" id="taskSubtasks${task['task_id']}">
                <div class="task-subtasks-line">
                    <div class="progress" style="width: ${progress}%"></div>
                </div>
                <span>${doneCount}/${task['subtasks'].length} Done</span>
            </div>`;
}


/**
 * 
 * @param {Array of JSON} task includes all information to render the task on board - it is loaded from the server
 * @returns progress of subtasks in %
 */
function calcProgress(task, taskSubtaskStatus) {
    let checkedSubtasks = Object.values(taskSubtaskStatus).filter(Boolean).length;
    return checkedSubtasks / task['subtasks'].length * 100;
}


/**
 * 
 * @param {Array of JSON} task 
 * @returns 
 */
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



function renderTaskDetailView(task) {
    let detailView = document.getElementById('taskDetailView');
    detailView.classList.remove('display-none');
    detailView.innerHTML = htmlTaskDetailView(task);
}


function htmlTaskDetailView(task) {
    let subtaskBoards = renderSubtaskBoards(task);
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
                <div class="subTaskBoard">
                   ${subtaskBoards}
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


function renderSubtaskBoards(task) {
    let subtaskBoardsHTML = '';

    let subtaskStatus = JSON.parse(localStorage.getItem('subtaskStatus')) || {};
    let taskSubtaskStatus = subtaskStatus[task['task_id']] || {};

    for (let i = 0; i < task['subtasks'].length; i++) {
        let isChecked = taskSubtaskStatus[i] === true;
        subtaskBoardsHTML += renderSubtaskBoardHTML(task['subtasks'][i], task['task_id'], i, isChecked);
    }

    return subtaskBoardsHTML;
}


function renderSubtaskBoardHTML(task, taskId, subtaskIndex, isChecked) {
    let checkedAttribute = isChecked ? 'checked' : '';

    return `
      <div class="subtask_child" id="subTask${taskId}_${subtaskIndex}">
          <input type="checkbox" id="CheckboxTask${taskId}_${subtaskIndex}" class="checkbox_subtask" onclick="setSubtaskStatus(${taskId}, ${subtaskIndex})" ${checkedAttribute}>
          <div class ="subTask_Text">${task}</div>
      </div>`;
}


/**
 * edit a existing task - change key elements of that task
 * 
 * @param {number} index 
 */
async function editTask(index) {
    edit_active = true;
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


/**
 * pushs editors to contacts
 */
function pushEditorstoContacts() {
    let edit_colors = [];
    editors.forEach(element => {
        if (element.name == current_user) element.name = current_user;
        editContacts.push(element)
        edit_colors.push(element.color)
    });
    contacts.forEach(element => {
        if (edit_colors.includes(element.color) == false) editContacts.push(element)
    });
};


/**
 * render the Initials of the editor user
 */
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


/**
 * changes the priority of an edited task
 * 
 * @param {Array of JSON} task 
 */
function setPrioInEditTask(task) {
    currentPrioEditTask = task['prio'];
    document.getElementById(`editPrio${capitalizeFirstLetter(currentPrioEditTask)}`).classList.add(`prio_button_${currentPrioEditTask}`);
}


function editPrio(prio) {
    document.getElementById(`editPrio${capitalizeFirstLetter(currentPrioEditTask)}`).classList.remove(`prio_button_${currentPrioEditTask}`);
    currentPrioEditTask = prio;
    document.getElementById(`editPrio${capitalizeFirstLetter(currentPrioEditTask)}`).classList.add(`prio_button_${currentPrioEditTask}`);
}





/**
 * 
 * @param {Array of JSON} task 
 * @returns complete html if you editing a task
 */
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
                <input type="date" id="editTaskDueDate" min="${today}" value="${task['date']}">
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


/**
 * save a edited task global
 * 
 * @param {number} idx 
 */
async function saveTask(idx) {
    saveChangedDataLocal(idx);
    await saveData('tasks', tasks_board);
    document.getElementById('taskDetailView').classList.add('display-none');
    document.body.classList.remove('overflow-hidden');
    menuContactsOpen = false;
    await initBoard();
}


/**
 * save a edited task local
 * 
 * @param {number} idx 
 */
function saveChangedDataLocal(idx) {
    tasks_board[idx]['title'] = document.getElementById('editTaskTitle').value;
    tasks_board[idx]['description'] = document.getElementById('editTaskDescription').value;
    tasks_board[idx]['date'] = document.getElementById('editTaskDueDate').value;
    tasks_board[idx]['prio'] = currentPrioEditTask;
    tasks_board[idx]['contacts'] = editors;
}


/**
 * delete a task
 *  
 * @param {number} index 
 */
async function deleteTask(index) {
    tasks_board.splice(index, 1);
    document.getElementById('taskDetailView').classList.add('display-none');
    await saveData('tasks', tasks_board);
    await initBoard();
}


/**
 * show all editors of a task
 * 
 * @param {Array of JSON} task 
 * @returns name and initials from a single editor
 */
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

/**
 * 
 * @param {string} ed 
 * @returns name and initials from a single editor
 */
function htmlTaskSingleEditorDetail(ed) {
    return `
        <div class="single-editor">
            <div class="ed-initials" style="background-color: ${ed['color']}">${ed['initials']}</div>
            <div>${ed['name']}</div>
        </div>
    `;
}


/**
 * 
 * @param {string} prio - priority of a task
 * @returns color of the priority 
 */
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

/**
 * 
 * @param {string} str 
 * @returns capitalize first letter 
 */
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


/**
 * starts dragging task event
 * 
 * @param {number} id 
 */
function startDragging(id) {
    currentDraggedElement = id;
    markDraggableArea(`2px dotted #a8a8a8`);
}


/**
 * let task drop if dragging ends
 * 
 * @param {DragEvent} ev 
 */
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


/**
 * delete tasks on board
 */
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


/**
 * marks draggable areas on board where u can put tasks
 * 
 * @param {css property} style 
 */
function markDraggableArea(style) {
    let draggableArea = document.getElementsByClassName('task-body');
    for (let i = 0; i < draggableArea.length; i++) {
        const area = draggableArea[i];
        area.style.border = style;
    }
}


/**
 * show overlay add task
 */
function overlayAddTask() {
    document.getElementById('overlayAddTask').classList.remove('display-none');
    document.getElementById('board-content').classList.add('display-none');
    document.getElementById('overlayAddTask').classList.add('overlay-add-task');
    document.getElementById('mobileCreate').style.visibility = 'visible'; getDateOverlay()
    document.body.classList.add('overflow-hidden');
    document.body.classList.add('overflow-y');
    renderOverlayAddTask();
    getDateOverlay();
}


/**
 * close overlay add task
 */
function closeOverlay() {
    clearAll();
    document.getElementById('overlayAddTask').classList.remove('overlay-add-task');
    document.getElementById('overlayAddTask').classList.add('display-none');
    document.getElementById('board-content').classList.remove('display-none');
    document.body.classList.remove('overflow-hidden');
    document.getElementById('mobileCreate').style.visibility = 'hidden';
}


/**
 * close detail view
 */
function closeDetailView() {
    editContacts = [];
    document.getElementById('taskDetailView').classList.add('display-none');
    document.body.classList.remove('overflow-hidden');
    menuContactsOpen = false;
}


/**
 * 
 * @param {PointerEvent} event 
 */
function noClose(event) {
    event.stopPropagation();
}


/**
 * search function
 */
function filterTasks() {
    let inputValue = document.getElementById('search-input').value;
    if (inputValue === '') {
        // Das Eingabefeld ist leer, zeige alle Aufgaben an
        renderTasks(tasks_board);
    } else {
        // Das Eingabefeld ist nicht leer, filtere die Aufgaben
        filteredTasks = [];
        for (let i = 0; i < tasks_board.length; i++) {
            const task = tasks_board[i];
            if (inputValueIsInTask(inputValue, task)) filteredTasks.push(task);
        }
        renderTasks(filteredTasks);
    }
    document.getElementById('search-input').addEventListener('input', filterTasks);
}


/**
 * 
 * @returns searching parameters for filterTasks
 */
function inputValueIsInTask(input, task) {
    return task['title'].toLowerCase().includes(input.toLowerCase()) || task['description'].toLowerCase().includes(input.toLowerCase());
}


/**
 * create Task on Board
 */
function createTaskonBoard() {
    if (allFilled()) {
        createTaskAccordingToStatus();
        createTaskonBoardExecuted = true;
        createTask();
    }
    else {
        showTasknotFull();
    }
};


function createTaskAccordingToStatus() {
    let selectedStatus = localStorage.getItem('selectedStatus');

    switch (selectedStatus) {
        case 'todo':
            task.status = "todo"
            break;
        case 'progress':
            task.status = "progress"
            break;
        case 'feedback':
            task.status = "feedback"
            break;
        case 'done':
            task.status = "done"
            break;
        default:
            break;
    }
}


function selectToDo() {
    localStorage.setItem('selectedStatus', 'todo');
}


function selectProgress() {
    localStorage.setItem('selectedStatus', 'progress');
}


function selectFeedback() {
    localStorage.setItem('selectedStatus', 'feedback');
}


function selectDone() {
    localStorage.setItem('selectedStatus', 'done');
}


/**
 * add Task to Board
 */
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


/**
 * shows a notification that task is not completely filled
 */
function showTasknotFull() {
    if (!button_delay) {
        button_delay = true;
        if (!taskCategory) clearInputField();
        if (taskCategory) setCategory(taskCategory, color);
        if (enter_email) clearEmailField();
        closeMenu('contacts', 'dropDownContacts')
        checkWhichFieldIsEmpty()
        setTimeout(() => button_delay = false, 2500);
    }
}


/**
 * opens the edit contacts in task
 */
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


/**
 * render edited contacts
 */
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


/**
 * Html of renderEditContacts()
 * 
 * @param {number} i 
 * @param {string} userName 
 */
function renderEditTaskContactsHTML(i, userName) {
    document.getElementById('editContacts').innerHTML += `
            <div class="render_categorys" onclick="editTaskSetContacts(${i})">
                ${userName}  
                <div class="custom_checkBox">
                    <div id="Checkbox${i}"></div>
                </div>
            </div>`;
};


/**
 * edit contacts in tasks
 * 
 * @param {number} i 
 */
function editTaskSetContacts(i) {
    let index = editors.indexOf(editContacts[i])
    if (index == -1) {
        document.getElementById('Checkbox' + i).classList.add('custom_checkBox_child');
        if (editContacts[i]['name'] == current_user) editContacts[i]['name'] = current_user;
        editors.push(editContacts[i]);
        renderEditorsInitials()
    } else {
        document.getElementById('Checkbox' + i).classList.remove('custom_checkBox_child');
        editors.splice(index, 1);
        renderEditorsInitials()
    }
};
