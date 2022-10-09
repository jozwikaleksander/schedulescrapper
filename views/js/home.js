const form = document.querySelector('form');

const date = new Date();

const timeInput = document.querySelector('#time-input');

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
    let name = form.elements.name.value;
    let option = form.elements.query.value;
    let time = form.elements.time.value;
    let day = form.elements.day.value;

    window.open(`?q=${option}&url=${name}&t=${time}&d=${day}`,'_self');
});