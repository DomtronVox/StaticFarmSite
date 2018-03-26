//this is bad since consolidat.js apstracts away the template engine but we are calling
//   it directly here. But this is needed to beable to make the string show as html.
var Handlebars = require('handlebars')

function addCell(variable) {
    if (variable){
        return '<td>'+variable+'</td>'
    } else {
        return '<td></td>'
    }
}

module.exports = function(data_rows) {

    var return_html = "";

    return_html += '<table class="fullwidth_table">\n'
    return_html += '<tr><th>Date</th><th>Bred To</th><th>Doelings</th><th>Bucklings</th><th>Comments</th></tr>\n'

    //loop through collection and create the nav bar
    for (var index=0; index < data_rows.length; index++) {

        var row = data_rows[index]; 
        
        return_html += '    <tr>'
        return_html += addCell(row.bredDate)
        return_html += addCell(row.breeder)
        return_html += addCell(row.doeCount)
        return_html += addCell(row.buckCount)
        return_html += addCell(row.comments) 
        return_html += '</tr>'
        
    }
    
    return_html += '</table>\n'

    return new Handlebars.SafeString(return_html)

}
