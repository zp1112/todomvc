/**
 * Created by Willin on 2016-4-3.
 */
exports.authorize = function(req, res, next) {
  if (!req.session.user_id) {
    res.redirect('/login');
  } else {
    next();
  }
}


