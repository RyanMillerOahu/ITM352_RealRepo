//RYAN MILLER ASSIGNMENT 4
var express = require('express');
//Allows us to use the tools and kits within express
var app = express();
var myParser = require("body-parser");
var cookieParser = require('cookie-parser');

app.all("*", function (request, response, next) {
    console.log(request.method, request.path);
    next();
});
app.use(cookieParser());

//Needed for query string use in other functions
var querystring = require("querystring");

//Get info from JSON and js files and check if it worked
fs = require('fs');
var user_data_filename = 'user_data.json';


//Turns complicated HTML page into easy to read data, links server so that it can recieve requests from index page
app.use(myParser.urlencoded({ extended: true }));

//Check to see if files exist
if (fs.existsSync(user_data_filename)) {

    //Checks to see if file exists. Goes to check and returns boolean true if path exists or false. Use sync so that it doesnt go off and do the next thing before doing what you need to do.

    //Allows you to get certain information about your file.
    console.log(user_data_filename);

    data = fs.readFileSync(user_data_filename, 'utf-8');
    //readFileSync reads file, waits till its read, returns back with stuff in file and then continues with code. (Blocking function) Set what you get back to data.

    //Reads file and saved it as a string.

    users_reg_data = JSON.parse(data);
    //Takes string and converts it into an object.

    console.log(users_reg_data);
    //As long as usernames are identifiers you can use dot notation. Has to follow identifier rules
} else {
    //Diagnostic
    console.log(user_data_filename + 'does not exist!');
    //console.log(workout_data_filename + 'does not exist!');
}

//When you hit the login button you want to validate data, if good send to custom invoice
app.post("/LoginForm", function (request, response) {
    //Process login form POST and redirect to custom invoice page if ok, back to login page if not
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
            //Input cookie data here
            response.cookie('username', the_username, { maxAge: 60 * 1000 * 10 }).redirect("/generate_workout");
            return;
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
    response.redirect("index.html?" + qstring);

});

//Validates data in registration form and sends you to success page if data is valid, if not it sends you back to register page with errors

app.post("/register", function (request, response) {
    let INFO = request.body;
    //Makes the username case-insensitive
    username = INFO.Username.toLowerCase();

    // Diagnostic
    console.log(request.query.user_errors, "USER ERRORS");
    //Used to store errors, gonna put the errors in a string that gets loaded when you redirect back to registration page
    //Also resests Errors in string so them dont carry over if user messes up multiple times
    user_errors = {};
    name_errors = {};
    pass_errors = {};
    confirm_pass_errors = {};
    email_errors = {};
    goal_error = {};
    experience_error = {};
    workout_error = {};

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

    //Validate Goal Input (Make sure one is selected)
    console.log(INFO.Goal);
    if (typeof INFO.Goal == "undefined") {
        goal_error.GoalError = "Please Select Something";
        haserrors = true;
    }

    //Validate Experience Input (Make sure one is selected)
    console.log(INFO.Experience);
    if (typeof INFO.Experience == "undefined") {
        experience_error.ExperienceError = "Please Select Something";
        haserrors = true;
    }

    //Validate Workout Input (Make sure one is selected)
    console.log(INFO.Workout);
    if (typeof INFO.Workout == "undefined") {
        workout_error.WorkoutError = "Please Select Something";
        haserrors = true;
    }


    //Turn errors object into strings so they can be input to URL.
    user_errors_string = JSON.stringify(user_errors.UsernameError);
    name_errors_string = JSON.stringify(name_errors.NameError);
    pass_errors_string = JSON.stringify(pass_errors.PassError);
    confirm_pass_errors_string = JSON.stringify(confirm_pass_errors.ConfirmPassError);
    email_errors_string = JSON.stringify(email_errors.EmailError);
    goal_errors_string = JSON.stringify(goal_error.GoalError);
    experience_errors_string = JSON.stringify(experience_error.ExperienceError);
    workout_errors_string = JSON.stringify(workout_error.WorkoutError);


    //If valid turn form values into an object that is saved and stored in JSON file
    //Activate error flag
    if (haserrors == false) {
        users_reg_data[username] = {};
        users_reg_data[username].name = INFO.Name;
        users_reg_data[username].password = INFO.Pass;
        users_reg_data[username].email = INFO.Email;
        users_reg_data[username].goal = INFO.Goal;
        users_reg_data[username].experience = INFO.Experience;
        users_reg_data[username].last_workout = Number.parseInt(INFO.Workout);
        console.log(users_reg_data[username], "NEW VALID OBJECT");

        fs.writeFileSync(user_data_filename, JSON.stringify(users_reg_data));

        var qstring = querystring.stringify(request.query);

        //Takes you to invoice after registration data has been validated (Includes security tag)
        request.query.Username = INFO.Username;
        request.query.InvoiceName = INFO.Name;
        //Inputs command to display successful registration before moving to invoice page.
        request.query.SuccessfulReg = "Registration / Login Successful!";
        qstring = querystring.stringify(request.query);
        
        response.cookie('username', username, { maxAge: 60 * 1000 * 10 }).redirect("/generate_workout");
        //request.session();
        //response.redirect("output.html?" + qstring);

    } else {
        //If not valid add Errors string to query so they can be displayed on page
        request.query.StickyUser = INFO.Username;
        request.query.StickyName = INFO.Name;
        request.query.StickyEmail = INFO.Email;
        request.query.StickyGoal = INFO.Goal;
        request.query.StickyExperience = INFO.Experience;
        request.query.StickyWorkout = INFO.Workout;
        request.query.user_errors = user_errors_string;
        request.query.name_errors = name_errors_string;
        request.query.pass_errors = pass_errors_string;
        request.query.confirm_pass_errors = confirm_pass_errors_string;
        request.query.email_errors = email_errors_string;

        qstring = querystring.stringify(request.query);

        //Input errors into new registration URL query so they can be used to display errors
        response.redirect("/register.html?" + qstring);
        //response.send(reg_errors);
    }
});

//Build Respone to Input Information
app.get("/generate_workout", function (request, response) {
   
    //IF USER ISNT LOGGED IN SEND TO LOGIN
    if (typeof request.cookies.username == "undefined") {
        response.redirect("index.html");
        return;
    }

    //Take cookie name and use it to extract goal, experience and last workout.
    CookieUsername = request.cookies.username;
    user_data_JSON = fs.readFileSync(user_data_filename, 'utf-8');
    user_data = JSON.parse(user_data_JSON);
    theUserInfo = user_data[CookieUsername];
    page_str = '';
    page_str += `Your Goal: ${theUserInfo.goal} <br>`;
    page_str += `Your Experience Level: ${theUserInfo.experience} <br>`;
    page_str += `Your Last Workout (0=Push, 1=Pull, 2=Legs): ${theUserInfo.last_workout} <br>`;

    //workout_data = fs.readFileSync(workout_data_filename, 'utf-8');


//WORKOUTS
             A_N_Push = ["Bench", "Ex2", "Ex3", "Ex4", "Ex5"];
             A_N_Pull = ["Deadlift", "Ex2", "Ex3", "Ex4", "Ex5"];
             A_N_Legs = ["Squats", "Ex2", "Ex3", "Ex4", "Ex5"];
         A_Novice_Array = [A_N_Push, A_N_Pull, A_N_Legs];   
             A_A_Push = ["Bench", "Ex2", "Ex3", "Ex4", "Ex5"];
             A_A_Pull = ["Deadlift", "Ex2", "Ex3", "Ex4", "Ex5"];
             A_A_Legs = ["Squats", "Ex2", "Ex3", "Ex4", "Ex5"];
         A_Advanced_Array = [A_A_Push, A_A_Pull, A_A_Legs];  
  
Aesthetic_Array = [A_Novice_Array, A_Advanced_Array];

   
             S_N_Push = [" Bench", " OHP", " Incline DB", " DB Tricep Extension", " Tricep Cable Pull"];
             S_N_Pull = ["Deadlift", "Ex2", "Ex3", "Ex4", "Ex5"];
             S_N_Legs = ["Squat", "Ex2", "Ex3", "Ex4", "Ex5"];
        S_Novice_Array = [S_N_Push, S_N_Pull, S_N_Legs];
             S_A_Push = ["Bench", "Ex2", "Ex3", "Ex4", "Ex5"];
             S_A_Pull = ["Deadlift", "Ex2", "Ex3", "Ex4", "Ex5"];
             S_A_Legs = ["Squat", "Ex2", "Ex3", "Ex4", "Ex5"];
        S_Advanced_Array = [S_A_Push, S_A_Pull, S_A_Legs];

    Stronger_Array = [S_Novice_Array, S_Advanced_Array];

Goal_Array = [Stronger_Array, Aesthetic_Array]; 


    //LOGIC GOES HERE
    //0 = Push, 1 = Pull, 2 = Legs
    Ex_Array = [0,1,2];

    if (theUserInfo.goal == "Stronger") {
        if (theUserInfo.experience == "Novice") {
            if (theUserInfo.last_workout == "0") {
                OfficalWorkout = Goal_Array[0][0][0];
            } else if (theUserInfo.last_workout == "1") {
                OfficalWorkout = Goal_Array[0][0][1];
            } else {
                OfficalWorkout = Goal_Array[0][0][2];
            }
        } else {
            if (theUserInfo.last_workout == "0") {
                OfficalWorkout = Goal_Array[0][1][0];
            } else if (theUserInfo.last_workout == "1") {
                OfficalWorkout = Goal_Array[0][1][1];
            } else {
                OfficalWorkout = Goal_Array[0][1][2];
            }
        }
    } else {
        if (theUserInfo.experience == "Novice") {
            if (theUserInfo.last_workout == "0") {
                OfficalWorkout = Goal_Array[1][0][0];
            } else if (theUserInfo.last_workout == "1") {
                OfficalWorkout = Goal_Array[1][0][1];
            } else {
                OfficalWorkout = Goal_Array[1][0][2];
            }
        } else {
            if (theUserInfo.last_workout == "0") {
                OfficalWorkout = Goal_Array[1][1][0];
            } else if (theUserInfo.last_workout == "1") {
                OfficalWorkout = Goal_Array[1][1][1];
            } else {
                OfficalWorkout = Goal_Array[1][1][2];
            }
        }
    }

console.log(OfficalWorkout);

    /*
    WorkoutString = "";
    for (i = 0; i < OfficalWorkout.length; i++) {
        //PRINT Out Workout line by line
        WorkoutString += OfficalWorkout[i];
    }
    */

    response.send(page_str + "Your New Workout:" + OfficalWorkout);

//Alterworkout each day (How can I use cookie)

if (theUserInfo.last_workout == Ex_Array.length - 1){
theUserInfo.last_workout = 0;
}
else {
    theUserInfo.last_workout += 1;
}
users_reg_data[CookieUsername].last_workout = theUserInfo.last_workout; 
fs.writeFileSync(user_data_filename, JSON.stringify(users_reg_data));

console.log("We Made it");


});

app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));




