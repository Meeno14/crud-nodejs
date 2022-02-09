//use path module
const path = require('path');
//use express module
const express = require('express');
//use ejs view engine
const ejs = require('ejs');
//use bodyParser middleware
const bodyParser = require('body-parser');
//use mysql database
const mysql = require('mysql');
const app = express();

//konfigurasi koneksi
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_express'
});

//connect ke database
conn.connect((err) => {
  if (err) throw err;
  console.log('Mysql Connected...');
});

//set views file
app.set('views', path.join(__dirname, 'views'));
//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//set folder public sebagai static folder untuk static file
app.use('/assets', express.static(__dirname + '/public'));

//route untuk homepage
app.get('/', (req, res) => {
  let sql = "select * from users";
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.render('users', {
      results: results
    });
  });
});

//route untuk insert data
app.post('/save', (req, res) => {
  let data = { nama: req.body.nama, tgl_lahir: req.body.tgl_lahir };
  let sql = "insert INTO users SET ?";
  let query = conn.query(sql, data, (err, results) => {
    if (err) throw err;
    res.redirect('/');
  });
});

//route untuk update data
app.post('/update', (req, res) => {
  console.log(req.body)
  let sql = `update users set nama = "${req.body.nama}", tgl_lahir = "${req.body.tgl_lahir}" where id = ${req.body.id}`
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.redirect('/');
  });
});

//route untuk delete data
app.post('/delete', (req, res) => {
  let sql = "delete from users where id=" + req.body.id + "";
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.redirect('/');
  });
});

//server listening
app.listen(8000, () => {
  console.log('Server is running at port 8000');
});