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
var client=require('../model/redis');


var model = require('../model/model');
var format=require('date-format');
var filter=require('../lib/filter');
var config=require('../config');

module.exports = function (app) {
  app.get('/register',function (req,res) {
    res.render('register');
  })
  app.post('/doregister',function (req,res) {
    var username=req.body.username;
    var password=req.body.password;
    if(username!==''&&password!==''){
      client.setuser(username,password);
      res.redirect('/login');
    }
  })
  app.get('/', filter.authorize,function (req, res) {
    var user=req.session.user_id;
    
    model.listTask(user).then(function (result) {
      // console.log(result);
      res.render('index', {
        tasks: result
      }).catch(function (err) {
        console.error(err);
      })
    });
  })
  
  app.get('/login',function (req,res) {
    res.render('login');
  });
  app.post('/dologin',function (req,res) {
    var username=req.body.username;
    var pwd=req.body.password;
    if(!username||(!pwd)){
      throw err;
    }
    client.get2('user:'+username).then(function (result,err) {
      if(!result.username){
        console.log('用户不存在！');
        setTimeout(function () {
          res.redirect('/login');
        },1000)
      }
      else if(result.password!==pwd){
        console.log('密码错误');
        setTimeout(function () {
          res.redirect('/login');
        },1000)
      }
      else{
        req.session.user_id =username;
        req.session.user = result;
        res.redirect("/");
      }
      
    }).catch(function (err) {
      console.error(err);
    });
    // if(config.user[username]&&pwd==config.user[username].password){
    //   req.session.user_id =username;
    //   req.session.user = config.user[username];
    //   res.redirect("/");
    // }
  });
  app.get('/logout',function (req,res) {
    res.clearCookie('userid');
    req.user = null;

    req.session.regenerate(function(){
      //重新生成session之后后续的处理
      res.redirect('/login');
    })
  })

  app.post('/task', filter.authorize,function (req, res) {
    var title = req.body.title;
    var time=format('yyyy-MM-dd hh:mm',new Date());
    var user=req.session.user_id;
    model.addTask(title,time,user).then(redirectFunc(res)).catch(function (err) {
      console.error(err);
    });
  })

  app.get('/task/(:id)/finish', filter.authorize,function (req, res) {
    var tid = req.params.id;
    model.finishTask(tid.replace('_',':')).then(redirectFunc(res)).catch(function (err) {
      console.error(err);
    });
  })

  app.get('/task/(:id)/unfinish', filter.authorize,function (req, res) {
    var tid = req.params.id;
    model.unfinishTask(tid.replace('_',':')).then(redirectFunc(res)).catch(function (err) {
      console.error(err);
    })
  })

  app.get('/task/:id/delete', filter.authorize,function (req, res) {
    var tid = req.params.id;
    model.deleteTask(tid.replace('_',':')).then(redirectFunc(res)).catch(function (err) {
      console.error(err);
    })
  })

  app.post('/task/(:id)/edit', filter.authorize,function (req, res) {
    var tid=req.params.id;
    var title=req.body.title;
;    model.editTask(tid.replace('_',':'),title).then(redirectFunc(res)).catch(function (err) {
      console.error(err);
    })
  });
  
}