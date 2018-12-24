// Giriş bölümü
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// bcryptjs zamanı
var bcryptjs = require('bcryptjs'); // bcrypt sürüm problemleri nedeniyle olmadı ve vakit kaybetmeden bcryptjs e geçiş yaptık

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
    favoriteBook: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
});

// Veritabanına kaydetmeden önce şifreyi "hash" le
kullanıcıŞeması.pre('save', function (next) { // Öncesinde (pre) kaydet (save) komutuyla kullanıyoruz. Burada kritik nokta:  " (next) => " şeklinde yazamadık, hata veriyor (!)
    var kullanıcı = this; // "this", kullanıcı nın formda girdiği bilgiler ile oluşan nesneyi referans gösterir. "kullanıcı" nesnesini ve bilgilerini temsil eder
    bcryptjs.hash(kullanıcı.password, 10, (err, hash) => { // "kullanıcı", yukarıdakiyle aynı. Sayı arttıkça güvenlik artar, sistem yavaşlar. 
        if (err) {
            return next(err);
        }
        kullanıcı.password = hash; // kullanıcı şifresini, "hash" lanmışıyla değiştir
        next();
    })
})

var Kullanıcı = mongoose.model('Kullanıcılar', kullanıcıŞeması);
module.exports = Kullanıcı;