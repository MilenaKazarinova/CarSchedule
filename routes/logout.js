exports.post = function(req, res) {
  console.log('sdfsdfsdf');
  req.session.destroy();
  res.redirect('/');
};