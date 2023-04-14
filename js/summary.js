function greet() {
    currentlyDate = new Date();
    curentlyHour = currentlyDate.getHours();
    if(curentlyHour > 4 && curentlyHour < 12) document.getElementById('hallo').innerHTML =`Good Morning,`;
    if(curentlyHour > 11 && curentlyHour < 18) document.getElementById('hallo').innerHTML =`Good afternoon,`;
    if(curentlyHour > 18 && curentlyHour < 5) document.getElementById('hallo').innerHTML =`Good evening,`;
};