
//runs metalsmith code to build website
require("./build.js");


//run server for testing locally
var nodestatic = require('node-static');
var staticserver = new nodestatic.Server("./build"); //TODO need to pull this location from settings object in build.js

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        staticserver.serve(request, response);
    }).resume();
}).listen(8080);

console.log("Listening on http://127.0.0.1:8080")
