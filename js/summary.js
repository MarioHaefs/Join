let inProgessCount = 0;
let awitFeedbackCount = 0;
let taskInBoard = 0;
let todoCount = 0;
let doneCount = 0;
let urgentCount = 0;
let current_user = {};
let user_name;

let tada = [];


function greet() {
    init();
    currentlyDate = new Date();
    curentlyHour = currentlyDate.getHours();
    if (curentlyHour >= 3 && curentlyHour < 12) document.getElementById('hallo').innerHTML = `Good Morning,`;
    if (curentlyHour >= 12 && curentlyHour < 18) document.getElementById('hallo').innerHTML = `Good afternoon,`;
    if (curentlyHour >= 18) document.getElementById('hallo').innerHTML = `Good evening,`;
    if (curentlyHour >= 0 && curentlyHour < 3) document.getElementById('hallo').innerHTML = `Good evening,`;
    document.getElementById('greetName').innerHTML = localStorage.getItem('currentUser');
};


async function init() {
    await downloadFromServer();
    let tasks = await JSON.parse(backend.getItem('tasks'));
    let tada = await JSON.parse(backend.getItem('users'));
    user_name = current_user['name']
    console.log(tada);
    if (tasks !== null) {
        console.log(tasks);
        taskInBoard = tasks.length;
        tasks.forEach(task => {
            checkPrioAndDate(task.prio);
            checkStatus(task.status);
        });

    }
    genHtmlToSeite();
}

function checkPrioAndDate(prio) {
    if (prio === 'urgent') {
        urgentCount++;
    }
    //TODO: Date checker!
}

function checkStatus(status) {
    switch (status) {
        case 'progress':
            inProgessCount++
            break;
        case 'feedback':
            awitFeedbackCount++
            break;
        case 'todo':
            todoCount++
            break;
        case 'done':
            doneCount++
            break;
        default:
            break;
    }
}

// HTML Teil

function genHtmlToSeite() {
    document.getElementById('overview').innerHTML = /*html */`
    
    <div class="summery_head">
            <div class="headline">Summary</div>
            <div class="nutshell">
                <span>Everything in a nutshell!</span>
            </div>
        </div>
        <div class="task">
            <a href="board.html" class="task_sub">
                <span class="count">
                    ${taskInBoard}
                </span>
                <span class="status">
                    Tasks in <br>
                    Board
                </span>
            </a>
            <a href="board.html" class="task_sub">
                <span class="count">
                    ${inProgessCount}
                </span>
                <span class="status">
                    Tasks in <br>
                    Progress
                </span>
            </a>
            <a href="board.html" class="task_sub">
                <span class="count">
                    ${awitFeedbackCount}
                </span>
                <span class="status">
                    Awaiting <br>
                    Feedback
                </span>
            </a>
        </div>
        <a href="board.html" class="prio_date">
            <div class="prio_date_sub">
                <img src="assets/img/urgent.svg" alt="">
                <div class="todo">
                    <span class="count">
                        ${urgentCount}
                    </span>
                    <span class="status">
                        Urgent
                    </span>
                </div>
            </div>
            <div>
                <div class="todo">
                    <span class="datum">
                        Datum
                        <span class="status">Upcoming Deadline</span>
                    </span>
                    
                </div>
            </div>
        </a>
        <div class="todo_done">
            <a href="board.html" class="todo_done_sub">
                <img src="assets/img/pencil.svg" alt="">
                <div class="todo">
                    <span class="count">
                        ${todoCount}
                    </span>
                    <span class="status">
                        To-do
                    </span>
                </div>
            </a>
            <a href="board.html" class="todo_done_sub">
                <img src="assets/img/check.svg" alt="">
                <div class="todo">
                    <span class="count">
                        ${doneCount}
                    </span>
                    <span class="status">
                        Done
                    </span>
                </div>
            </a>
        </div>
    
    
    
    `;
}

