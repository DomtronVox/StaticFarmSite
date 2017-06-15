var Handlebars = require('handlebars')

//this is bad since consolidat.js apstracts away the template engine but we are calling
//   it directly here. But this is needed to beable to make the string show as html.
var Handlebars = require('handlebars')

module.exports = function(data) {

    var return_html = "";

    return_html += '<ul class="main-nav">\n'

    //loop through collection and create the nav bar
    for (var index=0; index < data.length; index++) {

        var datum = data[index];

        return_html += '<li><a href="/'+datum.path+'">'+datum.navTitle+'</a></li>\n'

        //insert logo near the middle
        if (index+1 == Math.floor(data.length/2) ) {
            
            return_html += '<li class="small-logo"><a href="/"><img src="/images/small-logo.png" alt=""></a></li>\n'
        }

    }
    
    return_html += '</ul>\n'

    return new Handlebars.SafeString(return_html)

}
