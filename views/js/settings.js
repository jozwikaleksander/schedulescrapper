const settingsBtn = document.querySelector('.settings-btn');
const settingsClose = document.querySelector('.settings-submit');
const settingsCheckBox = document.querySelector('#mw');
const settingsExplanation = document.querySelector('.mw-explanation');
const mwExplanationBtn = document.querySelector('.mw-explanation-btn');

$(settingsExplanation).height(0);

if(localStorage.getItem('matchWholeWord') == 'true'){
    settingsCheckBox.checked = true;
}

settingsBtn.addEventListener('click', () => {
    $('.wrapper').toggleClass('blurred');
    $('.settings').toggleClass('hidden');
});

settingsCheckBox.addEventListener('click', () => {
    if(settingsCheckBox.checked) {
        localStorage.setItem('matchWholeWord', 'true');
    } else {
        localStorage.setItem('matchWholeWord', 'false');
    }
});

settingsClose.addEventListener('click', () => {
    $('.wrapper').toggleClass('blurred');
    $('.settings').toggleClass('hidden');
});

mwExplanationBtn.addEventListener('click', () => {
    if($(settingsExplanation).height() == 0) {
        $(settingsExplanation).animate({height: 65}, 200);
    } else {
        $(settingsExplanation).animate({height: 0}, 200);
    }
});