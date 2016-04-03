module.exports={
  redis:{
    port:6380
  },
  server:{
    port:3000
  },
  user:{
    candy:{
      username:"candy",
      password:111111
    },
    willin:{
      username:"willin",
      password:222222
    }}
};
global.redirectFunc = function (res) {
  res.writeHeader(302, {
    Location: '/'
  });
  res.end();
};