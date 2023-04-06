/*jshint esversion: 6 */

console.log('frontend script is working');

$(document).ready(function () {

    let url;

    // Get Config.Json and variable from it
    $.ajax({
        url: 'config.json',
        type: 'GET',
        dataType: 'json',
        success: function (configData) {
            console.log(configData.SERVER_URL, configData.SERVER_PORT);
            url = `${configData.SERVER_URL}:${configData.SERVER_PORT}`;
            console.log(url);
            // getAllProducts();
        },
        error: function (error) {
            console.log(error);
        }
    });
})

// Get All products Function
function getAllProducts() {
    $.ajax({
        url: `http://${url}/allProducts`,
        type: 'GET',
        dataType: 'json',

        success: function(productsFromMongo) {
            let results = document.getElementById(''); // Patricia - enter id name please :)
            results.innerHTML = '';
            for (let i = 0; i < productsFromMongo.length; i++){
                results.innerHTML +=
                `` // Patricia - can you please paste in the card here :)
            } // end of for loop
        }, // end of success

        error: function() {
            alert('unable to get products');
        }, // end of error

    }) // end of ajax function
} // end of getAllProducts function