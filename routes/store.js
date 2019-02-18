const fs = require('fs');

module.exports = {
    addStorePage: (req, res) => {
        res.render('add-store.ejs', {
            title: "Add a new store"
            ,message: ''
        });
    },
    getKv: (req, res) => {
        let query = "SELECT * FROM `store` ORDER BY id ASC";
    
        db_store.query(query, (err, result) => {
            if (err) {
                console.log("Error /api/kv");
                res.redirect('/list');
            }
            res.send(JSON.stringify(result));
        });
    },
    getKvById: (req, res) => {    
        let key = req.params.key;
        let query = "SELECT * FROM `store` WHERE key_name = '" + key + "'";
    
        db_store.query(query, (err, result) => {
            if (err || result.length <= 0) {
                console.log("Error /api/kv/:key : " + key);
                res.redirect('/list');
                return;
            }
            console.log("RESULT ---> " + result[0].value_name);
            res.send(result[0].value_name);
        });
    },
    /**
     * <---------POST--------->
     */
    postKvById: (req, res) => {    
        let key = req.params.key;
        let value = req.body.value;
        var message = 'Wrong Credentials.';
        let query = "SELECT * FROM `store` WHERE key_name = '" + key + "'";

        console.log("Key --> " + req.params.key + "  | BODY : " + req.body.value);
        db_store.query(query, (err, result) => {
            if (err) {
                console.log("Error POST /api/kv/:key : " + key);
                res.status(404).send(message);
//                res.redirect('/list');
                //return;
            }
            if (result.length > 0) {
                console.log("POST /api/kv/:key  Already exist: " + key);
                query = "UPDATE store SET value_name = '" + value + "' WHERE key_name='" + key + "'";
            }
            else {
                console.log("POST /api/kv/:key  Doesn't exist: " + key);
                query = "INSERT INTO `store` (key_name, value_name, id_user) VALUES ('" + key + "', '" + value + "', '" + 4242 + "')";
            }
            db_store.query(query, (err, result) => {
                if (err) {
                    res.status(404).send(message);
                    //return res.status(500).send(err);
                }
                res.status(200).send("Your query has been insert");
            });
            //res.status(404).send(message);
            //res.redirect('/list');
        });
    },
    addStore: (req, res) => {
        userId = req.session.userId;

        if(userId == null){
            res.redirect("/login");
            return;
        }

        let message = '';
        let key = req.body.key;
        let value = req.body.value;
        console.log("NAME : " + key + "  value : " + value);
        let usernameQuery = "SELECT * FROM `store` WHERE key_name = '" + key + "' && id_user = '" + req.session.userId + "'";
        //let usernameQuery = "SELECT * FROM `store` WHERE key_name = '" + key + "'";
    
        db_store.query(usernameQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0 ) {
                message = 'Key already exists';
                res.render('add-store.ejs', {
                    message,
                    title: "Add a new store"
                });
            } else {
                let query = "INSERT INTO `store` (key_name, value_name, id_user) VALUES ('" + key + "', '" + value + "', '" + userId + "')";
                db_store.query(query, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    //res.redirect('/list');
                });
            }
        });
    },
    editStorePage: (req, res) => {
        let storeId = req.params.id;
        let query = "SELECT * FROM `store` WHERE id = '" + storeId + "' ";
        
        console.log("Edit store page : " + storeId);
        db_store.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            console.log("Res : ");
            res.render('edit-store.ejs', {
                title: "Edit  store"
                ,store: result[0]
                ,message: ''
            });
        });
    },
    editStore: (req, res) => {
        let storeId = req.params.id;
        let key = req.body.key;
        let value = req.body.value;

        console.log("EDIT ----> Key : " + key + "  value : " + value);
        let query = "UPDATE `store` SET `key_name` = '" + key + "', `value_name` = '" + value + "' WHERE `store`.`id` = '" + storeId + "'";
        
        db_store.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            //res.redirect('/list');
        });
    },
    deleteKvById: (req, res) => {
        let key_name = req.params.key;
        let deleteUserQuery = 'DELETE FROM store WHERE key_name = "' + key_name + '"';
        
        console.log("Delete --> key_name : " + key_name);
        db_store.query(deleteUserQuery, (err, result) => {
            if (err) {
                res.status(404).send("Error with delete");
//                return res.status(500).send(err);
            }
        });
        res.status(200).send("Your query has been deleted");
        //req.method = 'GET';
        //res.status(400);
        //res.redirect('/list');
    },
    deleteStore: (req, res) => {
        let storeId = req.params.id;
        let key_name = req.params.key;
        let deleteUserQuery = 'DELETE FROM store WHERE id = "' + storeId + '"';

        console.log("DeleteStore --> key_name : " + key_name);
        db_store.query(deleteUserQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            //res.redirect('/list');
            return res.status(400);
        });
        console.log("quit deleteStore");
    }
};