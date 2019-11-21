fs = require('fs');
var filename = 'user_data.json';
//Better to use variable because its more flexible for when things change

if (fs.existsSync(filename)){
//Checks to see if file exists. Goes to check and returns boolean true if path exists or false. Use sync so that it doesnt go off and do the next thing before doing what you need to do.

stats = fs.statSync(filename);
//Allows you to get certain information about your file.

console.log(filename + ' has ' + stats.size + ' characters')

data = fs.readFileSync(filename, 'utf-8');
//Asynchronous by nature, once you call it it goes off and runs on its own. readFileSync reads file, waits till its read, returns back with stuff in file and then continues with code. (Blocking function) Set what you get back to data.

console.log(typeof data);
//Read file and saved it as a string.

users_reg_data = JSON.parse(data);
//Takes string and converts it into an object.

console.log(users_reg_data['itm352'].password);
//As long as usernames are identifiers you can use dot notation. Has to follow identifier rules
} else {
    console.log(filename + ' does not exist!');
}

//JSON DATA: You get all these properties that are usernames stored with all the information that corresponds with the username, convienent for saving and using user info. Dont need to search, just ask for username and have acess to all data, easy to add new object. Data stored as text in a file. Load it in and turn it into a JSON object that js can use. 