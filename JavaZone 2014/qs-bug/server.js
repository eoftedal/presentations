var qs = require("qs");
var http = require('http');
var URL = require("url");


http.createServer(function (req, res) {
  var u = URL.parse(req.url);
  console.log(req.url);
  var a = qs.parse(u.search.substring(1));
  console.log(JSON.stringify(a));
  //console.log(qs.parse(u.search));
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end("Hello world\n");
}).listen(9615);
