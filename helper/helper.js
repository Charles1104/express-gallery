// Authentification function

function isAuthenticated (req, res, next) {
  console.log('checking');
  if(req.isAuthenticated()) {
    console.log('you are well authenticated');
    next();
  }else {
    console.log('You are not logged in');
    res.redirect('/login');
  }
}

module.exports = isAuthenticated;