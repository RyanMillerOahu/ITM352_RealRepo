var express = require('express');
var myParser = require("body-parser");
var products_array = require("./public/Product_info");
console.log(typeof products_array);
var app = express();
var querystring = require("querystring");

//Turns complicated HTML page into easy to read data

app.use(myParser.urlencoded({ extended: true }));
app.post("/purchase", function (request, response) {
   let POST = request.body;
   console.log(POST)

//asking to see if submit button was pressed
   if (typeof POST['submit'] != 'undefined') {
       //check and validate here
       isvaliddata = true;
       selections = false;
       for (i = 0; i < products_array.length; i++){
        product_name = products_array[i].package; 
         isvaliddata = isvaliddata && (isNonNegInt( POST[product_name] ));
         selections = selections || (POST[product_name] > 0);
        }
        //take object turns into querystring then takes you to the invoice page if the data is valid. Uses flag to see if quantities are greater than zero
        if(isvaliddata && selections) { 
            var qstring = querystring.stringify(POST); 

        response.redirect("invoice.html?"+qstring);
        } else {
            response.redirect("errors.html");
            //response.send("You've got errors");
        }
} 
});

//Sets up HTML page, takes a get request and looks for that path in the public directory

app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));

function isNonNegInt(q, return_errors = false) {
    errors = []; // assume no errors at first
    if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
    return return_errors ? errors : (errors.length == 0);
}

