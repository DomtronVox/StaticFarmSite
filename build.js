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
      , refer: false
    },
    SubPage: {
        sortBy: "navPriority"
      , refer: false
    },
    CSS: {
        pattern: "*.css"
      , sortBy: 'date'
      , refer: false
      , reverse: false
    },
    Goats: {
        pattern: "src/documents/Goats/*"
      , sortBy: 'full_title'
      , refer: false
      , reverse: false
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


settings["pagination_senior_does"] = {
  'collections.Goats': {
    perPage: 1000,
    layout: 'goatindex.html',
    pageContents: new Buffer(""),
    path: 'Goats/senior-does.html',
    filter: function (page) {
      return page.gender == "Senior Doe" && page.reference == "no"
    },
    pageMetadata: {
      title: 'Listing of Our Senior Does'
    , navTitle: "Senior Does"
    , navNest: "Nigerian Dwarf Goats" //Note/TODO: dangerous to hard code this, if someone changes the page title it will break these pages
    , collection: "SubPage"
    , navPriority: '1'
    }
  }
}

settings["pagination_junior_does"] = {
  'collections.Goats': {
    perPage: 1000,
    layout: 'goatindex.html',
    pageContents: new Buffer(""),
    path: 'Goats/junior-does.html',
    
    filter: function (page) {
      return page.gender == "Junior Doe" && page.reference == "no"
    },
    pageMetadata: {
      title: 'Listing of Our Junior Does'
    , navTitle: "Junior Does"
    , navNest: "Nigerian Dwarf Goats" //Note/TODO: dangerous to hard code this, if someone changes the page title it will break these pages
    , collection: "SubPage"
    , navPriority: '2'
    }
  }
}

settings["pagination_bucks"] = {
  'collections.Goats': {
    perPage: 1000,
    layout: 'goatindex.html',
    pageContents: new Buffer(""),
    path: 'Goats/bucks.html',
    filter: function (page) {
      return page.gender == "Buck" && page.reference == "no"
    },
    pageMetadata: {
      title: 'Listing of Our Bucks'
    , navTitle: "Bucks"
    , navNest: "Nigerian Dwarf Goats" //Note/TODO: dangerous to hard code this, if someone changes the page title it will break these pages
    , collection: "SubPage"
    , navPriority: '3'
    }
  }
}

settings["pagination_reference_goats"] = {
  'collections.Goats': {
    perPage: 1000,
    layout: 'goatindex.html',
    pageContents: new Buffer(""),
    path: 'Goats/reference-goats.html',
    filter: function (page) {
      return page.reference == "yes"
    },
    pageMetadata: {
      title: 'Listing of Our Reference Goats'
    , navTitle: "Reference Goats"
    , navNest: "Nigerian Dwarf Goats" //Note/TODO: dangerous to hard code this, if someone changes the page title it will break these pages
    , collection: "SubPage"
    , navPriority: '4'
    }
  }
}


//>>TODO temporary fix for having to put mainpages under it's own directory because 
//   netlify-cms does not like content collections with sub-folders
settings["move_up"] = {
  pattern: 'main_pages/*',
  by: 1
}

settings["move_up2"] = {
  pattern: 'kidding_schedule/*',
  by: 1
}

//processing - handle some custom processing
function customProcessing(files, metalsmith, done) {
    //just allows this to work like a metalsmith plugin
    setImmediate(done);

    //add the file path an filename to each file object so it doesn't get lost later on
    for (var file in files) {
        files[file].path = file;
    }

    //manually add the pagination index's to their subpage collection
    //TODO Not a nice way to do it but since we call collections before
    goat_pagination_files = [ files["Goats/senior-does.html"], files["Goats/junior-does.html"], 
                              files["Goats/bucks.html"], files["Goats/reference-goats.html"] ];

    Array.prototype.push.apply(metalsmith._metadata.collections.SubPage, goat_pagination_files)

    //Further sort the sub pages collection so it is easier to build the nav bar
    var subpage_collection = metalsmith._metadata.collections.SubPage;
    var sorted_collection = {}
    for (var index in subpage_collection) {
        var page = subpage_collection[index];

        //if nav nest is defined sort the page
        if (page && page.navNest) {
            //create the sort catagory if it doesn't already exist
            if (! (page.navNest in sorted_collection)) { sorted_collection[page.navNest] = [];}

            sorted_collection[page.navNest].push(page);
        }
    }
    //#finish by adding the sorted list to the collection object
    subpage_collection["sortedByMainPage"] = sorted_collection

    //Add a key-value object for goat pages so we can find a particular goat quickly
    var goatsByName = {}
    for (var index in metalsmith._metadata.collections.Goats) {
        var goat = metalsmith._metadata.collections.Goats[index];
        if (goat && Number(index) != NaN) {
            goatsByName[goat.title] = goat;
        }
    }
    metalsmith._metadata.collections.Goats["goatsByName"] = goatsByName;

    //console.log(Object.keys(metalsmith._metadata.collections.Goats.goatsByName))
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
    .use( moveUp(settings["move_up2"]) )
    .use( markdown(settings["markdown"]) )
    //due to the way metalsmith-pagination works I need to do seperate configs for
    //    each operation on the same collection.
    .use( collections(settings["collections"]) )
    .use( pagination(settings["pagination_senior_does"]) )
    .use( pagination(settings["pagination_junior_does"]) )
    .use( pagination(settings["pagination_bucks"]) )
    .use( pagination(settings["pagination_reference_goats"]) )
    //.use(printTest)
    .use( customProcessing )
    .use( layouts(settings["layouts"]) )
    .use( assets(settings["assets"]) )
    //.use( watch({ paths: { "${source}/../*":true } }) ) 
    //actually run the generator
    .build(settings["build"])

