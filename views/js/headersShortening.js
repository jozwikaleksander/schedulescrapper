$(window).on('resize', function() {
    let headersShortened = {
        'Nr':'Nr',
        'Godz:':'Godz',
        'Poniedziałek': 'Pon',
        'Wtorek': 'Wt',
        'Środa': 'Śr',
        'Czwartek': 'Czw',
        'Piątek': 'Pt'
    }
    if($(window).width() < 768) {
        
    
        let headers = $('th');
    
        for (let i = 0; i < headers.length; i++) {
            if (headersShortened[headers[i].innerText] != undefined) {
                headers[i].innerText = headersShortened[headers[i].innerText];
            }
        }
    } else{
        let headers = $('th');
    
        for (let i = 0; i < headers.length; i++) {
            headers[i].innerText = Object.keys(headersShortened)[i];
        }
    }
});