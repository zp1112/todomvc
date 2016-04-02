/**
 * Created by Willin on 2016-4-1.
 */
global.editState = false;
global.redirectFunc = function (res) {
  res.writeHeader(302, {
    Location: '/'
  });
  res.end();
};

var model = require('../model/model');
var format=require('date-format');

module.exports = function (app) {
  app.get('/', function (req, res) {
    model.listTask().then(function (result) {
      // console.log(result);
      res.render('index', {
        tasks: result
      }).catch(function (err) {
        console.error(err);
      })
    });
  })

  app.post('/task', function (req, res) {
    var title = req.body.title;
    var time=format('yyyy-MM-dd hh:mm',new Date());
    model.addTask(title,time).then(redirectFunc(res)).catch(function (err) {
      console.error(err);
    });
  })

  app.get('/task/(:id)/finish', function (req, res) {
    var tid = req.params.id;
    model.finishTask('task:' + tid).then(redirectFunc(res)).catch(function (err) {
      console.error(err);
    });
  })

  app.get('/task/(:id)/unfinish', function (req, res) {
    var tid = req.params.id;
    model.unfinishTask('task:' + tid).then(redirectFunc(res)).catch(function (err) {
      console.error(err);
    })
  })

  app.get('/task/:id/delete', function (req, res) {
    var tid = req.params.id;
    model.deleteTask('task:' + tid).then(redirectFunc(res)).catch(function (err) {
      console.error(err);
    })
  })

  app.post('/task/(:id)/edit', function (req, res) {
    var key=req.params.id;
    var title=req.body.title;
;    model.editTask('task:' +key,title).then(redirectFunc(res)).catch(function (err) {
      console.error(err);
    })
  });
  
}