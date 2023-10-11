let inProgessCount = 0;
let awitFeedbackCount = 0;
let taskInBoard = 0;
let todoCount = 0;
let doneCount = 0;
let urgentCount = 0;
let current_user = {};
let user_name;
let dates = new Array;
let upcomingDeadline = '';


/**
 * greet user on page load
 */
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


/**
 * init summary
 */
async function init() {
    await downloadFromServer();
    let tasks = await JSON.parse(backend.getItem('tasks'));
    user_name = current_user['name']
    if (tasks !== null) {
        taskInBoard = tasks.length;
        tasks.forEach(task => {
            checkPrioAndDate(task);
            checkStatus(task.status);
        });
        dateDeatline(dates);
    }
    genHtmlToSeite();
}


/**
 * check if urgent task are in board
 */
function checkPrioAndDate(task) {
    if (task.prio === 'urgent') {
        urgentCount++;
        dates.push(task.date);
    }
}


/**
 * shows the most urgent datum on summary
 * 
 * @param {array} array 
 */
function dateDeatline(array) {
    let today = new Date();

    let nextDate = array
        .filter(function (datum) {
            return new Date(datum) <= today;
        })
        .sort(function (a, b) {
            return new Date(b) - new Date(a);
        })
        .shift();

    formatDate(nextDate);
}


/**
 * formate Date in day.month.year
 * 
 * @param {array} nextDate 
 */
function formatDate(nextDate) {
    let d = new Date(nextDate)
    let day = d.getDate();
    let month = d.getMonth() + 1;
    let year = d.getFullYear();
    upcomingDeadline = day + "." + month + "." + year;
}


/**
 * check if tasks are in board & if so shows it in summary
 * 
 * @param {boolean} status 
 */
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


/**
 * generate summary html
 */
function genHtmlToSeite() {
    document.getElementById('overview').innerHTML = /*html */`
    
    <div class="summery_head">
            <div class="headline">Summary</div>
            <div class="nutshell">
                <span>Everything in a nutshell!</span>
            </div>
            <div class="seperator" style="display: none;"></div>
        </div>
        <div class="task">
            <a onclick="goToBoardAddTask()" class="task_sub">
                <span class="count">
                    ${taskInBoard}
                </span>
                <span class="status">
                    Tasks in <br>
                    Board
                </span>
            </a>
            <a onclick="goToBoardAddTask()" class="task_sub">
                <span class="count">
                    ${inProgessCount}
                </span>
                <span class="status">
                    Tasks in <br>
                    Progress
                </span>
            </a>
            <a onclick="goToBoardAddTask()" class="task_sub">
                <span class="count">
                    ${awitFeedbackCount}
                </span>
                <span class="status">
                    Awaiting <br>
                    Feedback
                </span>
            </a>
        </div>
        <a onclick="goToBoardAddTask()" class="prio_date">
            <div class="prio_date_sub">
                <img class="prio_date_sub-img" src="assets/img/urgent.svg" alt="">
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
                        ${upcomingDeadline}
                        <span class="status">Upcoming Deadline</span>
                    </span>
                    
                </div>
            </div>
        </a>
        <div class="todo_done">
            <a onclick="goToBoardAddTask()" class="todo_done_sub">
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
            <a onclick="goToBoardAddTask()" class="todo_done_sub">
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

