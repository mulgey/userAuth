// Giriş bölümü
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Çizelge bölümü
var kullanıcıŞeması = new Schema({
    email: {
        type: String,
        unique: true, // veritabanında daha önceden kayıtlı olmayan
        required: true, // mutlaka olmalı
        trim: true // içerisindeki boşlukları ortadan kaldırır
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    favouriteBook: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
});

var Kullanıcı = mongoose.model('Kullanıcı', kullanıcıŞeması);
module.exports = Kullanıcı;