var express = require('express');
var myParser = require("body-parser");
var products_array = require("./public/Product_info");
console.log(typeof products_array);
var app = express();

//Turns complicated HTML page into easy to read data

app.use(myParser.urlencoded({ extended: true }));
app.post("/purchase", function (request, response) {
   let POST = request.body;
   console.log(POST)

//asking to see if submit button was pressed
   if (typeof POST['submit'] != 'undefined') {
       //check and validate here
       isvaliddata = true;
       for (i = 0; i < products_array.length; i++){
        product_name = products_array[i].package; 
         isvaliddata = isvaliddata && (isNonNegInt( POST[product_name] ));
        }
        
        if(isvaliddata) { 
    DisplayPurchase(POST, response);
        } else {
           response.send("Data is invalid, ensure that every quantity box is filled with a positive interger. <br> Press back button and input proper data.");
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

function DisplayPurchase(quantities, response) {
    inv_str = '';
    
    for (i = 0; i < products_array.length; i++){
    quantities_array = [];
    product_name = products_array[i].package; 
    product_price = products_array[i].price; 
        inv_str += `You want ${quantities[product_name]} ${product_name} packages at price of $${products_array[i].price} each. This equates to $${quantities[product_name]*product_price}<br>`;
         quantities_array.push(quantities[product_name])
    }
    response.send(inv_str);
}