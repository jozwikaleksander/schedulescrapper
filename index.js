// INCLUDING LIBRARIES
const cheerio = require('cheerio');
const request = require('request-promise');
const express = require('express'); //Import the express dependency
const { Tabletojson } = require('tabletojson');
const app = express();              //Instantiate an express app, the main work horse of this server
const port = 5000;                  //Save the port number where your server will be listening

const tabletojson = new require('tabletojson').Tabletojson;


//Idiomatic expression in express to route and respond to a client request
app.get('/', (req, res) => {        //get requests to the root ("/") will route here
    let tableContent = {}; 
    let url = "https://plan.elektronik.edu.pl/plany/o31.html"; 
    request(url, function(error, response, html) {
        // First we'll check to make sure no errors occurred when making the request
        if (!error) {
          // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
          var $ = cheerio.load(html);

          var table ="<table>"+$('table.tabela').html()+"</table>";

          res.send(tabletojson(table));
        }
    });
});

app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`); 
});

module.exports = app;

// Parse HTML table element to JSON array of objects
function parseHTMLTableElem( tableEl, expectingHeaderRow ) {
	var columns = Array.from( tableEl.querySelectorAll( 'th' ) ).map( it => it.textContent );
	var rows = Array.from( tableEl.querySelectorAll( 'tbody > tr' ) );
	// must check for table that has no th cells, but only if we are told to "expectingHeaderRow"
	if ( columns.length == 0 && expectingHeaderRow ) {
		// get columns for a non-th'd table
		columns = Array.from( tableEl.querySelectorAll( 'tbody > tr' )[ 0 ].children ).map( it => it.textContent )
		// must remove first row as it is the header
		rows.shift();
	}
}