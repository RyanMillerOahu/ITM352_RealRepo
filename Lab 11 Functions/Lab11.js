/*
attributes = "Ryan;20;20.5;-19.5";
theSeperator = ';';
parts = attributes.split(theSeperator);


//parts = ['Ryan', 20, 20.05, 19.5];

/*
for(i=0; i < parts.length; i++) {
    console.log(`${parts[i]} isNonNegInt ${isNonNegInt(parts[i],true)}`);
}

console.log(parts.join(theSeperator));

function isNonNegInt(q, return_errors = false) {
    
    errors = []; // assume no errors at first
    if(Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if(q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if(parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
    return return_errors ? errors : (errors.length == 0);
}
*/
/*
parts.forEach(function (item,index){console.log( (typeof item == 'string' && item.length > 0)?true:false )});


//function printIt(item, index) {
  //  console.log(`${item} isNonNegInt ${isNonNegInt(item, true)}`);
}

console.log(parts.join(theSeperator));

function isNonNegInt(q, return_errors = false) {

    errors = []; // assume no errors at first
    if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
    return return_errors ? errors : (errors.length == 0);

}
*/

