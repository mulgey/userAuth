// Giriş bölümü
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// bcryptjs zamanı
var bcryptjs = require('bcryptjs'); // bcrypt sürüm problemleri nedeniyle olmadı ve vakit kaybetmeden bcryptjs e geçiş yaptık

// Çizelge bölümü
var userSchema = new Schema({
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

// Giriş vs Veritabanı, "authenticate" iver
userSchema.statics.authenticate = function(email, password, callback) { //statics nesnesi modele direkt olarak metod eklemeye yarar. Modeli kullandığımız diğer yerlerde bunu kullanabiliriz bu sayede
    User.findOne({email: email}) // email üzerinden bulmaya çalışıyoruz
        .exec(function (error, user) { // "exec" aramayı başlatmaya ve sonuçlarını işlemeye yarar
            if (error) { // hatayı baştan aradan çıkaralım
                return callback(error);
            } else if ( !user ) { // bu özel hata durumu için ayrı bir hata motoru oluşturalım
                var err = new Error('Bu arkadaş bizde kayıtlı değil'); // Şimdilik bu kısım çalışmıyor, vakit olunca iredele
                err.status = 401;
                return callback(err)
            }
            bcryptjs.compare(password, user.password, function (error, result) { // girilen şifre, veritabanındaki bilgi, result: true veya false gelir
                if (result === true) {
                    return callback(null, user) // null, error u temsil eder. Yani = Hata null = hata yok.
               } else {
                   return callback(error); // error u ben ekledim
               }
            })
        })
}

// Veritabanına kaydetmeden önce şifreyi "hash" le
userSchema.pre('save', function (next) { // Öncesinde (pre) kaydet (save) komutuyla kullanıyoruz. Burada kritik nokta:  " (next) => " şeklinde yazamadık, hata veriyor (!)
    var user = this; // "this", user nın formda girdiği bilgiler ile oluşan nesneyi referans gösterir. "user" nesnesini ve bilgilerini temsil eder
    bcryptjs.hash(user.password, 10, (err, hash) => { // "user", yukarıdakiyle aynı. Sayı arttıkça güvenlik artar, sistem yavaşlar. 
        if (err) {
            return next(err);
        }
        user.password = hash; // user şifresini, "hash" lanmışıyla değiştir
        next();
    })
})

var User = mongoose.model('User', userSchema);
module.exports = User;