var redis = require('redis');
var common = require('../common/index');
var config=require('../config/index');
var uuid = require('node-uuid');

var client = redis.createClient({
  port: config.redis.port,
  db:1
});
var client2 = redis.createClient({
  port: config.redis.port,
  db:2
});
exports.setuser=function (username,password) {
  var defer = common.getDefer();
  client2.set('user:'+username,JSON.stringify({username:username,password:password}),function (err,res) {
    if(err){
      defer.reject(err);
    }
    defer.resolve(res);
  });
  return defer.promise;
}


exports.set = function (key, val) {
  var defer = common.getDefer();
  client.set(key, JSON.stringify(val), function (err, res) {
    if (err) {
      defer.reject(err);
    }
    defer.resolve(res);
  });
  return defer.promise;
};

var get = function (key) {
  var defer = common.getDefer();
  client.get(key, function (err, res) {
    if (err) {
      defer.reject(err);
    }
    defer.resolve(JSON.parse(res || '{}'));
  });
  return defer.promise;
};
var get2 = function (key) {
  var defer = common.getDefer();
  client2.get(key, function (err, res) {
    if (err) {
      defer.reject(err);
    }
    defer.resolve(JSON.parse(res || '{}'));
  });
  return defer.promise;
};
exports.get = get;
exports.get2 = get2;

exports.delete = function (key) {
  var defer = common.getDefer();
  client.expire(key, 0, function (err, res) {
    if (err) {
      defer.reject(err);
    }
    defer.resolve(res);
  });
  return defer.promise;
};

exports.list = function (user) {
  var defer = common.getDefer();
  client.keys(user+':*', function (err, res) {
    res.sort();
    if (err) {
      defer.reject(err);
    }
    var promise = Promise.resolve(null);
    var result = {};
// db.keys('session:*',  result=>['session:1','session:2'])
// for() db.get() => result['1'] = value2 result['2']=value2
    for (var index in res) {
      var tempKey = res[index];
      (function (tempKey) {
        promise = promise.then(function () {
          return get(tempKey).then(function (val) {
            result[tempKey] = val;
          });
        });
      })(tempKey);
    }
    promise.then(function () {
      defer.resolve(result);
    }).catch(function (err) {
      defer.reject(err);
    });
  });
  return defer.promise;
};