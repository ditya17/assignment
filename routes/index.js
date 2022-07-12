var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var alert = require('alert');

var con = mysql.createPool({
  connectionLimit: 60,
  host: "easylearning.guru",
  user: "kcc_student",
  password: "Kccitm.edu.in1",
  database: "kccStudent"
});

/* GET home page. */
router.all('/', function(req, res, next) {
  res.render('index');
});

router.all('/log', function(req, res, next) {
  res.render('login');
});

router.all('/abcd', function(req, res, next) {
  res.render('log');
});

router.post('/path', function(req, res) {
	let username = req.body.name;
	let password = req.body.password;
  con.getConnection(function (err, connection) {
	if (username == "Dheeraj" && password == "1234") {
    res.render('index');
  }
  else if (username && password ){
		connection.query('SELECT * FROM nlog WHERE name = ? AND pass = ?', [username, password], function(error, results, fields) {
			if (error) throw error;
			if (results.length > 0) {
				req.session.loggedin = true;
				req.session.username = username;
				res.redirect('/table');
			} else {
				alert('Incorrect Username and/or Password!');
        res.redirect('log')
			}			
			
    });
	} else {
		alert("Please enter Username and Password!");
    res.redirect('log')
	}
});
});



router.post('/register', function(req, res, next) {
  console.log(req.body.nCopy);
  var sql = "INSERT INTO `nregister` (`bname`,`ncopy`,`aname`) \
  VALUES ('"+req.body.book+"','"+req.body.nCopy+"','"+req.body.authname+"');"
  con.getConnection(function (err, connection) {
    connection.query(sql, function (err, result) {
      if (err) throw err;
      console.log(result);
      res.redirect('/table');
    });
  });
});

router.post('/login', function(req, res, next) {
  var sql = "INSERT INTO `nlog` (`name`,`class`,`batch`,`pass`) \
  VALUES ('"+req.body.name+"','"+req.body.class+"','"+req.body.batch+"','"+req.body.password+"');"
  con.getConnection(function (err, connection) {
    connection.query(sql, function (err, result) {
      if (err) throw err;
      console.log(result);
      res.render('login');
    });
  });
});


router.get('/table', function (req, res) {
  con.getConnection(function (err, connection) {
     if (err) throw err;
    connection.query("SELECT * FROM nregister", function (err, data, fields) {
       if (err) throw err;  
      console.log(data);
      res.render('table', { title: 'LibraryDetails', userData: data});
    });
  });
});

router.post('/delete', function (req, res, next) {
  console.log(req.body.id)
  con.query("DELETE FROM nregister where id ="+req.body.id, function (err, data) {
     if (err) res.json({code:0});
    console.log(data);
  //  res.render('table')
     res.json({code:1})
  });
});

module.exports = router;
