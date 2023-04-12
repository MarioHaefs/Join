
function initBoard() {
    renderTasks();
}

function renderTasks() {
    renderSingleTask();
}

function renderSingleTask() {
    let todo = document.getElementById('tasks-to-do');
    todo.innerHTML = '';
    todo.innerHTML += `
        <div class="task" id="task1">
            test1
        </div>
    `;
}