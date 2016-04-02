var model = require('./model/model');
var arr=['10','100','2','3','4'];
arr.sort();
console.log(arr);
// model.addTask('World');

// model.editTast('task:ead3ecb9-88a7-4be6-8da6-57407d3ebc17','Hello World Again');

// model.finishTask('task:ead3ecb9-88a7-4be6-8da6-57407d3ebc17');

// model.unfinishTask('task:ead3ecb9-88a7-4be6-8da6-57407d3ebc17');

// model.deleteTask('task:1ff998b0-0358-485e-a0e8-c1a953076d73');

setTimeout(function(){
  model.listTask().then(function(list){
    console.log(list)
  }).catch(function(err){
    console.error(err);
  });
},1000);