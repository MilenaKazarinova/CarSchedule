var User = require('../models/user').User;
var Car = require('../models/user').Car;
exports.get = function(req, res) {
    Car.find({}, function(err, cars) {
        res.render('search', {cars: cars});
    });
};