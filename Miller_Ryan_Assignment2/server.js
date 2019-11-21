var express = require('express');
var myParser = require("body-parser");

//Get info from JSON file and check if it worked
var products_array = require("./public/Product_info");
console.log(typeof products_array);

//Allows us to use the tools and kits within express
var app = express();

//Needed for query string use in other functions
var querystring = require("querystring");
fs = require('fs');
var filename = 'user_data.json';
//Better to use variable because its more flexible for when things change

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
        for (i = 0; i < products_array.length; i++) {
            product_name = products_array[i].package;
            isvaliddata = isvaliddata && (isNonNegInt(POST[product_name]));
            selections = selections || (POST[product_name] > 0);
        }

        //Take object and turns it into querystring then takes you to the invoice page if the data is valid using the isnonNegInt function. Also uses flag validator above to ensure that quantities are greater than zero. If data is not valid server redirects you to errors page.

        if (isvaliddata && selections) {
            var qstring = querystring.stringify(POST);

            response.redirect("login.html?" + qstring);
        } else {
            response.redirect("errors.html");
        }
    }
});

//Sets up HTML page, takes a get request and looks for that path in the public directory basically allowing you to use whats in the public directory and sets the server to listen for requests on 8080.



//Main data validator function (Borrowered from in class lab with Port)

function isNonNegInt(q, return_errors = false) {
    errors = []; // assume no errors at first
    if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
    return return_errors ? errors : (errors.length == 0);
}

//Validates data in registration form and send you to success page if data is valid, if not it sends you back to register page
app.post("/register", function (request, response) {
    let POST = request.body
    //Validate registration data

    console.log("From Register", request.query);
isvaliddata = true;

    //If valid save registration data and send to invoice 
    if (isvaliddata) {
        var qstring = querystring.stringify(request.query);

        response.redirect("success.html?" + qstring);
    } else {
        response.redirect("register.html?" + qstring);
    }
    //If invlaid send to registration
});

//Takes you from successful registration page to invoice
app.post("/success", function (request, response) {
    let POST = request.body
    //Validate registration data

    console.log("From Success", request.query);
isvaliddata = true;

    //If valid save registration data and send to invoice 
    if (isvaliddata) {
        var qstring = querystring.stringify(request.query);

        response.redirect("invoice.html?" + qstring);
    } else {
        response.redirect("register.html?" + qstring);
    }
    //If invlaid send to registration
});

app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));

/*

//Login Validation Attempt

app.use(myParser.urlencoded({ extended: true }));

if (fs.existsSync(filename)){
//Checks to see if file exists. Goes to check and returns boolean true if path exists or false. Use sync so that it doesnt go off and do the next thing before doing what you need to do.

stats = fs.statSync(filename);
//Allows you to get certain information about your file.

console.log(filename + ' has ' + stats.size + ' characters');

data = fs.readFileSync(filename, 'utf-8');
//Asynchronous by nature, once you call it it goes off and runs on its own. readFileSync reads file, waits till its read, returns back with stuff in file and then continues with code. (Blocking function) Set what you get back to data.

console.log(typeof data);
//Read file and saved it as a string.

users_reg_data = JSON.parse(data);
//Takes string and converts it into an object.

console.log(users_reg_data);
//As long as usernames are identifiers you can use dot notation. Has to follow identifier rules
} else {
    console.log(filename + ' does not exist!');
}

//When we get here we want to have the user registration data already 
//If server gets a GET request to login it will get this code. 

app.get("/login", function (request, response) {
    // Give a simple login form
    str = `
<body>
<form action="" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
 });

app.post("/login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    console.log(request.body);
    //Diagnostic
    the_username = request.body.username;
    if (typeof users_reg_data[the_username] != 'undefined') {
        //Asking object if it has matching username, if it doesnt itll be undefined.
        if (users_reg_data[the_username].password == request.body.password) {
            response.send(the_username + " Logged In!");
            //Redirect them to invoice here if they logged in correctly
        } else {
response.redirect('/login');
        }
        //See's if password matches what was typed
    }
});

app.listen(8080, () => console.log(`listening on port 8080`));

//JSON DATA: You get all these properties that are usernames stored with all the information that corresponds with the username, convienent for saving and using user info. Dont need to search, just ask for username and have acess to all data, easy to add new object. Data stored as text in a file. Load it in and turn it into a JSON object that js can use. 
//Login processing has to be done on server because the server is the only one that can read the file
//GET user and pass from form, check to see if it exists, if it does get password, then check to see that it matches password you entered. 

*/
