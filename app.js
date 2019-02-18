var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/users')
  , http = require('http')
  , path = require('path');
const fileUpload = require('express-fileupload');

var session = require('express-session');
var app = express();
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');

//middleware
const validateToken = require('./middleware').validateToken;


/*DataBase connection */
const connectDatabase = require('./routes/store_db');
connectDatabase();

/*Road gestion*/
const {getHomePage} = require('./routes/values');
const {addStorePage: addstorePage, addStore: addStore, deleteStore,
   editStore: editStore, editStorePage: editstorePage, getKv: getKv,
   getKvById: getKvById, postKvById: postKvById, deleteKvById: deleteKvById} = require('./routes/store');

// all environments
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload()); // configure fileupload
app.use(session({
              secret: '4242 secretkey',
              resave: false,
              saveUninitialized: true,
              cookie: { maxAge: 600000 } //60000
            }))
app.use(cookieParser());

//for the user
app.get('/', getHomePage);
app.get('/register', user.register);
app.post('/register', user.register);
app.get('/login', routes.index);
app.post('/login', user.login);
app.get('/list', getHomePage);
app.get('/logout', user.logout);
app.get('/about', function(req, res) {
  res.render('about.ejs', );
});

//postman road
app.get('/api/kv', validateToken, getKv);
app.get('/api/kv/:key', validateToken, getKvById);
app.post('/api/kv/:key', validateToken, postKvById);
app.put('/api/kv/:key', validateToken, postKvById);
app.delete('/api/kv/:key', validateToken, deleteKvById);
app.post('/api/login', user.loginAPI);

//button
app.get('/add', addstorePage);
app.get('/edit/:id', editstorePage);
app.get('/api/:id', deleteStore);
app.post('/add', addStore);
app.post('/edit/:id', editStore);
//app.delete('/api/:id', deleteStore);

app.listen(8081)
console.log("Listen on port 8080");

//<a href="/edit/<%= st.id %>" rel="noopener" class="btn btn-sm btn-success">Edit</a>-->
//<a href="/api/<%= st.id %>" class="btn btn-sm btn-danger" onclick="myFunction()" >Delete</a>-->
