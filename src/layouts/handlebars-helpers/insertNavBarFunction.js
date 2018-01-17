//this is bad since consolidat.js apstracts away the template engine but we are calling
//   it directly here. But this is needed to beable to make the string show as html.
var Handlebars = require('handlebars')

module.exports = function(mainpages, subpages) {

    var return_html = "";

    return_html += '<ul class="main-nav">\n'

    //loop through collection and create the nav bar
    for (var index=0; index < mainpages.length; index++) {

        var datum = mainpages[index];

        //add sub pages to drop down navigation menu
        if (subpages.sortedByMainPage[datum.title]) {
            return_html += '<li class="dropdown"><a href="/'+datum.path+'">'+datum.navTitle+'</a>\n'

            //add the sub-menu opening tag
            return_html += '<ul class="sub-nav">'

            for (subpage in subpages.sortedByMainPage[datum.title]) {
                subpage = subpages.sortedByMainPage[datum.title][subpage]

                return_html += '<li><a href="/'+subpage.path+'">'+subpage.navTitle+'</a></li>\n'
            }

            return_html += '</ul>\n'

        } else {
            return_html += '<li><a href="/'+datum.path+'">'+datum.navTitle+'</a>\n'
        }

        return_html += '</li>\n' //close out main nav button line tag

        //insert logo near the middle
        if (index+1 == Math.floor(mainpages.length/2) ) {
            
            return_html += '<li class="small-logo"><a href="/"><img src="/images/small-logo.png" alt=""></a></li>\n'
        }

    }
    
    return_html += '</ul>\n'

    return new Handlebars.SafeString(return_html)

}
