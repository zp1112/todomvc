/**
 * Created by Willin on 2016-4-3.
 */
exports.authorize = function(req, res, next) {
  if (!req.session.user_id) {
    req.session.error = '请登录';
    res.redirect('/login');
  } else {
    next();
  }
}
exports.notAuthentication =function (req, res, next) {
  if (req.session.user) {
    req.session.error = '已登录';
    return res.redirect('/');
  }
  next();
}


