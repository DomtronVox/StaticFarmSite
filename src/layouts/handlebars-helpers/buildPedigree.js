/*

A handlebars helper function that builds the main table rows for a goat pedigree

Each animal has 2 parents so that each generation, or level, has 2^(level #) of
     animals.
*/

//this is bad since consolidat.js apstracts away the template engine but we are calling
//   it directly here. But this is needed to beable to make the string show as html.
var Handlebars = require('handlebars')

module.exports = function(data) {

    if (data == undefined) { return "" }

    var rows = [];
    //console.log(data)
    
    if (data.dam != undefined) {
        rows = DecendIntoLevel(rows, data.dam, 0, data.number_generations)
    }

    if (data.sire != undefined) {
        rows = DecendIntoLevel(rows, data.sire, 0, data.number_generations)
    }

    console

    /*//loop through each of the generations
    for (var column_index in data) {
        column_index = parseInt(column_index, 10);
        
        var column_data = data[column_index];

        //calculate the rowspan for the current level's cells
        var rowspan = oldest_generation_cell_count / Math.pow(2, column_index+1);
        var column_cell_count =  oldest_generation_cell_count / rowspan;

        //add each cell that his column should have and populate data if avalible
        for (var i=0; i < column_cell_count; i++) {

            if (rows[i*rowspan] == undefined) { rows[i*rowspan] = ""; }

            var cell_data = ""
            if (column_data[i] != undefined) {
                cell_data = column_data[i];
            } 

            rows[i*rowspan] += "<td rowspan=\""
                               + rowspan
                               + "\">"
                               //+ "<a href=\"\">" //TODO: figure out how to make a link
                               + cell_data
                               + "</td>";

        }

    }*/

    var return_value="";
    for (var row in rows) {
        return_value += "<tr>" + rows[row] + "</tr>\n";
    }

    return new Handlebars.SafeString(return_value);

}

//Recursive function that helps build the table
var DecendIntoLevel = function(rows, data, column, columns) {
    column++;

    var rowspan = Math.pow(2, columns) / Math.pow(2, column+1);
    var column_cell_count =  Math.pow(2, columns) / rowspan;
    
    //console.log(column, columns, rowspan, column_cell_count)

    for (var i=0; i < column_cell_count; i++) {

        if (rows[i*rowspan] == undefined) { rows[i*rowspan] = ""; }
        //console.log(data.info)
        rows[i*rowspan] += "<td rowspan=\""
                        + rowspan
                        + "\">"
                        //+ "<a href=\"\">" //TODO: figure out how to make a link
                        + data.info
                        + "</td>";
    }

    if (data.dam != undefined) {
        rows = DecendIntoLevel(rows, data.dam, column, data.number_generations)
    }

    if (data.sire != undefined) {
        rows = DecendIntoLevel(rows, data.sire, column, data.number_generations)
    }

    return rows
}


