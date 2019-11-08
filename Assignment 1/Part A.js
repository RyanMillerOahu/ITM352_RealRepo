
//Master Array
products_array = [
{
    package: "Setup",
    price: 20,
    Image: "tentA.png",
},
{
    package: "Basic",
    price: 25,
    Image: "tentB.png",
},
{
    package: "Boujee",
    price: 30,
    Image: "tentC.png",
},
{
    package: "Badass",
    price: 35,
    Image: "tentD.png",
},
{
    package: "Celestial",
    price: 40,
    Image: "tentE.png",
}
];

//Print Left Column Loop
for (i = 0; i <= products_array.length; i++) {
    document.write(`
<tr>
<div id = productbox>
<img src= ./Images/${(products_array[i].image)} width = 200px height =200px>
<h2>${(products_array[i].package)} - $${(products_array[i].price)}</h2>
<p>${(products_array[i].description)}</p>
<p><input type = number><p>
</div>
</tr>
`);
};

