var express = require('express');
var router = express.Router();

const { Pool, Client } = require('pg')
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'news',
  password: 'a054980a',
  port: 5432,
})

router.get('/', function(req, res, next) {
});

router.get('/testView', function(req, res, next) {
  //   // Website you wish to allow to connect
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

  // // Request methods you wish to allow
  // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // // Request headers you wish to allow
  // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // // Set to true if you need the website to include cookies in the requests sent
  // // to the API (e.g. in case you use sessions)
  // res.setHeader('Access-Control-Allow-Credentials', true);
  pool.query('SELECT * FROM news', (err, response) => {
    if(err){
      console.log(err)
    }
    else {
      res.send(response.rows)
    }
  })
});

router.get('/userContact', function(req, res, next) {
  res.render('userContact', {})
});

router.post('/userContact',function(req,res,next) {
  var user_name = req.body.user_name,
      user_email = req.body.user_email,
      user_phone = req.body.user_phone,
      user_message = req.body.user_message
  
  pool.query("INSERT INTO user_contact (user_name, user_email, user_phone, user_message) values($1,$2,$3,$4)",[user_name, user_email,user_phone,user_message],(err, response) => {
    if(err) {
      res.send(err)
    }else {
      res.send(' da nhan duoc du lieu ' + user_name + user_email + user_phone + user_message)
    }
  })
})

module.exports = router;

