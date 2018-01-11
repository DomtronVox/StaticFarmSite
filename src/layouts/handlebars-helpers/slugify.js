//this is bad since consolidat.js apstracts away the template engine but we are calling
//   it directly here. But this is needed to beable to make the string show as html.
var Handlebars = require('handlebars')


//converts strings to url slug form (all lowercase, spaces represented by dashes (-) )
var slugify = require('slugify');

module.exports = function (str){
  return new Handlebars.SafeString( slugify( str.toLowerCase() ) )
}
