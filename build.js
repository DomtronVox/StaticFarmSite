var settings = {}

settings["source"] = "./src/documents"
settings["destination"] = "./build"

settings["metadata"] = {
    site: {
        sitetitle: "Dozy Doe Down",
        description: "Nigerian Dwarf Dary Goats and more",
        url: "http://www.dozydoedown.com/"
    }
}

settings["layouts"] = {
      engine: 'handlebars'
     ,directory: "./src/layouts"
     ,partials:"./src/layouts/partials"
}

settings["handlebar helpers"] = {
    "directory": "handlebars-helpers"
}

settings["collections"] = {
    MainPage: {
        sortBy: "navPriority"
    },
    CSS: {
        pattern: "*.css",
        sortBy: 'date',
        reverse: false
    }
  }

settings["markdown"] = {
  tables: true
}

settings["assets"] = {
    "source": "./src/files/",
    "destination": ""
}
 
settings["csv_parser"] = {
    "delimiter": ","
}

//processing - handle some custom processing
settings["build"] = function(err, files) {
    console.log(Object.keys(files));
    //console.log(this._metadata.collections.Goats)
    for (file in files) {
        files[file].collections = this._metadata.collections;
    }

    //print any errors that occure
    if (err) { throw err; }
}

//>>TODO temporary fix for having to put mainpages under it's own directory because 
//   netlify-cms does not like content collections with sub-folders
function modifyMainPagesPath(files, metalsmith, done) {

    setImmediate(done);

    for (file in files) {

        if ( file.substring(0, 10) == "main_pages") {
            files[file.substring(11)] = files[file];
            delete files[file];
        }
    }
}

//for debugging
function printTest(files, metalsmith, done) {

    setImmediate(done);
    console.log(Object.values(files.contents.toString()));
    //console.log(files)

}

//load in MS dependancies
var Metalsmith  = require('metalsmith')
  , markdown    = require('metalsmith-markdown')
  , layouts     = require('metalsmith-layouts')
  , reg_handlebar_helpers = require('metalsmith-register-helpers')
  , permalinks  = require('metalsmith-permalinks')
  , assets = require('metalsmith-assets')
  , collections = require('metalsmith-collections')
  , watch = require('metalsmith-watch');

//load in our own code files
var csv_parser = require("./csv_parser.js")
  , csv_generate_pages = require("./csv_to_pages.js");


//run metalsmith and generate the website
Metalsmith(__dirname)
    //setup basic settings
    .source(settings["source"])
    .destination(settings["destination"])
    .metadata(settings["metadata"])
    .clean(true)
    //setup plugins
    .use( reg_handlebar_helpers(settings["handlebar helpers"]) )
    .use( csv_parser(settings["csv_parser"]) )
    .use( csv_generate_pages() )
    //.use(printTest)
    .use( modifyMainPagesPath )
    .use( collections(settings["collections"]) )
    .use( markdown(settings["markdown"]) )
    .use( permalinks() )
    .use( assets(settings["assets"]) )
    .use( layouts(settings["layouts"]) )
    //.use( watch({ paths: { "${source}/../*":true } }) ) 
    //actually run the generator
    .build(settings["build"])

