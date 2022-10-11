const form = document.querySelector('form');

const date = new Date();

// Current lesson inputs / containers
const clRadio = document.querySelector('#currentLesson');
const clTime = document.querySelector('#cl-time-input');
const clDay = document.querySelector('#cl-day');
const clContainer = document.querySelector('#cl-container');

const scheduleRadio = document.querySelector('#schedule');
const everyLessonRadio = document.querySelector('#everyLesson');
const everyLessonContainer = document.querySelector('#every-lesson-container');

let hours = date.getHours();
let minutes = date.getMinutes();

if (minutes < 10) {
    minutes = '0' + minutes;
}
if (hours < 10) {
    hours = '0' + hours;
}

clDay.value = date.getDay();

timeInput.defaultValue = hours + ':' +minutes;

$(clContainer).height(0);

// Submiting form without reloading the website
form.addEventListener('submit', function(e) {
    e.preventDefault();
    let url = form.elements.url.value;
    let option = form.elements.query.value;
    let time = form.elements.time.value;
    let clDay = form.elements.clDay.value;
    let name = form.elements.name.value;

    if(name == ''&&url[url.length-1] == 'l'){
        window.open(`?q=${option}&url=${url}&t=${time}&d=${cl-day}`,'_self');
    }
    else if (url[url.length-1] != 'l'){
        console.log(url[url.length-1]);
        window.open(`?q=${option}&url=${url}&t=${time}&d=${cl-day}&n=${name}`,'_self');
    }
});
const radioChecked = (e) => {
    const id = e.id;

    if(id == "currentLesson") {
        $(clContainer).animate({height:100},200);
        $(everyLessonContainer).animate({height:0},200);
    } else if(id == "everyLesson") {
        $(everyLessonContainer).animate({height:30},200);
        $(clContainer).animate({height:0},200);
    }
    else{
        $(everyLessonContainer).animate({height:0},200);
        $(clContainer).animate({height:0},200);
    }
}