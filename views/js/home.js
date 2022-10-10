const form = document.querySelector('form');

const date = new Date();

const currentLessonRadio = document.querySelector('#currentLesson');
const timeInput = document.querySelector('#time-input');
const dayInput = document.querySelector('#day');

const timeLabel = document.querySelector('#time-label');
const dayLabel = document.querySelector('#day-label');
const currentLessonContainer = document.querySelector('#current-lesson-container');
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

timeInput.defaultValue = hours + ':' +minutes;

// Submiting form without reloading the website
form.addEventListener('submit', function(e) {
    e.preventDefault();
    let url = form.elements.url.value;
    let option = form.elements.query.value;
    let time = form.elements.time.value;
    let day = dayInput.value;
    let name = form.elements.name.value;

    if(name == ''&&url[url.length-1] == 'l'){
        window.open(`?q=${option}&url=${url}&t=${time}&d=${day}`,'_self');
    }
    else if (url[url.length-1] != 'l'){
        console.log(url[url.length-1]);
        window.open(`?q=${option}&url=${url}&t=${time}&d=${day}&n=${name}`,'_self');
    }
});
const radioChecked = (e) => {
    const id = e.id;

    if(id == "currentLesson") {
        $(currentLessonContainer).animate({height:100},200);
        $(everyLessonContainer).animate({height:0},200);
    } else if(id == "everyLesson") {
        $(everyLessonContainer).animate({height:30},200);
        $(currentLessonContainer).animate({height:0},200);
    }
    else{
        $(everyLessonContainer).animate({height:0},200);
        $(currentLessonContainer).animate({height:0},200);
    }
}