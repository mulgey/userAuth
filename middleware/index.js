// Kendi middleware lerimizi yazdığımız atölye bölümümüz

function kardesim (req, res, next) {
    if (req.session && req.session.userId) {
        return res.redirect('/profile');
    }
    return next();
}

function lazım (req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    } else {
        var err = new Error('Buraya herkeşler giremiyor.');
        err.status = 401;
        return next(err);
    }
}

module.exports.yassak = kardesim;
module.exports.kimlik = lazım;