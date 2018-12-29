// Kendi middleware lerimizi yazdığımız atölye bölümümüz

function kardesim (req, res, next) {
    if (req.session && req.session.userId) {
        return res.redirect('/profile');
    }
    return next();
}

module.exports.yassak = kardesim;