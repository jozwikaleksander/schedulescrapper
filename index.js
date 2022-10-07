// INCLUDING LIBRARIES
const cheerio = require('cheerio');
const request = require('request-promise');
const express = require('express');
const { Tabletojson } = require('tabletojson');
const app = express();
const port = 5000;

const tabletojson = new require('tabletojson').Tabletojson;

app.get('/', (req, res) => {
    let queryType = req.query.q
    let url = req.query.url

    let tableContent = {};  
    request(url, function(error, response, html) {
        if (!error) {
          // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
          let $ = cheerio.load(html);

          let table ="<table>"+$('table.tabela').html()+"</table>";
          table = table.replace(/<br\s*[\/]?>/gi, "\n");
          let data = tabletojson.convert(table,{stripHtmlFromCells: true})

          if(queryType=="schedule"){
            res.send(data);
          }
          else if(queryType=="currentLesson"){
            let response = ""
            let date = new Date()
            let days = ["Poniedziałek, Wtorek, Środa, Czwartek, Piątek"]
            let day = days[date.getDay()-1];
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let timeInMinutes = (hours*60) + minutes;
            let currentLesson = 0

            for(let i = 0; i < data[0].length; i++){
                let lesson = data[0][i]["Godz"];
                if(lesson){
                    lesson = lesson.split("- "); 
                    response += `Lekcja ${lesson}`
                    response += `Lekcja ${lesson}`
                    // let a = ((parseInt(lesson[0].split(":")[0]))* 60)+parseInt(lesson[0].split(":")[1]);
                    // response += a+"\n";
                    // let b = ((parseInt(lesson[1].split(":")[0]))* 60)+parseInt(lesson[1].split(":")[1]);
                    // response += b;
                    // if(a < timeInMinutes && b > timeInMinutes){
                    //     currentLesson = i;
                    //     break;
                    // }
                }
            }
            response += `Current lesson index: ${currentLesson}`

            res.send(response);
          }
        }
    });
});

app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`); 
});

module.exports = app;