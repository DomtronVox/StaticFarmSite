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

    return_html += '<table>\n'
    return_html += '<tr><th>YR</th><th>DIM</th><th>VOL (LBS)</th><th>FAT (%)</th><th>PROTEIN (%)</th></tr>\n'

    //loop through collection and create the nav bar
    for (var index=0; index < data_rows.length; index++) {

        var row = data_rows[index]; 
        
        return_html += '    <tr>'
        return_html += addCell(row.milkRecordYear)
        return_html += addCell(row.milkRecordDIM)
        return_html += addCell(row.milkRecordVolume)
        return_html += addCell(row.milkRecordFat)
        return_html += addCell(row.milkRecordProtein) 
        return_html += '</tr>'
        
    }
    
    return_html += '</table>\n'

    return new Handlebars.SafeString(return_html)

}
