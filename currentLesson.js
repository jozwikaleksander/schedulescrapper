// Getting current lesson
const getCurrentLesson = (data,time,providedDayIndex) => {

    // Converting json data scrapper from html to more readable format
    let schedule = convertData(data);
    // Getting current day
    let dayIndex = providedDayIndex;

    // Getting current time
    let hours = parseInt(time.split(":")[0]);
    let minutes = parseInt(time.split(":")[1]);

    // Converting time to minutes
    let timeInMinutes = (hours*60) + minutes;

    // Checking if day is weekend
    if(dayIndex > 5){
        dayIndex = 1;
    }

    // Getting current lesson
    for (let index = 0; index < schedule.length; index++) {
        // Getting current element
        const element = schedule[index];
        
        // Getting previous element
        let previousElement;
        // Checking if previous element exists
        if(index > 0){
            previousElement = schedule[index-1];
        }
        // Checking if element's day is the same as current day
        if(element.day == dayIndex){
            // Checking if time is in interval of the lesson
            if(inInterval(timeInMinutes,element.interval)){
                return element;
            }
            // Checking if time is in interval of the break
            if(previousElement != undefined && timeInMinutes > timeToMinutes(previousElement.interval[1]) && previousElement.day == dayIndex && timeInMinutes < timeToMinutes(element.interval[0])){
                return element;
            }
            // Checking if time is before the first lesson
            if(timeInMinutes < timeToMinutes(element.interval[0])){
                return element;
            }
        }
        // Checking if it's the last lesson of the day
        else if(previousElement != undefined && previousElement.day == dayIndex){
            return element;
        }
        // Checking if it's the last lesson of the week
        if(index == schedule.length-1){
            return schedule[0];
        } 
    }
}
// Function that converts time to minutes = 8:30 -> 510
const timeToMinutes = (time) => {
    
    let hours = parseInt(time.split(":")[0]);
    let minutes = parseInt(time.split(":")[1]);
    
    return (hours*60) + minutes;
}
// Get the index of the day based on the name
const getDayIndex = (dayName) => {
    let days = ["Niedziela","Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek","Sobota"];
    return days.indexOf(dayName);
}
// Convert format of data
const convertData = (data) => {
    let result = [];

    data[0].forEach(element => {
        Object.keys(element).forEach(key => {
            if(key != 'Nr' && key != 'Godz' && element[key] != ''){
                result.push({
                    index:element['Nr'],
                    interval:element['Godz'].split("-"),
                    info: element[key],
                    day: getDayIndex(key)
                });
            }
        });
    });
    return result.sort((a,b) => a.day - b.day);
}

// Check if the time is in interval
const inInterval = (time, interval) => {
    let iStart = timeToMinutes(interval[0]);
    let iEnd = timeToMinutes(interval[1]);
    if((time>=iStart && time<=iEnd)){
        return true;
    }
    return false;
}
// Exporting the main function
module.exports = getCurrentLesson