
function initBoard() {
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