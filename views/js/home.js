const form = document.querySelector('form');

const date = new Date();

// Current lesson inputs / containers
const clRadio = document.querySelector('#currentLesson');
const clTime = document.querySelector('#cl-time');
const clDay = document.querySelector('#cl-day');
const clContainer = document.querySelector('#cl-container');

const scheduleRadio = document.querySelector('#schedule');
const elRadio = document.querySelector('#everyLesson');
const elContainer = document.querySelector('#el-container');

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

$(clContainer).height(0);
$(elContainer).height(0);

// Submiting form without reloading the website
form.addEventListener('submit', function(e) {
    e.preventDefault();
    let url = form.elements.url.value;
    let name = form.elements.name.value;
    let option = form.elements.query.value;
    let time = '';
    let day = '';

    if(option == 'currentLesson') {
        time = form.elements.clTime.value;
        day = form.elements.clDay.value;
    } else if(option=='everyLesson'){
        day = form.elements.elDay.value;
    }
    
    if(name == ''){
        window.open(`?q=${option}&url=${url}&t=${time}&d=${day}`,'_self');
    }
    else if (name!=''){
        window.open(`?q=${option}&url=${url}&t=${time}&d=${day}&n=${name}`,'_self');
    }
    else{
        showError('Podano złe dane');
    }
});
const radioChecked = (e) => {
    const id = e.id;

    if(id == "currentLesson") {
        $(clContainer).animate({height:100},200);
        $(elContainer).animate({height:0},200);
    } else if(id == "everyLesson") {
        $(elContainer).animate({height:40},200);
        $(clContainer).animate({height:0},200);
    }
    else{
        $(elContainer).animate({height:0},200);
        $(clContainer).animate({height:0},200);
    }
}
const showError = (txt) => {
    let errorBox = document.querySelector('.error');

    errorBox.innerHTML = txt;
    errorBox.classList.remove('hidden');
}