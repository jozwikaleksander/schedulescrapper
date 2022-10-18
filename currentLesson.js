// Getting current lesson
const getCurrentLesson = (data,time,providedDayIndex) => {
    let response = "";

    // Getting the current time
    let date = new Date();
    let hours;
    let minutes;
    if(time==undefined){
        hours = date.getHours();
        minutes = date.getMinutes();
    } else{
        hours = parseInt(time.split(":")[0]);
        minutes = parseInt(time.split(":")[1]);
    }
    // Calculating current time in minutes from the beginning of the day (e.g. 8:30 -> 510));
    let timeInMinutes = (hours*60) + minutes;

    // Creating a variable that will store current lesson object
    let currentLesson = {
        'index': 0,
        'interval': [],
        'info': "",
        'day:': ""
    }

    // Creating a variable that will store the index of current day.
    let dayName;

    // Checking if day was provided in the query, else  get the current day
    if(checkIfDayWasProvided(providedDayIndex)){
        dayName = getDayName(providedDayIndex);
       
    } else {
        dayName = getDayName(date.getDay());
    }

    // Checking if day is a school day
    if(!checkDay(dayName)){
        // If not, change day to the next school day (e.g. Saturday -> Monday)
        dayName = "Poniedziałek";
        let interval = timeToMinutes(getFirstLesson(data,time,dayName)['Godz']); //Get time when the first lesson starts in that day
        timeInMinutes = interval[0]; // Set time to the time when the first lesson starts
    }
    else{
        // Check if there are any lessons today
        if(!checkIfAnyLessonsToday(data,dayName)){
            dayName = getWorkingDay(data,dayName);
        }
        // If it is a school day, check if it is too early
        if(checkIfTooEarly(data,timeInMinutes,dayName)){
            // If it is too early, set time to the time when the first lesson starts
            console.log('Too early');
            timeInMinutes = timeToMinutes(getFirstLesson(data,time,dayName)['Godz'])[0];
        } else if (checkIfTooLate(data,timeInMinutes,dayName)){
            // If it is too late, change day to the next school day (e.g. Tuesday -> Wednesday) and set time to the time when the first lesson starts
            console.log('Too late');
            let result = goToTheNextDay(dayName,data,time);
            timeInMinutes = result[0];
            dayName = result[1];
        }
    }

    // Getting the current lesson
    currentLesson = getLesson(data,timeInMinutes,dayName);
    
    let currentLessonStart = currentLesson.interval[0];
    let currentLessonEnd = currentLesson.interval[1];

    if(parseInt(currentLessonStart.split(":")[1]) < 10){
        currentLessonStart = currentLessonStart.split(":")[0] + ":0"+currentLessonStart.split(":")[1];
    }

    if(parseInt(currentLessonEnd.split(":")[1]) < 10){
        currentLessonEnd = currentLessonEnd.split(":")[0] + ":0"+currentLessonEnd.split(":")[1];
    }
    currentLesson.interval = [currentLessonStart,currentLessonEnd];
    console.log("Lekcja" + currentLesson.info);
    return currentLesson;
}
// Function that converts time to minutes = 8:30 -> 510
const timeToMinutes = (lesson) => {
    let interval = lesson.split("-");
    
    let start = interval[0].split(":");
    let end = interval[1].split(":");
    
    let startInMinutes = (parseInt(start[0])*60) + parseInt(start[1]);
    let endInMinutes = (parseInt(end[0])*60) + parseInt(end[1]);
    
    return [startInMinutes,endInMinutes];
}
// Function that converts minutes to time = 510 -> 8:30
const minutesToTime = (minutes) => {
    let hours = Math.floor(minutes/60);
    let min = minutes%60;
    return [hours,min].join(":");
}
// Function that checks if day was provided in the URL
const checkIfDayWasProvided = (providedDayIndex) => {
    if(providedDayIndex == undefined){
        return false;
    }
    return true;
}
// Function that checks if the day is a school day
const checkDay = (day) => {
    if(day == "Sobota" || day == "Niedziela"){
        return false;
    }
    return true;
}
// Get the name of the day based on the index
const getDayName = (dayIndex) => {
    let days = ["Niedziela","Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek","Sobota"];
    return days[dayIndex];
}
// Get the index of the day based on the name
const getDayIndex = (dayName) => {
    let days = ["Niedziela","Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek","Sobota"];
    return days.indexOf(dayName);
}
// Check if provided time is beforee the first lesson starts
const checkIfTooEarly = (data,time,day) => {
    let lesson = getFirstLesson(data,time,day);
    if(timeToMinutes(lesson['Godz'])[0] > time){
        return true;
    }
    return false;
}
// Check if provided time is after the last lesson ends
const checkIfTooLate = (data,time,day) => {
    let lesson = getLastLesson(data,time,day);
    console.log(lesson);
    if(timeToMinutes(lesson['Godz'])[1] < time){
        return true;
    }
    
    return false;
}
// Get lesson that is currently happening
// Result:
// {
//     'index': 0,
//     'interval': [7:00,7:45],
//     'info': "J.Polski ",
//     'day':'Poniedziałek'
// }
const getLesson = (data,timeInMinutes, day) => {
    let currentLessonIndex = 0;
    for(let i = 0; i < data[0].length; i++){
        let lesson = data[0][i]["Godz"];
        let previousLesson = 0;
        if(data[0][i-1]!=undefined){
            previousLesson = data[0][i-1]["Godz"];
        }
        if(lesson){
            // Current Lesson 
            let lessonInMinutes = timeToMinutes(lesson);

            // If previous lesson exists = current lesson has index 1 or bigger
            if(previousLesson != 0){
                let previousLessonInMinutes = timeToMinutes(previousLesson);
                let previousLessonStart = previousLessonInMinutes[0];
                let previousLessonEnd = previousLessonInMinutes[1];
                // If the current time is in between of break and the next lesson
                if((timeInMinutes>=lessonInMinutes[0] && timeInMinutes<=lessonInMinutes[1])||(timeInMinutes>previousLessonEnd && timeInMinutes<lessonInMinutes[0])){
                    currentLessonIndex = i;
                    break;
                }
            }
            // If current lesson is the first lesson of the day 
            else{
                // If the current time is in interval of the current lesson
                if(inInterval(timeInMinutes,lessonInMinutes)){
                    currentLessonIndex = i;
                    break;
                }
            }
        }
    }
    let currentLesson = {
        'index': 0,
        'interval': [],
        'info': "",
        'day':''
    }; 
    let currentLessonInterval = timeToMinutes(data[0][currentLessonIndex]["Godz"]);
    currentLesson.index = currentLessonIndex;
    currentLesson.interval = [minutesToTime(currentLessonInterval[0]),minutesToTime(currentLessonInterval[1])];
    currentLesson.info = data[0][currentLessonIndex][day];
    currentLesson.day = day;
    return currentLesson;
}
// Check if the time is in interval
const inInterval = (time, interval) => {
    if((time>=interval[0] && time<=interval[1])){
        return true;
    }
    return false;
}
// Get the first lesson of the day
const getFirstLesson = (data,time,day) => {

    for(let i = 0; i < data[0].length; i++){
        let lesson = data[0][i];
        if(lesson){
            if(lesson[day] == ""){
                continue;
            }
            else{
                return lesson;
            }
        }
    } 
}
// Get the last lesson of the day
const getLastLesson = (data,time,day) => {
    for(let i = data[0].length-1; i >= 0; i--){
        let lesson = data[0][i];
        if(lesson){
            if(lesson[day] == ""){
                continue;
            }
            return lesson;
        }
    } 
}
// Go to the next day and set time to the beginning of first lesson
const goToTheNextDay = (dayName,data,time) => {
    if(dayName == "Piątek"){
        dayName = "Poniedziałek";
    }
    else{
        dayName = getDayName(getDayIndex(dayName)+1);   
    }
    let firstLesson = getFirstLesson(data,time,dayName);
    let timeInMinutes = timeToMinutes(firstLesson['Godz'])[0];

    return [timeInMinutes, dayName];
}
// Check if the are any lessons in this day (primarly for teachers and classes)
const checkIfAnyLessonsToday = (data,day) => {
    for(let i = 0; i < data[0].length; i++){
        let lesson = data[0][i];
        if(lesson){
            if(lesson[day] != ""){
                return true;
            }
        }
    } 
    return false;
}
// Get day where there are any lessons
const getWorkingDay = (data,day) => {
    let workingDay = {};

    while(checkIfAnyLessonsToday(data,day) == false){
        if(day == "Piątek"){
            day = "Poniedziałek";
        }
        else{
            day = getDayName(getDayIndex(day)+1);   
        }
    }
    return day;
}
// Exporting the main function
module.exports = getCurrentLesson