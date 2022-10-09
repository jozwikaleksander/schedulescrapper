// Getting current lesson
const getCurrentLesson = (data,time,providedDayIndex) => {
    let response = "";
    
    // Getting the current time
    let date = new Date();
    let hours;
    let minutes
    if(time==undefined){
        hours = date.getHours();
        minutes = date.getMinutes();
    } else{
        hours = parseInt(time.split(":")[0]);
        minutes = parseInt(time.split(":")[1]);
    }
    // Calculating current time in minutes from the beginning of the day (e.g. 8:30 -> 510));
    let timeInMinutes = (hours*60) + minutes;
    // Creating a variable that will store the index of current lesson
    let currentLessonIndex = 0;

    // Creating a variable that will store current lesson object
    let currentLesson = {
        'index': 0,
        'interval': [],
        'info': ""
    }

    // Creating a variable that will store the index of current day.
    let dayName;

    // Checking if day was provided in the query
    if(checkIfDayWasProvided(providedDayIndex)){
        dayName = getDayName(providedDayIndex);
       
    } else {
        dayName = getDayName(date.getDay());
    }

    // Checking if day is a school day
    if(!checkDay(dayName)){
        dayName = "Poniedziałek";
        let interval = timeToMinutes(getFirstLesson(data,time,dayName)['Godz']);
        timeInMinutes = interval[0];
    }
    else{
        if(checkIfTooEarly(data,timeInMinutes,dayName)){
            // console.log('Too early');
            timeInMinutes = timeToMinutes(getFirstLesson(data,time,dayName)['Godz'])[0];
        } else if (checkIfTooLate(data,timeInMinutes,dayName)){
            // console.log('Too late');
            if(dayName == "Piątek"){
                dayName = "Poniedziałek";
            }
            else{
                dayName = getDayName(getDayIndex(dayName)+1);   
                console.log(dayName);
            }
            let firstLesson = getFirstLesson(data,time,dayName);
            timeInMinutes = timeToMinutes(firstLesson['Godz'])[0];
        }
    }


    currentLesson = getCurrentLessonIndex(data,timeInMinutes,dayName);
    // Finding the current lesson`s index
    
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
const checkIfDayWasProvided = (providedDayIndex) => {
    if(providedDayIndex == undefined){
        return false;
    }
    return true;
}
const checkDay = (day) => {
    // Check if day is a school day
    if(day == "Sobota" || day == "Niedziela"){
        return false;
    }
    return true;
}
const getDayName = (dayIndex) => {
    let days = ["Niedziela","Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek","Sobota"];
    return days[dayIndex];
}
const getDayIndex = (dayName) => {
    let days = ["Niedziela","Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek","Sobota"];
    return days.indexOf(dayName);
}
const checkIfTooEarly = (data,time,day) => {
    let lesson = getCurrentLessonIndex(data,time,day);

    console.log(lesson);
    if(lesson){
        let interval = timeToMinutes(lesson['interval'].join("-"));        
        if(interval[0] > time && lesson['index'] == 0){
            console.log('Too early');
            return true;
        }
    }
    return false;
}
const checkIfTooLate = (data,time,day) => {
    let lesson = getLastLesson(data,time,day);

    if(lesson){
        let interval = timeToMinutes(lesson['Godz']);        
        if(interval[1] < time){
            console.log('Too late');
            return true;
        }
    }
    
    return false;
}
const getCurrentLessonIndex = (data,timeInMinutes, day) => {
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
        'info': ""
    }; 
    let currentLessonInterval = timeToMinutes(data[0][currentLessonIndex]["Godz"]);
    currentLesson.index = currentLessonIndex;
    currentLesson.interval = [minutesToTime(currentLessonInterval[0]),minutesToTime(currentLessonInterval[1])];
    currentLesson.info = data[0][currentLessonIndex][day];
    return currentLesson;
}
const inInterval = (time, interval) => {
    if((time>=interval[0] && time<=interval[1])){
        return true;
    }
    return false;
}
const getFirstLesson = (data,time,day) => {

    for(let i = 0; i < data[0].length; i++){
        let lesson = data[0][i];
        if(lesson){
            if(lesson[day] == ""){
                continue;
            }
            return lesson;
        }
    } 
}
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
// Exporting the main function
module.exports = {
    getCurrentLesson
} 