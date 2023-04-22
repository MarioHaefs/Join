let currentDraggedElement;
let editors;
let tasks_board;
let categorys_board;
let filteredTasks;

// set backend url
setURL('https://gruppe-5009.developerakademie.net/smallest_backend_ever');

async function initBoard() {
    await loadData();
    renderTasks(tasks_board);
}

// load data from backend
async function loadData() {
    await downloadFromServer();
    editors = JSON.parse(backend.getItem('contacts')) || [];
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
        <div draggable="true" ondragstart="startDragging(${task['task_id']})" class="task" id="task${task['task_id']}">
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
    return `<span>${task['description']}</span>`;
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
    for (let i = 0; i < task['contacts_id'].length; i++) {
        const editor = task['contacts_id'][i];
        if (editor == null) break; // exit for each loop when no editor is available - prevent error
        if (moreThan2Editors(i)) {
            htmlCodeTemp += htmlTaskLeftOverEditors(task);
            break;
        }
        htmlCodeTemp += htmlTaskSingleEditor(editor);
    }
    return `<div class="editors">${htmlCodeTemp}</div>`;
}

function htmlTaskSingleEditor(editor) {
    return `<div class="contact-frame" style="background-color: ${editors[editor]['color']}">
                ${editors[editor]['initials']}
            </div>`;
}

function htmlTaskLeftOverEditors(task) {
    return `<div class="contact-frame">
                +${task['contacts_id'].length - 2}
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
    renderOverlayAddTask();
}

function closeOverlay() {
    document.getElementById('overlayAddTask').classList.add('display-none');
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