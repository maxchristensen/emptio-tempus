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