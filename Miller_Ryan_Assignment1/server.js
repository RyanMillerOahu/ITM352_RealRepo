var express = require('express');
var myParser = require("body-parser");
//Get info from JSON file and check if it worked
var products_array = require("./public/Product_info");
console.log(typeof products_array);
//Allows us to use the tools and kits within express
var app = express();
//Needed for query string use in other functions
var querystring = require("querystring");

//Turns complicated HTML page into easy to read data, links server so that it can recieve requests from index page

app.use(myParser.urlencoded({ extended: true }));
app.post("/purchase", function (request, response) {
   let POST = request.body;
   console.log(POST)

//Asking to see if submit button was pressed
   if (typeof POST['submit'] != 'undefined') {
       //Check and validate data here
       isvaliddata = true;
       selections = false;
       for (i = 0; i < products_array.length; i++){
        product_name = products_array[i].package; 
         isvaliddata = isvaliddata && (isNonNegInt( POST[product_name] ));
         selections = selections || (POST[product_name] > 0);
        }

        //Take object and turns it into querystring then takes you to the invoice page if the data is valid using the isnonNegInt function. Also uses flag validator above to ensure that quantities are greater than zero. If data is not valid server redirects you to errors page.

        if(isvaliddata && selections) { 
            var qstring = querystring.stringify(POST); 

        response.redirect("invoice.html?"+qstring);
        } else {
            response.redirect("errors.html");
        }
} 
});

//Sets up HTML page, takes a get request and looks for that path in the public directory basically allowing you to use whats in the public directory and sets the server to listen for requests on 8080.

app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));

//Main data validator function (Borrowered from in class lab with Port)

function isNonNegInt(q, return_errors = false) {
    errors = []; // assume no errors at first
    if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
    return return_errors ? errors : (errors.length == 0);
}

