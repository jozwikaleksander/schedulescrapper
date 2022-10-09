const form = document.querySelector('form');

const date = new Date();

const currentLessonRadio = document.querySelector('#currentLesson');
const timeInput = document.querySelector('#time-input');
const dayInput = document.querySelector('#day');

const timeLabel = document.querySelector('#time-label');
const dayLabel = document.querySelector('#day-label');
const dynamicContainer = document.querySelector('#dynamic-container');
const scheduleRadio = document.querySelector('#schedule');

currentLessonRadio.checked = false;
scheduleRadio.checked = true;

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

    console.log(name);

    console.log(day);

    if(name == ''&&url[url.length-1] == 'l'){
        window.open(`?q=${option}&url=${url}&t=${time}&d=${day}`,'_self');
    }
    else if (url[url.length-1] != 'l'){
        console.log(url[url.length-1]);
        window.open(`?q=${option}&url=${url}&t=${time}&d=${day}&n=${name}`,'_self');
    }
});

currentLessonRadio.addEventListener('change', () => {
    if(currentLessonRadio.checked) {
        dynamicContainer.className = 'more';
    } else{
        dynamicContainer.className = 'less';
    }
});

scheduleRadio.addEventListener('click', () => {
    if(scheduleRadio.checked) {
        dynamicContainer.className = 'less';
    } else{
        dynamicContainer.className = 'more';
    }
});