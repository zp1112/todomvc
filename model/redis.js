var redis = require('redis');
var common = require('../common/common');
var config=require('../config/index');

var client = redis.createClient({
  port: config.redis.port
});

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
exports.get = get;

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

exports.list = function () {
  var defer = common.getDefer();
  client.keys('task:*', function (err, res) {
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