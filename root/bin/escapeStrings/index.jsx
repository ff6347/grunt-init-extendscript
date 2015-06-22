// this is called by grunt and not by you
var fs = require("fs");
var jsesc = require('jsesc');
fs.readFile("src/help.txt", "utf8", function(err, data) {
  if (err) return;
  var res = jsesc(data, {
    'quotes': 'double'
  });
  console.log(res);
  fs.writeFile("src/help.jsx", "settings.helptext = \"" + res + "\";", "utf8", function(err, data) {
    if (err) return;
    console.log(data);

  });
});