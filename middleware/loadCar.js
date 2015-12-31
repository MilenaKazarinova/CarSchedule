var Car = require('../models/user').Car;

module.exports = function(req, res, next) {
    req.car = res.locals.car = null;
    if (!req.session.car) return next();

    Car.findById(req.session.car, function(err, car) {
        if (err) return next(err);

        req.car = res.locals.car = car;
        next();
    });
};