var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var config = require('../config'); // get config file

exports.register = function(req, res){
   message = '';
   if(req.method == "POST"){ //verifier si l'user n'exist pas deja
      var post  = req.body;
      var name= post.user_name;

      var hashedPassword = bcrypt.hashSync(post.password, 8);

      console.log("LE PASSWORD HASHER => " + hashedPassword);
      var sql = "INSERT INTO `users`(`user_name`, `password`) VALUES ('" + name + "','" + hashedPassword + "')";

      var query = db_store.query(sql, function(err, result) {
         message = "Succesfully! Your account has been created.";
         res.render('index.ejs',{message: message});
         });
   } else {
      res.render('register');
   }
};
 
exports.login = function(req, res){
   var message = '';
   var sess = req.session; 

   if(req.method == "POST"){
      var post  = req.body;
      var name= post.user_name;
      var pass= post.password;
      let result = {};
      let status = 200;
      var sql="SELECT * FROM users WHERE user_name = '" + name + "'";

      console.log("NAME : " + name + "   PASS : " + pass);
      db_store.query(sql, function(err, results){
         console.log("RESULT : " + results);
         if(results != undefined && results.length){
            var passwordIsValid = bcrypt.compareSync(pass, results[0].password);
            if (!passwordIsValid) {
               message = 'Wrong Credentials.';
               res.render('index.ejs',{message: message});
            }

            /*const payload = { user: name };
            const options = { expiresIn: '2d', issuer: 'https://scotch.io' };
            const secret = config.secret;
            const token = jwt.sign(payload, secret, options);

            // console.log('TOKEN', token);
            result.token = token;
            result.status = status;
            result.result = results;
            res.status(status).send(result);*/
            req.session.userId = results[0].id;
            req.session.user = results[0];
            console.log(results[0].id);
            res.redirect('/list');
         }
         else{
            message = 'Wrong Credentials.';
            res.render('index.ejs',{message: message});
         }
      });
   } else {
      res.render('index.ejs',{message: message});
   }       
};


exports.loginAPI = function(req, res){
   var message = 'Wrong Credentials.';
   var sess = req.session; 

   if(req.method == "POST"){
      var post  = req.body;
      var name= post.user_name;
      var pass= post.password;
      let result = {};
      let status = 200;
      var sql="SELECT * FROM users WHERE user_name = '" + name + "'";

      console.log("NAME : " + name + "   PASS : " + pass);
      db_store.query(sql, function(err, results){
         console.log("RESULT : " + results);
         if(results != undefined && results.length){
            var passwordIsValid = bcrypt.compareSync(pass, results[0].password);
            if (!passwordIsValid) {
               res.status(404).send(message);
            }

            const payload = { user: name };
            const options = { expiresIn: '2d', issuer: 'localhost' };
            const secret = config.secret;
            const token = jwt.sign(payload, secret, options);

            result.token = token;
            result.status = status;
            result.result = results;
            res.status(status).send(result);
         }
         else{
            res.status(404).send(message);
         }
      });
   } else {
      res.status(404).send(message);
   }       
};

exports.logout=function(req,res){
   req.session.destroy(function(err) {
      res.redirect("/login");
   })
};