

function initBoard() {
    // setURL('https://gruppe-5009.developerakademie.net/smallest_backend_ever');
    renderTasks();
}

function renderTasks() {
    renderSingleTask();
}

/**
 * render card for single task
 * @param {string} taskStatus - Status / column of the task
 * @todo complete task
 */
function renderSingleTask() {
    let todo = document.getElementById('tasks-to-do');
    todo.innerHTML = '';
    todo.innerHTML += `
        <div class="task" id="task1">
            ${htmlTaskTopic()}
            ${htmlTaskTitle()}
            ${htmlTaskDescription()}
            ${htmlTaskSubtasks()}
            ${htmlTaskEditors()}
        </div>
    `;
}

/**
 * 
 * @returns html code for the topic of the task
 */
function htmlTaskTopic() {
    return `
        <div class="task-topic">
            Topic
        </div>
    `;
}

function htmlTaskTitle() {
    return `
        <h4>Titel</h4>
    `;
}

function htmlTaskDescription() {
    return `
        <span>
            Aufgabenbeschreibung
        </span>
    `;
}

function htmlTaskSubtasks() {
    return `
        <div class="task-subtasks">
            <div class="task-subtasks-line"></div>
            <span>1/2 Done</span>
        </div>
    `;
}

function htmlTaskEditors() {
    //todo
}