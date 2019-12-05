//RYAN MILLER
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

//Turns complicated HTML page into easy to read data, links server so that it can recieve requests from index page

app.use(myParser.urlencoded({ extended: true }));
app.post("/purchase", function (request, response) {
    let POST = request.body;
    //Diagnostic
    console.log(POST);

    //Asking to see if submit button was pressed
    if (typeof POST['submit'] != 'undefined') {
        //Check and validate data here
        isvaliddata = true;
        selections = false;

        for (i = 0; i < products_array.length; i++) {
            //Each quantity box is named after a package so find each package name to access each text box.
            product_name = products_array[i].package;
            //Run validation using isNonNegInt on each quantity box
            isvaliddata = isvaliddata && (isNonNegInt(POST[product_name]));
            //Ensure custor orders something
            selections = selections || (POST[product_name] > 0);
        }

        //Take object and turns it into querystring then takes you to the loin page if the data is valid using the isnonNegInt function. Also uses flag validator above to ensure that quantities are greater than zero. If data is not valid server redirects you to invoice page with error messages and sticky quantities.

        if (isvaliddata && selections) {
            var qstring = querystring.stringify(POST);

            response.redirect("login.html?" + qstring);
        } else {
            BadEntry = "You input erronious quantities or didnt order something, try again."
            request.query.ErrorAlert = BadEntry;
            qstring = querystring.stringify(POST);
            Errorstring = querystring.stringify(request.query);

            //Input errors into new registration URL query so they can be used to display errors
            response.redirect("index.html?" + qstring + "&&" + Errorstring);
        }
    }
});


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
    //Diagnostic
    console.log(filename + 'does not exist!');
}

//When you hit the login button you want to validate data, if good send to custom invoice
app.post("/LoginForm", function (request, response) {
    // Process login form POST and redirect to custom invoice page if ok, back to login page if not
    console.log(request.body, "worked");
    var qstring = querystring.stringify(request.query);
    //Makes username case insensitive
    the_username = request.body.username.toLowerCase();
    //Diagnostic
    console.log(the_username, "Username is", typeof (users_reg_data[the_username]));

    //Validate login data
    if (typeof users_reg_data[the_username] != 'undefined') {
        //Asking object if it has matching username, if it doesnt itll be undefined.
        //If username is define ask for matching password
        if (users_reg_data[the_username].password == request.body.password) {
            //Diagnostic
            console.log("Successful login", request.query);
            //If login is vaild save name and data and send to invoice to make custom invoice
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
    //Used to make login sticky so you dont have to retype it everytime you get the password wrong
    request.query.StickyLoginUser = the_username;
    qstring = querystring.stringify(request.query);
    response.redirect("login.html?" + qstring);

});

//Validates data in registration form and sends you to success page if data is valid, if not it sends you back to register page with errors

app.post("/register", function (request, response) {
    let INFO = request.body;
    //Makes the username case-insensitive
    username = INFO.Username.toLowerCase();

    // Diagnostic
    console.log(request.query.user_errors);
    //Used to store errors, gonna put the errors in a string that gets loaded when you redirect back to registration page
    //Also resests Errors in string so them dont carry over if user messes up multiple times
    user_errors = {};
    name_errors = {};
    pass_errors = {};
    confirm_pass_errors = {};
    email_errors = {};

    //Create error flag
    haserrors = false;

    //Validate registration data
    console.log(INFO, "This is the info");

    //Validate Username
    if (typeof users_reg_data[username] != 'undefined') {
        user_errors.UsernameError = "Taken";
        haserrors = true;
    }
    if (/[^a-zA-Z0-9]/.test(username)) {
        user_errors.UsernameError = "Alpha-Numeric only, No spaces";
        haserrors = true;
    }
    if (username.length > 10) {
        user_errors.UsernameError = "User to long";
        haserrors = true;
    }
    if (username.length < 4) {
        user_errors.UsernameError = " User to short";
        haserrors = true;
    }
    if (username.length < 1) {
        user_errors.UsernameError = "Do not leave empty";
        haserrors = true;
    }

    //Validate Name input
    if (/[^a-zA-Z" "]/.test(INFO.Name)) {
        name_errors.NameError = "Letters Only";
        haserrors = true;
    }
    if (INFO.Name.length > 30) {
        name_errors.NameError = "Exceeds 30 character limit";
        haserrors = true;
    }
    if (INFO.Name.length < 1) {
        name_errors.NameError = "Do not leave empty";
        haserrors = true;
    }

    //Validate Password and Confirm Password input
    if (INFO.Pass.length < 6) {
        pass_errors.PassError = "Pass to short";
        haserrors = true;
    }
    if (INFO.Pass.length < 1) {
        pass_errors.PassError = "Do not leave empty";
        haserrors = true;
    }
    if (INFO.ConfirmPass != INFO.Pass) {
        confirm_pass_errors.ConfirmPassError = "Passwords don't match";
        haserrors = true;
    }
    if (INFO.ConfirmPass.length < 1) {
        confirm_pass_errors.ConfirmPassError = "Do not leave empty";
        haserrors = true;
    }

    //Validate Email Input (Taken from https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript)
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(INFO.Email)) {
    } else {
        email_errors.EmailError = "Invalid email address";
        haserrors = true;
    }
    if (INFO.Email.length < 1) {
        email_errors.EmailError = "Do not leave empty";
        haserrors = true;
    }

    //Turn errors object into strings so they can be input to URL.
    user_errors_string = JSON.stringify(user_errors.UsernameError);
    name_errors_string = JSON.stringify(name_errors.NameError);
    pass_errors_string = JSON.stringify(pass_errors.PassError);
    confirm_pass_errors_string = JSON.stringify(confirm_pass_errors.ConfirmPassError);
    email_errors_string = JSON.stringify(email_errors.EmailError);


    //If valid turn form values into an object that is saved and stored in JSON file
    //Activate error flag
    if (haserrors == false) {
        users_reg_data[username] = {};
        users_reg_data[username].name = INFO.Name;
        users_reg_data[username].password = INFO.Pass;
        users_reg_data[username].email = INFO.Email;
        console.log(users_reg_data[username]);

        fs.writeFileSync(filename, JSON.stringify(users_reg_data));

        var qstring = querystring.stringify(request.query);

        console.log(users_reg_data, "Yippy");
        //Takes you to invoice after registration data has been validated (Includes security tag)
        request.query.InvoiceName = INFO.Name;
        //Inputs command to display successful registration before moving to invoice page.
        request.query.SuccessfulReg = "Registration / Login Successful!";
        qstring = querystring.stringify(request.query);

        response.redirect("invoice.html?" + qstring);

    } else {
        //If not valid add Errors string to query so they can be displayed on page
        request.query.StickyUser = INFO.Username;
        request.query.StickyName = INFO.Name;
        request.query.StickyEmail = INFO.Email;
        request.query.user_errors = user_errors_string;
        request.query.name_errors = name_errors_string;
        request.query.pass_errors = pass_errors_string;
        request.query.confirm_pass_errors = confirm_pass_errors_string;
        request.query.email_errors = email_errors_string;

        qstring = querystring.stringify(request.query);


        //Input errors into new registration URL query so they can be used to display errors
        response.redirect("/registration.html?" + qstring);
        //response.send(reg_errors);
    }
});

//Sets up HTML page, takes a get request and looks for that path in the public directory basically allowing you to use whats in the public directory and sets the server to listen for requests on 8080.

app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));

//JSON DATA: You get all these properties that are usernames stored with all the information that corresponds with the username, convienent for saving and using user info. Dont need to search, just ask for username and have acess to all data, easy to add new object. Data stored as text in a file. Load it in and turn it into a JSON object that js can use. 

