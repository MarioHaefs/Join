let prio;
let category;
let categorys = [];
let colors = [];
let menuOpen = false;
let color;

function setPrio(x) {
    if (x == prio) removePrio();
    else {
        removePrio();
        if (x == 'urgent') {
            document.getElementById('prioUrgent').classList.add('prio_button_urgent');
            prio = 'urgent';
        }
        if (x == 'medium') {
            document.getElementById('prioMedium').classList.add('prio_button_medium');
            prio = 'medium';
        }
        if (x == 'low') {
            document.getElementById('prioLow').classList.add('prio_button_low');
            prio = 'low';
        }
    }
};

function removePrio() {
    document.getElementById('prioUrgent').classList.remove('prio_button_urgent');
    document.getElementById('prioMedium').classList.remove('prio_button_medium');
    document.getElementById('prioLow').classList.remove('prio_button_low');
    prio = '';
};


function showNewCategory() {
    if (!menuOpen) {
        document.getElementById('dropDown').classList.add('drop_down_open');
        document.getElementById('categorys').innerHTML = `<div onclick="inputCategory()" class="new_category">New category</div>`;
        menuOpen = true;
    } else {
        document.getElementById('dropDown').classList.remove('drop_down_open');
        document.getElementById('categorys').innerHTML = ``;
        menuOpen = false;
    }
}


function inputCategory() {
    showInputCategoryHTML();
}


function clearInputField() {
    showCategoryHTML();
    menuOpen = false;
};


function setColor(clr) {
    if (color) {
        document.getElementById(color).classList.remove('color_active');
    }
    document.getElementById(clr).classList.add('color_active');
    color = clr;
};


function addNewCategory() {
    let categoryValue = document.getElementById('categoryValue').value;
    if (categoryValue.length < 1 || !color) {
        alert('wird ersetzt')
    } else {
        colors.push(color);
        categorys.push(categoryValue);
        category = categoryValue;
        showCategoryColorHTML(category, color);
        menuOpen = false;
    }
};






