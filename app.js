var express=require('express');
var app=express();
var bodyParser = require('body-parser');
var route=require('./route');
var config=require('./config');
var cookieParser=require('cookie-parser');
var session=require('express-session');


app.set('views','./views');
app.set('view engine','ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser());
app.use(cookieParser('userid'));
app.use(session({
  secret: 'express is powerful'
}));



var server = app.listen(config.server.port,function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});

route(app);