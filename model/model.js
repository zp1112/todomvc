var uuid = require('node-uuid');
var client = require('./redis');

exports.addTask = function (name,time,user) {
  var value = {
    title: name,
    finished: 0,
    create_at:time
  };
  var key = user+':' + parseInt(new Date() / 1000) + uuid.v4();
  return client.set(key, value);
};

exports.editTask = function (key, name) {
  return client.get(key).then(function (value) {
    value.title = name;
    return client.set(key, value);
  });
};

exports.finishTask = function (key) {
  return client.get(key).then(function (value) {
    value.finished = 1;
    return client.set(key, value);
  });
};

exports.unfinishTask = function (key) {
  return client.get(key).then(function (value) {
    value.finished = 0;
    return client.set(key, value);
  });
};

exports.deleteTask = function (key) {
  return client.delete(key);
};

exports.listTask = function (user) {
  return client.list(user);
};
