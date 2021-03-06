var jwt = require('jsonwebtoken');

module.exports = {

  checkAuth: function(req, res, next){
    console.log('You are trying to access a protected route.');
    var token = req.cookies.accessToken;

    if( token ){
      jwt.verify(token, 'disdasecretyo', function(err, decoded){
        if( err ){
          console.log('The token provided was invalid, redirecting to login.');
          return res.redirect('/');
          // return res.json({ success: false, message: 'Failed to authenticate token.' });
        } else {
          req.decoded = decoded; // if everything is good, then save to request for use in other routes
          console.log('Your token is good to go. You may access protected assets.');
          next();
        }
      });
    } else { // if there is no token then return an error
      // return res.status(403).send({ success: false, message: 'No token provided' });
      console.log('No token provided, redirecting to login.');
      return res.redirect('/');
    }
  },

  createToken: function(user, res){
    var token = jwt.sign(user, 'disdasecretyo', { expiresInMinutes: 20 });
    res.cookie('accessToken', token, { maxAge: 12000000 });
    res.json({ success: "true", message: 'Enjoy your token!' });
  }

};
