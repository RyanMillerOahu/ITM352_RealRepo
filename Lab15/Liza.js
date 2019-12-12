// requires fs to use file sync
fs = require('fs');

// starts server with express and parser
var express = require('express');
var app = express();

// when method is POST the data requests the body because it is hidden in a data stream
var myParser = require("body-parser");

// middleware when a request is made and there's a cookie
// the cookie-parser reads it and converts it into an object
var cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(myParser.urlencoded({ extended: true }));

// assign to variable to make it flexible
var filename = 'user_data.json';

// makes sure file exists before loading it in
// if exists, read it
if (fs.existsSync(filename)) {

    // stat gives a bunch of stats of data
    stats = fs.statSync(filename);
    // size tells how many characters
    console.log(filename + ' has ' + stats.size + ' characters');

    // open and read filename
    // blocking function (synchronously): function will be done before any other code is executed
    // utf-8 encoding format
    // assign it to data
    data = fs.readFileSync(filename, 'utf-8');

    // converts data into an object
    users_reg_data = JSON.parse(data)

    // outputs object to console (dumps all the users_reg_data into console)
    console.log(users_reg_data);
} else {
    // give alert if file does not exist
    console.log(filename + 'does not exist!');
}

app.use(cookieParser());

app.get('/set_cookie', function (request, response) {
    response.cookie('myname', "Ryan Miller", ({maxAge: 5*1000}.send), ('cookie set'));
});

// respond if there is a cookie
app.get('/use_cookie', function (request, response) {
    output = "No cookie with myname";
    if (typeof request.cookies.myname != 'undefined') {
        output = `Welcome to the Use Cookie page ${request.cookies}`
    }
    response.send(output);
});

// if server gets a GET request to login executes login form
// form makes a login page
// goes to localhost:8080/login because that's the path we assigned it to
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

// if server gets a POST request to login
app.post("/login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    console.log(request.body);
    // assigns username of body to a function
    the_username = request.body.username;
    // if username given is not undefined (checks if it exists)
    if (typeof users_reg_data[the_username] != 'undefined') {
        // then get the password from json data, and check if it the same as password entered
        if (users_reg_data[the_username].password == request.body.password) {
            // if passwords match, sends this message

            // use redirect to redirect them to invoice instead in Assignment 2
            // Assignment 2: greet them by saying like "Hi" + the_username + "! Welcome back!"
            response.send(the_username + ' logged in');
            localStorage['the_username'] = username.value;
        } else {
            // get request to that
            // for assignment 2 you can add an alert like "Please try again, username or password does not match."
            // can make it sticky by adding their username back in so they don't have to retype it
            // can also regenrate page by making the form a function then push an error message into that
            response.redirect('/login');
        }
    }
});

// gets /register to make a form for users to register a username
app.get("/register", function (request, response) {
    // Give a simple register form
    // for assignment 2 add a box for full name
    str = `
<body>
<form action="" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="password" name="repeat_password" size="40" placeholder="enter password again"><br />
<input type="email" name="email" size="40" placeholder="enter email"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
});

app.post("/register", function (request, response) {
    // process a simple register form

    // validate registartion data

    // when its all good save the new user
    // gets username inputted in the form
    username = request.body.username;

    // check if password entered matches password from array
    if (typeof users_reg_data[username] != 'undefined') {
        response.redirect('/login'); // redirected to login if does not match
    } else if (request.body.repeat_password != request.body.password) {
        response.redirect('/register');
        localStorage['username'] = username.value;
    } else {
        // empty object makes newuser a property of the array
        users_reg_data[username] = {};
        // password and email values
        users_reg_data[username].password = request.body.password;
        users_reg_data[username].email = request.body.email;

        // adds the submitted form data to users_reg_data then saves this updated object to user_data.json
        fs.writeFileSync(filename, JSON.stringify(users_reg_data));

        // for assignment 2 send them to the invoice with the quanitity data and the username
        response.send(`${username} registered!`)
    }

    console.log(request.body);


});

// listen on localhost 8080
app.listen(8080, () => console.log(`listening on port 8080`));