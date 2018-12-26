// let's use express
const express = require('express');
const app = express();

// let's use mongoose and connect it
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/kitapkurdu', { useNewUrlParser: true }); // kitapkurdu kısmı, oluşturduğumuz veritabanına verdiğimiz isim bakımından opsiyonel
const db = mongoose.connection;

// mongoose error stuff
db.on('error', console.error.bind(console, 'connection error:')); // Bu örnekte çalışmadı, ilk fırsatta irdeleyelim

// parse incoming requests
const bodyParser = require('body-parser');
app.use(bodyParser.json()); //json kullanılmış(?)
app.use(bodyParser.urlencoded({ extended: false }));

// We want sessions and cookies
const session = require('express-session');
app.use( session({
  secret: 'NSI Racing', // zorunlu olan tek kısım
  resave: true, // req esnasındaki değişimlerde güncellemeye zorlar
  saveUninitialized: false // başlangıç değeri olmayan session un kaydedilmesine karar verir
}));

// serve static files from /public
app.use(express.static(__dirname + '/public')); // __dirname kullanılmış(?)

// view engine setup
app.set('view engine', 'pug');
app.set('views', __dirname + '/views'); // default zaten views klasörü, gereksiz satır (?)

// include routes
var routes = require('./routes/index'); // index zaten default. /index kısmı muhtemelen gereksiz
app.use('/', routes); // "/" demesek direkt home route olarak çalışırdı(?)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// listen on port 3000
app.listen(3000, () => {
  console.log('Express in kulağı 3000 de, dinliyor');
});
