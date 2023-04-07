let prio;
let categorys = [];
let menuOpen = false;

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


function setColor(color) {
document.getElementById(color).style.transform = 'scale(1)';
}






