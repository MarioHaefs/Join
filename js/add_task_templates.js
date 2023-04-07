function showInputCategoryHTML() {
    return document.getElementById('categoryBox').innerHTML = `
    <div class="category_name_box">
                <form>
                    <input class="input_category_name" type="text" placeholder="New category name" id="categoryValue" required>
                    <div class="x✔">
                        <div onclick="clearInputField()" class="x"><img src="assets/img/x.svg" alt=""></div>
                        <button onclick="addNewCategory()"><img class="hook" src="assets/img/haken.png"></button>
                    </div>
                </form>
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
                    <img class="down_image" src="assets/img/drop-down-arrow.png" onclick="showNewCategory()">
                </div>
                <div id="categorys"></div>`;
};


function showCategoryColorHTML(cgry, clr) {
    return document.getElementById('categoryBox').innerHTML = `
    <div class="drop_down" id="dropDown">
                    <div class="category_color">
                        ${cgry}
                        <div  class="color2" style="background-color: ${clr};"></div>
                    </div>
                    <img class="down_image" src="assets/img/drop-down-arrow.png" onclick="showNewCategory()">
                </div>
                <div id="categorys"></div>`;
};
