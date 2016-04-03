var express=require('express');
var app=express();
var bodyParser = require('body-parser');//使用body-parser进行post参数的解析,可获得一个JSON化的req.body
var route=require('./route');
var config=require('./config');
var cookieParser=require('cookie-parser');
var session=require('express-session');


app.set('views','./views');
app.set('view engine','ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser());
app.use(cookieParser());
app.use(session({
  secret: 'express is powerful',
  cookie:{maxAge:30000}
}));

app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  var err = req.session.error;
  var success = req.session.success;
  delete req.session.error;
  delete req.session.success;
  res.locals.message = '';
  if (err)
    res.locals.message = '<div class="alert alert-warning">    ' + err + '</div>';
  else if (success)
    res.locals.message = '<div class="alert alert-success">    ' + success + '</div>';
  next();
});


var server = app.listen(config.server.port,function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});

route(app);