// INCLUDING LIBRARIES
const cheerio = require('cheerio');
const request = require('request-promise');
const express = require('express');
const { Tabletojson } = require('tabletojson');
const currentLessonScript = require('./currentLesson.js');
var favicon = require('serve-favicon');
const ejs = require('ejs');
ejs.delimiter = '/';
ejs.openDelimiter = '[';
ejs.closeDelimiter = ']';

// App configuration
const app = express();
const port = 5000;
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/views'));
app.use(favicon(__dirname + '/views/img/favicon.ico'));

// Creating TableToJSON object
const tabletojson = new require('tabletojson').Tabletojson;

// Creating a GET route
app.get('/', (req, res) => {
    // Accessing the URL variables
    let responseType = req.query.r;
    let queryType = req.query.q;
    let url = req.query.url;
    let time = req.query.t;
    let day = req.query.d;
    let name = req.query.n;

    console.log(day);

    if(queryType != undefined){
      if(name != undefined){
        request(url+'/lista.html', (error, response, html) => {
          if(!error){
            const $ = cheerio.load(html);
            let data = [];
            data = $('a').map(function(i, el) {
              return $(this).attr('href')+','+$(this).text();
            }).get();

            let result;

            console.log(name);

            result = data.filter((item) => {
              if(item.toLowerCase().includes(name.toLowerCase())){
                  return item.split(',');
              }
            })
            if(result.length > 0){
              result = result[0].split(',')[0];
              console.log(result);
              if(queryType=='schedule'){
                res.redirect('/?'+'q='+queryType+'&url='+url+"/"+result);
              }
              else if(queryType=='currentLesson'){
                res.redirect('/?'+'q='+queryType+'&url='+url+"/"+result+'&t='+time+'&d='+day);
              }
              
            }
          }
        });
      } else{
        request(url, function(error, response, html) {
          if (!error) {
            let data = getTable(html);
            // Response variable
            let resValue;
      
            // Checking the query type
            if(queryType=="schedule"){ // If the query type is schedule
              // Sending the schedule data
              resValue = data;
            }
            else if(queryType=="currentLesson"){ // If the query type is currentLesson
              // Getting current lesson with provided information
              resValue = currentLessonScript.getCurrentLesson(data,time,day);
            }
            if(responseType=="json"){ // If the response type is JSON
              res.render('empty',{resValue:resValue});
            } else{
              res.render(queryType,{resValue:resValue});
            }
          }
        });
      }
    }
    else{
      res.render('home');
    }
});

// Listening on port 5000
app.listen(port, () => {
    console.log(`Now listening on port ${port}`); 
});

const getTable = (html) =>{
  let $ = cheerio.load(html);
  // Finding the table with the schedule
  let table ="<table>"+$('table.tabela').html()+"</table>";
  // Replacing <br> tags with new lines
  table = table.replace(/<br\s*[\/]?>/gi, "\n");
  // Converting the HTML table to JSON
  let data = tabletojson.convert(table);

  return data;
}

module.exports = app;