const currentLessonBtn = document.querySelector('.current-lesson-btn');

const urlParams = new URLSearchParams(window.location.search);
const url = urlParams.get('url');



currentLessonBtn.addEventListener('click', () => {

    window.open('?q=currentLesson&url=' + url, '_blank');

});