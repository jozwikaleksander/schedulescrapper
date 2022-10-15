// INCLUDING LIBRARIES
const cheerio = require('cheerio');
const request = require('request-promise');
const express = require('express');
const { Tabletojson } = require('tabletojson');
var favicon = require('serve-favicon');
const ejs = require('ejs');
ejs.delimiter = '/';
ejs.openDelimiter = '[';
ejs.closeDelimiter = ']';

// Scripts
const getCurrentLesson = require('./currentLesson.js');
const getEveryLesson = require('./getEveryLesson.js');

// App configuration
const app = express();
const port = 5000;
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/views'));
app.use(favicon(__dirname + '/favicon.ico'));

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
    let matchWholeWord = req.query.m;

    // If the query was sent by the user
    if(queryType != undefined && validateURLAndName(url,name)){
      // If the name was sent (meaning the URL has to be found)
      if(name != undefined && url.slice(-1) != "l"){
        request(url+'/lista.html', (error, response, html) => {
          if(!error){
            const $ = cheerio.load(html);
            let data = [];
            data = $('a').map(function(i, el) {
              return $(this).attr('href')+','+$(this).text();
            }).get();

            let result;
            // TODO: Option to match the whole word
            if(matchWholeWord == "true"){
              result = data.filter((item) => {
                let itemArray = item.toLowerCase().split(',');
                if(itemArray[1].replace('.','') == name.toLowerCase()){
                    return item.split(',');
                }
              });
            }
            else{
              result = data.filter((item) => {
                let itemArray = item.toLowerCase().split(',');
                if(itemArray[1].includes(name.toLowerCase())){
                    return item.split(',');
                }
              })
            }
            
            console.log(result);
            // if object was found
            if(result.length == 1){
              name = result[0].split(',')[1];
              console.log('Nazwa: '+name);
              result = result[0].split(',')[0];
              if(queryType=='schedule'){
                res.redirect('/?'+'q='+queryType+'&url='+url+result+'&r='+responseType);
              }
              else if(queryType=='currentLesson'){
                res.redirect('/?'+'q='+queryType+'&url='+url+result+'&t='+time+'&d='+day+"&n="+name+'&r='+responseType);
              }
              else if(queryType=='everyLesson' && (day != "" || day != undefined)){
                res.redirect('/?'+'q='+queryType+'&url='+url+result+"&d="+day+"&n="+name+'&r='+responseType);
              }
            }
            else if(result.length > 1){
              res.render('moreThanOne', {resValue:result, url:url, queryType:queryType, time:time, day:day, name:name, responseType:responseType});
            }
            // if not report an error
            else{
              res.render('home', {error: 'Nie znaleziono obiektu'});
            }
          }
        });
      } else if(validateURLAndName(url,name)){ // If the name wasn't provided check if URL and name are valid
        // If the URL was sent (meaning the URL links to the file)
        request(url, function(error, response, html) {
          if (!error) {
            let data = getTable(html);
            // Response variable
            let resValue;
            
            // Check if data is not empty
            if(data!=undefined){
              // Checking the query type
              if(queryType=="schedule"){ // If the query type is schedule
                // Sending the schedule data
                resValue = data;
              }
              else if(queryType=="currentLesson"){ // If the query type is currentLesson
                // Getting current lesson with provided information
                resValue = getCurrentLesson(data,time,day);
              }
              else if(queryType=='everyLesson'){ // If the query type is everyLesson
                resValue = getEveryLesson(data,day);
              }
              if(responseType=="json"){ // If the response type is JSON
                res.render('empty',{resValue:resValue});
              } else{
                res.render(queryType,{resValue:resValue, objName: name, dayName: getDayName(day)});
              }
            } else{
              res.render('home', {error: 'Nie znaleziono obiektu'});
            }
          }
        });
      }
    }
    else if (url == undefined && name == undefined){
      // If not send the main page
      res.render('home', {error: ''});
    }
    else{
      res.render('home',{error:'Podaj nazwę obiektu'});
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});

// Scrapping table from the HTML
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
// Returns the day name based on the provided index number
const getDayName = (day) =>{
  let dayName = '';
  let days = ['poniedziałek','wtorek','środa','czwartek','piątek','sobota','niedziela'];
  if(day != undefined){
    dayName = days[day-1];
  }
  return dayName;
}
// Validates the URL and name variable
// Checks if the URL ands with .html or htm and if the name is empty
const validateURLAndName = (url,name) =>{
  if((url.slice(-1) != "l") && name==undefined ){
    return false;
  }
  return true;
}
module.exports = app;