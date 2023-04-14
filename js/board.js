let currentDraggedElement;
let editors;
let tasks;

async function initBoard() {
    setURL('https://gruppe-5009.developerakademie.net/smallest_backend_ever');
    await downloadFromServer();
    editors = JSON.parse(backend.getItem('contacts')) || [];
    tasks = JSON.parse(backend.getItem('tasks')) || [];
    console.log(tasks);
    renderTasks();
}

function renderTasks() {
    //renderSingleTask();
    deleteTasksOnBoard();

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
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
        <div draggable="true" ondragstart="startDragging(${task['task_id']})" class="task" id="task1">
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
    return `<div class="task-topic">${task['category']}</div>`;
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
                <span>${task['done'].filter(Boolean).length}/${task['subtasks'].length} Done</span>
            </div>
    `;
}

function htmlTaskEditors(task) {
    let htmlCodeTemp = '';
    for (let i = 0; i < task['contacts_id'].length; i++) {
        const editor = task['contacts_id'][i];
        if (editor == null) return;
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
    console.log('Dragging ID: ', currentDraggedElement);
}

function allowDrop(ev) {
    ev.preventDefault();
}

function moveTo(status) {
    let taskIndex = tasks.findIndex((task) => task['task_id'] == currentDraggedElement);
    console.log(taskIndex);
    tasks[taskIndex]['status'] = status;
    renderTasks();
}

function deleteTasksOnBoard() {
    document.getElementById('tasks-todo').innerHTML = '';
    document.getElementById('tasks-progress').innerHTML = '';
    document.getElementById('tasks-feedback').innerHTML = '';
    document.getElementById('tasks-done').innerHTML = '';
}

function checkTaskStatus(task) {
    if (task['status'] != null) {
        return `tasks-${task['status']}`;
    } else {
        return 'tasks-todo';
    }
}