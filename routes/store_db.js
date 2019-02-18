var mysql = require('mysql');
global.db_store = '';

function connectDatabase() {
    if (!db_store) {
        db_store = connection = mysql.createConnection({
            host     : 'localhost',
            user     : 'root',
            password : 'mariadb',
            database : 'web'
          });

        db_store.connect(function(err){
            if(!err) {
                console.log('Database is connected to web!');
            } else {
                console.log('Error connecting database!');
            }
        });
    }
}

module.exports = connectDatabase;
