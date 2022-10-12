// Get form
const form = document.querySelector('form');

const date = new Date();

// Current lesson inputs / containers
const clRadio = document.querySelector('#currentLesson');
const clTime = document.querySelector('#cl-time');
const clDay = document.querySelector('#cl-day');
const clContainer = document.querySelector('#cl-container');

// Schedule inputs / containers
const scheduleRadio = document.querySelector('#schedule');
const elRadio = document.querySelector('#everyLesson');
const elContainer = document.querySelector('#el-container');

// Set values of time and day inputs 
let hours = date.getHours();
let minutes = date.getMinutes();

if (minutes < 10) {
    minutes = '0' + minutes;
}
if (hours < 10) {
    hours = '0' + hours;
}

clDay.value = date.getDay();

clTime.value = hours + ':' +minutes;
// --------------------------------------

// Hide current lesson and every lesson containers (additional inputs);
$(clContainer).height(0);
$(elContainer).height(0);

// Submiting form without reloading the website
form.addEventListener('submit', function(e) {
    e.preventDefault(); 

    // Query properties
    let url = form.elements.url.value;
    let name = form.elements.name.value;
    let option = form.elements.query.value;
    let time = '';
    let day = '';
    let matchWholeWord = '';
    matchWholeWord = localStorage.getItem('matchWholeWord');

    // Check type of the query
    if(option == 'currentLesson') {
        time = form.elements.clTime.value;
        day = form.elements.clDay.value;
    } else if(option=='everyLesson'){
        day = form.elements.elDay.value;
    }

    // Get URL that will be open
    let fullURL = prepareURL({
        'url': url,
        'n': name,
        'q': option,
        't': time,
        'd': day,
        'm': matchWholeWord
    })

    // Open URL / send query
    window.open(`?${fullURL}`,'_self');
});
// Fired when user clicks radio button
const radioChecked = (e) => {
    const id = e.id;

    if(id == "currentLesson") {
        $(clContainer).animate({height:100},200);
        $(elContainer).animate({height:0},200);
    } else if(id == "everyLesson") {
        $(elContainer).animate({height:45 },200);
        $(clContainer).animate({height:0},200);
    }
    else{
        $(elContainer).animate({height:0},200);
        $(clContainer).animate({height:0},200);
    }
}
// Function for show error message
const showError = (txt) => {
    let errorBox = document.querySelector('.error');

    errorBox.innerHTML = txt;
    errorBox.classList.remove('hidden');
}
// Function returning URL ready to be sent
// Expected input: {p1:p1_value,p2:p2_value,p3:p3_value}
const prepareURL = (properties) => {
    let result = "";

    let keys = Object.keys(properties);
    let values = Object.values(properties);

    for (let index = 0; index < keys.length; index++) {
        if(values[index] != '' && values[index] != undefined){
            console.log(keys[index]);
            result += `&${keys[index]}=${values[index]}`;
        }
    }
    return result.slice(1);
}