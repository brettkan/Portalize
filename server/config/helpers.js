var jwt = require('jsonwebtoken');

module.exports = {

  checkAuth: function(req, res, next){
    console.log('You are trying to access a protected route.');
    var token = req.query.token;

    if( token ){
      jwt.verify(token, 'disdasecretyo', function(err, decoded){
        if( err ){
          return res.json({ success: false, message: 'Failed to authenticate token.' });
        } else {
          req.decoded = decoded; // if everything is good, then save to request for use in other routes
          next();
        }
      });
    } else { // if there is no token then return an error
      return res.status(403).send({
        success: false,
        message: 'No token provided'
      });
    }
  },

  // errorLogger: function(err, req, res, next){
  //   // log the error then send it to the next middleware in
  //   // middleware.js
  //   console.err(err.stack);
  //   next(err);
  // },
  //
  // errorHandler: function(err, req, res, next){
  //   // log the error then send it to the next middleware in
  //   // middleware.js
  //   console.error(err.stack);
  //   next(err);
  // }

};