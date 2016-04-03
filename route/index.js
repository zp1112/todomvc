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
var Joi = require('joi');


var userschema=Joi.object().keys({
  username: Joi.string().alphanum().min(2).max(32),
  password:Joi.string().min(6).max(32)
})

module.exports = function (app) {
  app.get('/register',function (req,res) {
    res.render('register');
  })
  
  app.post('/doregister',function (req,res) {
    var username=req.body.username;
    var password=req.body.password;
    Joi.validate({username:username,password:password},userschema,function (err,value) {
      if(err){
        req.session.error=new RegExp("password").test(err.message)?'密码格式不对':'用户名格式不对';
          return res.redirect('/register');
      }else {
        client.get(username).then(function (result) {
        if(result){
          req.session.error='用户已存在';
          return res.redirect('/register');
        }else{
          client.setuser(username, password).then(function (result) {
            req.session.success='注册成功';
            res.redirect('/login');
          }).catch(function (err) {
            console.error(err);
          });//db2
        }
      })
      }
    })
  })
  app.get('/', filter.authorize,function (req, res) {
    var user=req.session.user_id;
    
    model.listTask(user).then(function (result) {
      res.render('index', {
        tasks: result
      });
    }).catch(function(err) {
        console.error(err);
    });
  });
  
  app.get('/login',function (req,res) {
    res.render('login');
  });
  app.post('/dologin',function (req,res) {
    var username=req.body.username;
    var pwd=req.body.password;
    client.get2('user:'+username).then(function (result,err) {
      if(!result.username){
        req.session.error='用户不存在';
          return res.redirect('/login');
      }
      else if(result.password!==pwd){
        req.session.error='密码不正确';
        res.redirect('/login');
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