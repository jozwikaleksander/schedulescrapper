const settingsBtn = document.querySelector('.settings-btn');
const settingsClose = document.querySelector('.settings-submit');


const mwCheckBox = document.querySelector('#mw');
const mwExplanation = document.querySelector('.mw-explanation');
const mwExplanationBtn = document.querySelector('.mw-explanation-btn');

const jsonCheckBox = document.querySelector('#json');

$(mwExplanation).height(0);

if(localStorage.getItem('matchWholeWord') == 'true'){
    mwCheckBox.checked = true;
}

if(localStorage.getItem('outputInJSON') == 'json'){
    jsonCheckBox.checked = true;
}

settingsBtn.addEventListener('click', () => {
    $('.wrapper').toggleClass('blurred');
    $('.settings').toggleClass('hidden');
});

mwCheckBox.addEventListener('click', () => {
    if(mwCheckBox.checked) {
        localStorage.setItem('matchWholeWord', 'true');
    } else {
        localStorage.setItem('matchWholeWord', 'false');
    }
});

jsonCheckBox.addEventListener('click', () => {
    if(jsonCheckBox.checked) {
        localStorage.setItem('outputInJSON', 'json');
    } else {
        localStorage.setItem('outputInJSON', 'html');
    }
});

settingsClose.addEventListener('click', () => {
    $('.wrapper').toggleClass('blurred');
    $('.settings').toggleClass('hidden');
});

mwExplanationBtn.addEventListener('click', () => {
    if($(mwExplanation).height() == 0) {
        $(mwExplanation).animate({height: 65}, 200);
    } else {
        $(mwExplanation).animate({height: 0}, 200);
    }
});