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
    <div class="drop_down" id="dropDown">
                    Select task category
                    <img class="down_image" src="assets/img/drop-down-arrow.png" onclick="openCategory()">
                </div>
                <div id="categorys" class="render_categorys_box"></div>`;
};


function showCategoryColorHTML() {
    return document.getElementById('categoryBox').innerHTML = `
    <div class="drop_down" id="dropDown">
                    <div class="category_color">
                        ${taskCategory}
                        <div  class="color2" style="background-color: ${color};"></div>
                    </div>
                    <img class="down_image" src="assets/img/drop-down-arrow.png" onclick="openCategory()">
                </div>
                <div id="categorys" class="render_categorys_box"></div>`;
};


function renderCategorysHTML(clr, i, category) {
    return document.getElementById('categorys').innerHTML += `
        <div class="render_categorys">
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
