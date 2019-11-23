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

        //Take object and turns it into querystring then takes you to the loin page if the data is valid using the isnonNegInt function. Also uses flag validator above to ensure that quantities are greater than zero. If data is not valid server redirects you to errors page.

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

//Get already existing registration data from JSON file and turn it into and object

app.use(myParser.urlencoded({ extended: true }));
if (fs.existsSync(filename)) {

    //Checks to see if file exists. Goes to check and returns boolean true if path exists or false. Use sync so that it doesnt go off and do the next thing before doing what you need to do.

    stats = fs.statSync(filename);

    //Allows you to get certain information about your file.
    console.log(filename);

    data = fs.readFileSync(filename, 'utf-8');
    //readFileSync reads file, waits till its read, returns back with stuff in file and then continues with code. (Blocking function) Set what you get back to data.

    //Reads file and saved it as a string.

    users_reg_data = JSON.parse(data);
    //Takes string and converts it into an object.

    console.log(users_reg_data);
    //As long as usernames are identifiers you can use dot notation. Has to follow identifier rules
} else {
    console.log(filename + 'does not exist!');
}


//When you hit the login button you want to validate data, if good send to custome invoice

app.post("/LoginForm", function (request, response) {
    // Process login form POST and redirect to custom invoice page if ok, back to login page if not
    console.log(request.body, "worked");
    var qstring = querystring.stringify(request.query);
    //Diagnostic
    the_username = request.body.username;
    console.log(the_username, "Username is", typeof (users_reg_data[the_username]));

    //Validate login data
    if (typeof users_reg_data[the_username] != 'undefined') {
        //Asking object if it has matching username, if it doesnt itll be undefined.
        if (users_reg_data[the_username].password == request.body.password) {
            //Diagnostic
            console.log("Successful login", request.query);
            //If login is vaild save name and data and send to invoice to make custom invoice, string is getting lost

            //Redirect them to invoice here if they logged in correctly
            //How do I take name from query and input into invoice???
            request.query.InvoiceName = users_reg_data[the_username].name;
            qstring = querystring.stringify(request.query);
            response.redirect("invoice.html?" + qstring);
        }
        error = "Invalid Password";
    }
    else {
        error = the_username + " Username does not exist";

    }
    //Give you error message alert if password or username is flawed.
    request.query.LoginError = error;
    qstring = querystring.stringify(request.query);
    response.redirect("login.html?" + qstring);
});



//Validates data in registration form and send you to success page if data is valid, if not it sends you back to register page with errors

app.post("/register", function (request, response) {
    let INFO = request.body
    username = INFO.Username;
    //Used to store errors
    reg_errors = {};

    //Validate registration data
    console.log(INFO, "This is the info");

    //Validate Username

    if (typeof users_reg_data[username] != 'undefined') {
        reg_errors.UserTaken = "Username is taken";
    }

    if (users_reg_data[username].length > 10){
        reg_errors.User = "Username to long";
    }

    if (users_reg_data[username].length < 4){
        reg_errors.User = "Username to short";
    }

    //string.toLowerCase()


    

    //Validate Name input
    if (INFO.Name.length > 30); {
        reg_errors.NameToLong = "Name Exceeds 30 Character Limit";
    }
    if (hasNumber(INFO.Name)) {
        reg_errors.NameWithNumbers = "Name Cannot Contain Numbers";
    }

    //Validate Pass input
    if (INFO.Pass); {

    }

    if (INFO.ConfirmPass != INFO.Pass) {
        reg_errors.ConfirmPass="Passwords Don't Match";
    };

    //Diagnostic
    if (reg_errors != "Undefined") {
        response.alert(reg_errors);
    };

    console.log(reg_errors);

    //Turn form values into an object
    if (reg_errors.length == 0) {
        users_reg_data[username] = {};
        users_reg_data[username].name = INFO.Name;
        users_reg_data[username].password = INFO.Pass;
        users_reg_data[username].email = INFO.Email;
        console.log(users_reg_data[username]);

        fs.writeFileSync(filename, JSON.stringify(users_reg_data));

        console.log(users_reg_data, "Yippy");
        response.send(`registered`);
    };



    console.log("From Register", request.query);
    isvaliddata = true;

    //If valid save registration data and send to invoice 
    if (isvaliddata) {
        var qstring = querystring.stringify(request.query);

        response.redirect("success.html?" + qstring);
    } else {
        response.redirect("register.html?" + qstring);
    }
    //If invlaid send to registration with error messages
});






//Takes you from successful registration page to invoice
//May not need anything but redirect
app.post("/success", function (request, response) {
    let POST = request.body;
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






//Sets up HTML page, takes a get request and looks for that path in the public directory basically allowing you to use whats in the public directory and sets the server to listen for requests on 8080.

app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));

//JSON DATA: You get all these properties that are usernames stored with all the information that corresponds with the username, convienent for saving and using user info. Dont need to search, just ask for username and have acess to all data, easy to add new object. Data stored as text in a file. Load it in and turn it into a JSON object that js can use. 
//Login processing has to be done on server because the server is the only one that can read the file
//GET user and pass from form, check to see if it exists, if it does get password, then check to see that it matches password you entered. 


