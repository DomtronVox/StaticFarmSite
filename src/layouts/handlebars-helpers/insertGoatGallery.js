//this is bad since consolidat.js apstracts away the template engine but we are calling
//   it directly here. But this is needed to beable to make the string show as html.
var Handlebars = require('handlebars')

module.exports = function(images) {

    var return_html = "";

    return_html += '<div class="gallery">\n'

    //loop through collection and create the nav bar
    for (var index=0; index < images.length; index++) {

        var datum = images[index]; 
        return_html += '    <div><img src="'+datum.image+'" /> <p>'+datum.caption+'</p></div>\n'
        
    }
    
    return_html += '</div>\n'

    return new Handlebars.SafeString(return_html)

}
