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

function formatName(goat_data, row) {
    var name_html = ""
    if (goat_data.titlesEarned) { name_html+= ' <span class="pedigreeTitle">'+goat_data.titlesEarned+'</span> ' }
    name_html += goat_data.title
    if (goat_data.milkStar) { name_html += ' <span class="pedigreeTitle">'+goat_data.milkStar+'</span> '}
    
    //show LA score if enabled
    if (goat_data.la_score) {
        if ( (goat_data.gender == "Buck" && row.showSireLAScore) ||
             (goat_data.gender != "Buck" && row.showDamLAScore) ) {
            name_html += ' <span class="pedigreeTitle">'+goat_data.la_score+'</span>'
        }
    }

    if (goat_data.blue_eyes) { name_html += ' <span style="color:#3f3fff;">B</span> '}
    if (goat_data.polled) { name_html += ' <span style="color:#00a900;">P</span> '}
    if (goat_data.moonspots) { name_html += ' <span style="color:#b79c3c;">M</span> '}
    
    return name_html;
}

module.exports = function(data_rows, tableTitle, Goats) {

    var return_html = "";
            
    return_html += '<table>\n'
    return_html += '    <tr><th colspan="100"><h2>'+tableTitle+'</h2></th></tr>\n'
    return_html += '    <tr><th>Dam</th><th>Sire</th><th>Date Due and Confirmation</th><th>Breeding Notes</th></tr>\n'
    return_html += '    <tr><th colspan="100">Kiddings Listed by Due Date</th></tr>\n'

    //loop through collection and create the nav bar
    for (var index=0; index < data_rows.length; index++) {

        var row = data_rows[index]
          , dam_data = Goats[row.dam]
          , sire_data = Goats[row.sire];

        //skip if either 
        if (!sire_data || !dam_data) { 
            console.log("Error: Kidding schedule row data invalid for row "+index+". "+(sire_data ? "Dam" : "Sire")+" does not exist!" ); 
            continue; 
        }
        
        return_html += '    <tr>'

        //put in parent's names 
        return_html += '    <td>'
        return_html += '    <span '+(row.sellingDam ? 'style="color:orange;"' : '')+'>'
             +formatName(dam_data, row)
             +'</span><br /><img class="smallImg" src="'+dam_data.side_picture+'">'
             +'</img><br /><a href="/'+dam_data.path+'"> Doe\'s Page.</a></td>'
        return_html += '    <td><span>'+formatName(sire_data, row)
                    +  '</span><br /><img class="smallImg" src="'+sire_data.side_picture+'"></img>'
                    +  '<br /><a href="/'+sire_data.path+'">Buck\'s Page.</a></td>'

        //do the date/notes column
        return_html += '    <td><span style="color:red;font-size:18px;"> Due '+row.dueDate+'</span> <br />'
        return_html += '<span>'+(row.confirmation ? 'Confirmed' : 'Unconfirmed')+'</span><br /> '
        for (var i in row.notes_list) { return_html += '<p>'+row.notes_list[i].note+'</p>' }

        return_html += '</td>'

        //do the genetic traits column
        
        return_html += '    <td>'
       
        if ( dam_data.blue_eyes || dam_data.polled || dam_data.moonspots
         ||  sire_data.blue_eyes || sire_data.polled || sire_data.moonspots) {
            return_html += 'Will possibly have: '

            if(dam_data.blue_eyes || sire_data.blue_eyes) { return_html += ' <span style="color:#3f3fff;">Blue Eyes</span> ' }
            if(dam_data.polled || sire_data.polled) { return_html += ' <span style="color:#00a900;">Polled</span> ' }
            if(dam_data.moonspots || sire_data.moonspots) { return_html += ' <span style="color:#b79c3c;">Moonspots</span> ' }

        }

        if (row.geneticNotes) { return_html += '<br/> ' + row.geneticNotes; }

        return_html +='</td>'

        return_html += '    </tr>'
        
    }
    
    return_html += '</table>\n'
    return_html += '<p>Orange <span style="color:orange;">colored</span> parent names may be avalible for sale after the kidding.</p>'

    return new Handlebars.SafeString(return_html)

}
