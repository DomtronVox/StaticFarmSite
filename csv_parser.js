/* Metal smith plugin that parses comma seperated value files into data
      that gets stored in metalsmith's metadata.

*/

var extname = require('path').extname;

module.exports = plugin

function plugin(options) {
    options = options || {};

    //set default delimiter
    if (!options.delimiter) { options.delimiter = ","; }
  
    return function(files, metalsmith, done){
        setImmediate(done);

        if(!metalsmith._metadata.csv_data) { metalsmith._metadata.csv_data = {}; };

        Object.keys(files).forEach(function(file) {

            if (!isCSVFile(file)) { return; }

            csv_data = parse_csv( files[file].contents.toString("utf8")
                                , options.delimiter)
            delete files[file];
            metalsmith._metadata.csv_data[file.split(".")[0]] = csv_data
        })
    };
}


//
function isCSVFile(file){
  return /\.csv/.test(extname(file));
}


function parse_csv(data, delimiter) {
     
    //each line is a row is on it's own line
    var rows = data.split("\n");

    //split out the values for the first entry which should be the header
    //  defining the name of each column
    var header = rows[0].split(delimiter);

    //now we will build the data list
    var csv_data = [];

    //1 because we don't process the header
    var row_data, csv_data_object;
    for (var curr_row = 1; curr_row < rows.length; curr_row++){
        //split out the data fields using the given delimiter.
        row_data = rows[curr_row].split(delimiter);

        if (row_data.length != header.length) { continue; }

        //create the empty object for this row's data
        csv_data_object = {};

        for (var column = 0; column < row_data.length; column++) {
            csv_data_object[header[column]] = row_data[column]
        }

        //push data to csv_data
        csv_data.push(csv_data_object);
            
    }

    return csv_data;
};
    
