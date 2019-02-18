const jwt = require('jsonwebtoken');
var config = require('./config'); // get config file

module.exports = {
  validateToken: (req, res, next) => {
    const authorizationHeaader = req.headers.authorization;
    let result;
    if (authorizationHeaader) {
      const token = req.headers.authorization.split(' ')[1]; // Bearer <token>
      console.log("TRUC : " + token);
      const options = {
        expiresIn: '2d',
        issuer: 'localhost'
      };
      try {
        // verify makes sure that the token hasn't expired and has been issued by us
        result = jwt.verify(token, config.secret, options);
        console.log("RESULTED : " + result);
        // Let's pass back the decoded token to the request object
        req.decoded = result;
        console.log("DECODE : " + req.decoded);
        // We call next to pass execution to the subsequent middleware
        next();
      } catch (err) {
        // Throw an error just in case anything goes wrong with verification
        console.log("ERROR during verification");
        throw new Error(err);
      }
    } else {
      result = { 
        error: `Authentication error. Token required.`,
        status: 401
      };
      res.status(401).send(result);
    }
  }
};