var express = require('express');
var router = express.Router();
var Kullanıcılar = require('../models/user');

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
  return res.send('Logged In!');
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
      var kullanıcıVerisi = {
        email: req.body.email,
        name: req.body.name,
        favoriteBook: req.body.favoriteBook,
        password: req.body.password
      }
      // Oluşturduğumuz dökümanı mongo veritabanına yerleştirelim
      Kullanıcılar.create(kullanıcıVerisi, (error, kullanıcı) => {
        if (error) {
          return next(error);
        } else {
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
