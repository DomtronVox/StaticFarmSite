//generates files using a template and csv data. Make sure to run the
//  csv parser first.
module.exports = plugin

//generates pages based on the csv data 
function plugin(options) {
    options = options || {};

    return function(files, metalsmith, done) {
        setImmediate(done);

        //create goat pages
        var csv_index = "Goats/goatData"
        var template_name = csv_index+".md"
        var goat_template = files[template_name].contents.toString("utf8");
        var file_data = files[template_name];
        delete files[template_name];

        //delete parts that are causing problems
        //  metalsmith seems to think there is only one file and repeats the data 
        delete file_data.stats
        delete file_data.mode

        for (var csv in metalsmith._metadata.csv_data[csv_index]) {            
            var goat_md = goat_template;
            csv = metalsmith._metadata.csv_data[csv_index][csv];
            
            //replace tags
            goat_md = goat_md.replace("==GOAT_FULLNAME==", csv["Barn Name"]);
            goat_md = goat_md.replace("==DAME==", csv["Dam-barn name"]);
            goat_md = goat_md.replace("==SIRE==", csv["Sire-barn name"]);
            goat_md = goat_md.replace("==LONG_DESCRIPTION==", csv["Description"]);
            
            //setup data for pedegree generation
            //console.log(metalsmith._metadata.csv_data[csv_index])
            var pedigree = generate_pedigree(metalsmith._metadata.csv_data[csv_index]
                                            , csv["Barn Name"], 5);

            //add file to file list
            //deep copy data
            var goat_data = {}
            Object.keys(file_data).forEach(
                function(key){
                    goat_data[key] = file_data[key];
                }
            );

            goat_data.contents = new Buffer(goat_md);
            goat_data.pedigree = pedigree;
            goat_data.goat_data = csv;
            files["Goats"+"/"+csv["Barn Name"]+".md"] = goat_data;
            
       }

    }

}

//setup and then run the recursive get parent function to build a pedigree data set
//  for the target animal
function generate_pedigree(csv, target_name, levels) {
    var return_data = []//{};
    for (var i = 0; i <= levels; i++) {
        //run some math to figure our how many rows this level's cells will need
        //    to span so that the last column spans one row.
        var rowspan = (2^levels) / (2^i);

        //add an empty list at the data point
        return_data.push([])
    }

    return_data = get_parents(csv, target_name, levels, -1)

    return_data.number_generations = levels;

    return return_data
}

//recursive function that adds an animal to the current level then looks for the
//  animals parents and add them back a given number of generations.
function get_parents(csv, target_name, levels, level) {
    level++;

    //skip this run if we have gone the given levels deep or we don't have a 
    //  valid target
    if (level > levels || target_name == undefined 
          || target_name.length == 0) { 
        return_data = {info:"Error: Missing goat information. Please contact website manager for the complete pedigree."}
        return return_data; 
    }

    var return_data;
    return_data = {}

    //look for the target's data
    for (var index in csv) {
        var csv_data = csv[index];
   
        //if we found the target's data 
        if (csv_data["Barn Name"] == target_name) {
            //collect needed info for this individual
            return_data.info = csv_data;
            
            //run next level of the recursive iteration
            return_data.dam = get_parents(csv, csv_data["Dam-barn name"], levels, level)
            return_data.sire = get_parents(csv, csv_data["Sire-barn name"], levels, level)

            //end the loop early
            return return_data
        }
            
    }

    //for some reason the target's data was not found so we add a string stating such
    return_data.info = "error: "
                     + target_name
                     + " is missing from our database. "
                     + "Contact website manager for the complete pedigree."

    return return_data
}
