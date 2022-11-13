const getEveryLesson = (data,day) => {
    // Variable holding response
    let response = '';

    let date = new Date();

    let lessons = [];

    
    
    if(checkIfDayWasProvided(day)){
        dayName = getDayName(day);
       
    } else {
        dayName = getDayName(date.getDay());
    }

    if(!checkDay(dayName)){
        dayName = "Poniedziałek";
    }
    data[0].map((lesson) => {
        if(Object.keys(lesson).includes(dayName) && lesson[dayName] != ''){
            lessons.push({
                'Nr': lesson['Nr'],
                'Czas trwania': lesson['Godz'],
                'Lekcja': lesson[dayName],
                'Dzień': dayName,
            });
        }
    });
    return lessons;
}
// Function that checks if day was provided in the URL
const checkIfDayWasProvided = (providedDayIndex) => {
    if(providedDayIndex == undefined){
        return false;
    }
    return true;
}
// Get the name of the day based on the index
const getDayName = (dayIndex) => {
    let days = ["Niedziela","Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek","Sobota"];
    return days[dayIndex];
}
const checkDay = (day) => {
    if(day == "Sobota" || day == "Niedziela"){
        return false;
    }
    return true;
}

module.exports = getEveryLesson;