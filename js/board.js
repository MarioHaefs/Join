let currentDraggedElement;
let todos = [
    {
        'id': 0,
        'category': 'todo',
        'topic': 'Finanzen',
        'title': 'Steuererklärung',
        'description': 'Steuererklärung erledigen',
        'subtasks': {
            'quantity': 2,
            'done': 1
        },
        'editors': [0],
        'prio': 'medium'
    },
    {
        'id': 1,
        'category': 'progress',
        'topic': 'Hobby',
        'title': 'Notenmappe',
        'description': 'Notenmappe sortieren',
        'subtasks': {
            'quantity': 5,
            'done': 2
        },
        'editors': [0],
        'prio': 'medium'
    }
];

let editors;

async function initBoard() {
    setURL('https://gruppe-5009.developerakademie.net/smallest_backend_ever');
    await downloadFromServer();
    editors = JSON.parse(backend.getItem('contacts')) || [];
    console.log(editors);
    renderTasks();
}

function renderTasks() {
    //renderSingleTask();
    deleteTasksOnBoard();

    for (let i = 0; i < todos.length; i++) {
        const task = todos[i];
        renderSingleTask(task);
    }
}

/**
 * render card for single task
 * @param {string} taskStatus - Status / column of the task
 * @todo complete task
 */
function renderSingleTask(task) {
    let destination = document.getElementById(`tasks-${task['category']}`);
    destination.innerHTML += `
        <div draggable="true" ondragstart="startDragging(0)" class="task" id="task1">
            ${htmlTaskTopic(task)}
            ${htmlTaskTitle(task)}
            ${htmlTaskDescription(task)}
            ${htmlTaskSubtasks(task)}
            ${htmlTaskEditors(task)}
        </div>
    `;
}

/**
 * 
 * @returns html code for the topic of the task
 */
function htmlTaskTopic(task) {
    return `<div class="task-topic">${task['topic']}</div>`;
}

function htmlTaskTitle(task) {
    return `<h4>${task['title']}</h4>`;
}

function htmlTaskDescription(task) {
    return `<span>${task['description']}</span>`;
}

function htmlTaskSubtasks(task) {
    return `<div class="task-subtasks">
                <div class="task-subtasks-line"></div>
                <span>${task['subtasks']['done']}/${task['subtasks']['quantity']} Done</span>
            </div>
    `;
}

function htmlTaskEditors(task) {
    let htmlCodeTemp = '';
    for (let i = 0; i < task['editors'].length; i++) {
        const editor = task['editors'][i];
        htmlCodeTemp += `
            <div class="contact-frame" style="background-color: ${editors[editor]['color']}">
                ${editors[editor]['initials']}
            </div>
        `;
    }
    return `<div class="editors">${htmlCodeTemp}${htmlTaskPrio(task)}</div>`;
}

function htmlTaskPrio(task) {
    return `<div class="task-prio">${task['prio']}</div>`;
}

function startDragging(id) {
    currentDraggedElement = id;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function moveTo(category) {
    todos[currentDraggedElement]['category'] = category;
    renderTasks();
}

function deleteTasksOnBoard() {
    document.getElementById('tasks-todo').innerHTML = '';
    document.getElementById('tasks-progress').innerHTML = '';
    document.getElementById('tasks-feedback').innerHTML = '';
    document.getElementById('tasks-done').innerHTML = '';
}