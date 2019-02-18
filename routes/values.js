module.exports = {
  getHomePage: (req, res) => {
    var user =  req.session.user,
	userId = req.session.userId;
	
	if(userId == null){
		res.redirect("/login");
		return;
    }
    res.cookie("cookie_name" , 'cookie_value');
    console.log("Cookies expire in : " + req.session.cookie.maxAge / 1000);
    console.log("ID user : " + userId + " user : " + user);
    let query = "SELECT * FROM `store` WHERE id_user = '" + userId + "' ORDER BY id ASC";

    db_store.query(query, (err, result) => {
        if (err) {
            res.redirect('/');
        }
        res.render('list.ejs', {
            title: "List store"
            ,store: result
        });
    });
  },
};