var User = require('../models/user').User;
var Car = require('../models/user').Car;
exports.get = function(req, res) {
    var userid = req.session.user._id;

    console.log(userid);
    var car;

    Car.findOne({owner: userid}, function (err, car) {
        if (err) return next(err);
        if (car) {
            console.log(car);
            car = car;
        }
        res.render('editCarInfo', {
            car: car
        });
    });
};
exports.post = function(req, res) {

    var identifier = req.body.identifier_car;
    var class_car = req.body.class_car;
    var color = req.body.color_car;
    var model = req.body.model_car;
    var mark = req.body.mark_car;
        Car.updateuserscar(req.session.user._id,identifier,color,model,mark,class_car, function(err, car){
            res.send({});
            //res.render('editCarInfo');
        });



};