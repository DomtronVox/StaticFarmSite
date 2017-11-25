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
    "directory": "./src/layouts/handlebars-helpers"
}

settings["permalinks"] = {
    pattern: null,

    linksets: []
}

settings["collections"] = {
    MainPage: {
        sortBy: "navPriority"
    },
    CSS: {
        pattern: "*.css",
        sortBy: 'date',
        reverse: false
    },
    Goats: {
        pattern: "src/documents/Goats/*",
        sortBy: 'full_title',
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


settings["pagination1"] = {
  'collections.Goats': {
    perPage: 1000,
    layout: 'goatindex.html',
    pageContents: new Buffer(""),
    path: 'Goats/bucks.html',
    
    filter: function (page) {
      return page.gender == "male" && page.reference == "no"
    },
    pageMetadata: {
      title: 'Listing of Our Bucks'
    }
  }
}

settings["pagination2"] = {
  'collections.Goats': {
    perPage: 1000,
    layout: 'goatindex.html',
    pageContents: new Buffer(""),
    path: 'Goats/does.html',
    filter: function (page) {
      return page.gender == "female" && page.reference == "no"
    },
    pageMetadata: {
      title: 'Listing of Our Does'
    }
  }
}

settings["pagination3"] = {
  'collections.Goats': {
    perPage: 1000,
    layout: 'goatindex.html',
    pageContents: new Buffer(""),
    path: 'Goats/reference-bucks.html',
    filter: function (page) {
      return page.gender == "male" && page.reference == "yes"
    },
    pageMetadata: {
      title: 'Listing of Reference Bucks'
    }
  }
}

settings["pagination4"] = {
  'collections.Goats': {
    perPage: 1000,
    layout: 'goatindex.html',
    pageContents: new Buffer(""),
    path: 'Goats/reference-does.html',
    filter: function (page) {
      return page.gender == "female" && page.reference == "yes"
    },
    pageMetadata: {
      title: 'Listing of Reference Does'
    }
  }
}

//>>TODO temporary fix for having to put mainpages under it's own directory because 
//   netlify-cms does not like content collections with sub-folders
settings["move_up"] = {
  pattern: 'main_pages/*',
  by: 1
}

//processing - handle some custom processing
function customProcessing(files, metalsmith, done) {

    setImmediate(done);

    for (file in files) {
        //files[file].collections = this._metadata.collections;
        files[file].path = file;
    }

}


//we actually want all the mainpages to be one page.
//TODO: not actually used atm. dicided on a different aproch for now
function mergeMainPages(files, metalsmith, done) {

    setImmediate(done);

    //combined page data
    var page_data = {
        title:"Home"
      , contents:new Buffer("")
      , layout: 'default.html'
      , mode: '0644'
    }

    //collections plugin runs before this function so metadata has the mainpage collection
    for (var key in metalsmith._metadata.collections.MainPage) {
        if (key == "metadata") { continue; }

        page = metalsmith._metadata.collections.MainPage[key]
        
        page_data.contents = Buffer.concat([page_data.contents, page.contents]);

        if (!page_data.stats) { page_data.stats = page.stats } 
    }
    //TODO: need to delete old pages and add the new merged page.
    console.log(page_data.contents)
    
}

//for debugging
function printTest(files, metalsmith, done) {

    setImmediate(done);
    console.log("#############################################################################")
    console.log(metalsmith._metadata.collections);

}

settings["build"] = function(err, files) {

    //print any errors that occure
    if (err) { throw err; }
}

//load in MS dependancies
var Metalsmith  = require('metalsmith')
  , markdown    = require('metalsmith-markdown')
  , layouts     = require('metalsmith-layouts')
  , reg_handlebar_helpers = require('metalsmith-register-helpers')
  , permalinks  = require('metalsmith-permalinks')
  , assets = require('metalsmith-assets')
  , collections = require('metalsmith-collections')
  , watch = require('metalsmith-watch')
  , moveUp = require('metalsmith-move-up')
  , pagination = require('metalsmith-pagination');

//load in our own code files
//var csv_parser = require("./csv_parser.js")
//  , csv_generate_pages = require("./csv_to_pages.js");


//run metalsmith and generate the website
Metalsmith(__dirname)
    //setup basic settings
    .source(settings["source"])
    .destination(settings["destination"])
    .metadata(settings["metadata"])
    .clean(true)

    //setup plugins
    .use( reg_handlebar_helpers(settings["handlebar helpers"]) )
    //.use( permalinks(settings["permalinks"]) ) //TODO: add proper options once we add blog posts
    .use( moveUp(settings["move_up"]) )
    .use( markdown(settings["markdown"]) )
    //due to the way metalsmith-pagination works I need to do seperate configs for
    //    each operation on the same collection.
    .use( collections(settings["collections"]) )
    .use( pagination(settings["pagination1"]) )
    .use( pagination(settings["pagination2"]) )
    .use( pagination(settings["pagination3"]) )
    .use( pagination(settings["pagination4"]) )
    //.use(printTest)
    .use( customProcessing )
    .use( layouts(settings["layouts"]) )
    .use( assets(settings["assets"]) )
    //.use( watch({ paths: { "${source}/../*":true } }) ) 
    //actually run the generator
    .build(settings["build"])

