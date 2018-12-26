var express = require('express');
var router = express.Router();
var User = require('../models/user');

// GET /
router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Home' });
});

// GET /about
router.get('/about', function(req, res, next) {
  return res.render('about', { title: 'About' });
});

// GET /contact
router.get('/contact', function(req, res, next) {
  return res.render('contact', { title: 'Contact' });
});

// GET /login
router.get('/login', (req, res, next) => {
  return res.render('login', { title: 'Log In'});
});

// POST /login
router.post('/login', (req, res, next) => {
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, function (error, user) { // User = en üstte tanımladığımız model adı. authenticate = user.js içerisinde tanımladığımız metod.
      if ( error || !user) { // Hata olasılıkların hepsine karşın ...
        var err = new Error('Bilgilerde hata olduğundan eminim');
        err.status = 401;
        return next(err);
      } else { // Buraya kadar sağ salim geldiyse eğer, veritabanındaki ID'sini session ID olarak kaydetmek isteriz. (sunucuda saklanacak)
        req.session.userId = user._id; // req e ulaşabildiğin herhangi bir yerden session bilgisini görebilir ve değiştirebilirsin. Bu arada cookie otomatik olarak oluşur. req.session ın sonuna bir özellik yazıp ID ile eşleştirince = Hem "Session a ekle" hem de "session yoksa oluştur" 
        return res.redirect('/profile'); 
      }
    }); 
  } else {
    var err = new Error("Bilgileri tam olarak verirsen girişini sağlayabilirim");
    err.status= 401;
    return next(err);
  }
});

// GET /register
router.get('/register', (req, res, next) => {
  return res.render('register', { title: 'Sign Up' });
});

// POST /register
router.post('/register', (req, res, next) => {
  // alanlar dolu olsun
  if (req.body.email &&
    req.body.name &&
    req.body.favoriteBook &&
    req.body.password &&
    req.body.confirmPassword) {
      //şifreler eşleşsin
      if (req.body.password !== req.body.confirmPassword) {
        var err = new Error('Şifreler eşleşmiyor');
        err.status = 400;
        return next(err);
      }
      // Herşey yolundaysa form bilgileriyle nesnemizi oluşturalım
      var userData = {
        email: req.body.email,
        name: req.body.name,
        favoriteBook: req.body.favoriteBook,
        password: req.body.password
      }
      // Oluşturduğumuz dökümanı mongo veritabanına yerleştirelim
      User.create(userData, (error, user) => {
        if (error) {
          return next(error);
        } else {
          req.session.kullanıcıID = user._id; // req e ulaşabildiğin herhangi bir yerden session bilgisini görebilir ve değiştirebilirsin. Bu arada cookie otomatik olarak oluşur. req.session ın sonuna bir özellik yazıp ID ile eşleştirince = Hem "Session a ekle" hem de "session yoksa oluştur"
          return res.redirect('/profile');
        }
      })      
    } else {
      var err = new Error('Hepsini dolduralım lütfen')
      err.status = 400;
      return next(err);
    }
});

module.exports = router;
