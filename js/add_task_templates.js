function showInputCategoryHTML() {
    return document.getElementById('categoryBox').innerHTML = `
    <div class="category_name_box">  
                    <input class="input_category_name" type="text" placeholder="New category name" id="categoryValue" required maxlength="29">
                    <div class="x✔">
                        <div onclick="clearInputField()" class="x"><img src="assets/img/x.svg" alt=""></div>
                        <button onclick="addNewCategory()"><img class="hook" src="assets/img/haken.png"></button>
                    </div>
                </div>
                <div class="color_points">
                    <div id="#8AA4FF" class="color" onclick="setColor('#8AA4FF')" style="background-color: #8AA4FF;"></div>
                    <div id="#FF0000" class="color" onclick="setColor('#FF0000')" style="background-color: #FF0000;"></div>
                    <div id="#2AD300" class="color" onclick="setColor('#2AD300')" style="background-color: #2AD300;"></div>
                    <div id="#FF8A00" class="color" onclick="setColor('#FF8A00')" style="background-color: #FF8A00;"></div>
                    <div id="#E200BE" class="color" onclick="setColor('#E200BE')" style="background-color: #E200BE;"></div>
                    <div id="#0038FF" class="color" onclick="setColor('#0038FF')" style="background-color: #0038FF;"></div>
                </div>`;
};


function showCategoryHTML() {
    return document.getElementById('categoryBox').innerHTML = `
    <div class="drop_down" id="dropDown"  onclick="openCategory()">
                    Select task category
                    <img class="down_image" src="assets/img/drop-down-arrow.png">
                </div>
                <div id="categorys" class="render_categorys_box"></div>`;
};


function showCategoryColorHTML() {
    return document.getElementById('categoryBox').innerHTML = `
    <div class="drop_down" id="dropDown" onclick="openCategory()">
                    <div class="category_color">
                        ${taskCategory}
                        <div  class="color2" style="background-color: ${color};"></div>
                    </div>
                    <img class="down_image" src="assets/img/drop-down-arrow.png">
                </div>
                <div id="categorys" class="render_categorys_box"></div>`;
};


function renderCategorysHTML(clr, i, category) {
    return document.getElementById('categorys').innerHTML += `
        <div class="render_categorys" id="ctgry${i}">
                   <div class="set_category" onclick="setCategory('${category}', '${clr}')">
                        ${category}
                        <div  class="color2" style="background-color: ${clr};"></div>
                    </div>
                        <img class="delete_image" src="assets/img/x.svg" onclick="deleteCategory(${i})">
                    </div>`;
};


function renderSubtasHTML(subTask, i) {
    return document.getElementById('subtaskBox').innerHTML += `
        <div class="subtask_child" id="subTask${i}">
            <input type="checkbox" id="CheckboxTask${i}" class="checkbox_subtask" onclick="setSubtaskStatus(${i})")>
            <div class ="subTask_Text">${subTask}</div>
            <img src="assets/img/x.svg" onclick="deleteSubtask(${i})">
        </div>`;
};


function renderContactsHTML(i, userName) {
    document.getElementById('contacts').innerHTML += `
            <div class="render_categorys" onclick="setContacts(${i})">
                ${userName}  
                <div class="custom_checkBox">
                    <div id="Checkbox${i}"></div>
                </div>
            </div>`;
};


function renderOverlayHTML() {
    document.getElementById('overlay').innerHTML = `
    <div class="form">
    <div class="overlay_headline">Add Task</div>
        <div class="form_left">

            <!---------------------------------------------------------Title Input----------------------------------------------------------------------------->

            <span>Title</span>
            <input type="text" placeholder="Enter a title" id="title" maxlength="29" onfocus="removeBorder('title')">

            <!---------------------------------------------------------Description Input----------------------------------------------------------------------->

            <span>Description</span>
            <textarea placeholder="Enter a Description" id="description"
                onfocus="removeBorder('description')"></textarea>

            <!---------------------------------------------------------Category Menu--------------------------------------------------------------------------->

            <span>Category</span>
            <div id="categoryBox">
                <div class="drop_down" id="dropDown" onclick="openCategory()">
                    Select task category
                    <img class="down_image" src="assets/img/drop-down-arrow.png">
                </div>
                <div id="categorys" class="render_categorys_box"></div>
            </div>

            <!-------------------------------------------------------------Contacts Menu----------------------------------------------------------------------->

            <span>Assigned to</span>
            <div id="contactBox">
                <div class="drop_down" id="dropDownContacts" onclick="openContacts()">
                    Select contacts to assign
                    <img class="down_image" src="assets/img/drop-down-arrow.png">
                </div>
                <div id="contacts" class="render_categorys_box"></div>
            </div>
            <div id="initials" class="initials_box"></div>
        </div>

        <div class="form_right">

            <!-------------------------------------------------------------input Date------------------------------------------------------------------------->

            <span>Due date</span>
            <input type="date" id="dateOverlay" autofocus>

            <!-------------------------------------------------------------input Priority--------------------------------------------------------------------->

            <span>Prio</span>
            <div class="prio" id="prio">
                <div class="prio_button" id="prioUrgent" onclick="setPrio('urgent')">Urgent<img
                        src="assets/img/prioUrgent.png"></div>
                <div class="prio_button" id="prioMedium" onclick="setPrio('medium')">Medium <img
                        src="assets/img/prioMedium.png"></div>
                <div class="prio_button" id="prioLow" onclick="setPrio('low')">Low <img src="assets/img/prioLow.png">
                </div>
            </div>

            <!-------------------------------------------------------------input Subtasks--------------------------------------------------------------------->

            <span style="margin-top: 34px;">Subtasks</span>
            <div class="subtasks">
                <input type="text" placeholder="Add new subtask" id="subTask" maxlength="29">
                <img class="plus_image" src="assets/img/plus.svg" onclick="addSubtask()">
            </div>
            <div class="subtask_box" id="subtaskBox"></div>
            <div class="clear_create_task">
                <div class="clear_button" onclick="clearAll()">Clear x</div>
                <div class="create_button" onclick="createTaskonBoard()">Create Task ✔</div>
            </div>
        </div>`;
}


function renderClearEmaailHTML() {
    document.getElementById('contactBox').innerHTML = `
    <div class="drop_down" id="dropDownContacts" onclick="openContacts()">
                    Select contacts to assign
                    <img class="down_image" src="assets/img/drop-down-arrow.png">
                </div>
                <div id="contacts" class="render_categorys_box"></div>`;
}


function renderInviteContactHTML() {
    document.getElementById('contactBox').innerHTML = `
    <div class="category_name_box">  
                    <input class="input_category_name" type="email" placeholder="Please enter e-mail" id="inviteValue" required maxlength="29">
                    <div class="x✔">
                        <div onclick="clearEmailField()" class="x"><img src="assets/img/x.svg" alt=""></div>
                        <button onclick="sendEmail()"><img class="hook" src="assets/img/haken.png"></button>
                    </div>
                </div>`;
}


function renderEditClearEmailHTML() {
    document.getElementById('contactBox').innerHTML = `
    <div class="drop_down" id="dropDownEditContacts" onclick="openEditTaskContacts()">
                        Select contacts to assign
                        <img class="down_image" src="assets/img/drop-down-arrow.png">
                    </div>
                    <div id="editContacts" class="render_categorys_box"></div>
                </div>`;
};