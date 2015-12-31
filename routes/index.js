var checkAuth = require('../middleware/checkAuth');
var User = require('../models/user').User;
var Schedule = require('../models/user').Schedule;
var Car = require('../models/user').Car;

module.exports = function(app) {

  app.get('/', require('./frontpage').get);

  app.get('/login', require('./login').get);

  app.post('/login', require('./login').post);
    app.get('/signup', require('./signup').get);

    app.post('/signup', require('./signup').post);

  app.post('/logout', require('./logout').post);

  app.get('/editUserInfo', require('./editUserInfo').get);
  app.post('/editUserInfo', require('./editUserInfo').post);

  app.get('/editCarInfo', require('./editCarInfo').get);
  app.post('/editCarInfo', require('./editCarInfo').post);

  app.get('/search', require('./search').get);
  app.get('/yourCar/:id', function(req, res, next) {
    var schedule_id = req.params.id ? req.params.id : undefined;
    Schedule.findById({_id: schedule_id}, function(err, item){
      if(err) return next(err);
      item.remove();
      var userid = req.session.user._id;
      var car_id;
      Car.findOne({owner: userid}, function(err, rescar) {
          if (err) return next(err);
          car_id = rescar._id;
          Schedule.find({carid: car_id}, function (err, items) {
              if (err) return next(err);

              yourcar = items;
              res.redirect('/yourCar');
          });
      });
    });
  });

  app.get('/yourCar', function(req, res, next) {
    var userid = req.session.user._id;
    var car_id;
    Car.findOne({owner: userid}, function(err, rescar){
      if(err) return next(err);
      car_id = rescar._id;
      Schedule.find({carid: car_id}, function(err, items){
        if(err) return next(err);
          yourcar = items;
          res.render('yourCar');
      });
    });
  });

  app.post('/mobile/schedule/:carId', function(req, res, next){

    var date = req.body.date;
    var timestart = req.body.timestart;
    var timeend = req.body.timeend;
    var scheduleitem = new Schedule({date: date, timestart: timestart, timeend: timeend, carid: currentcar, username: req.session.user.username});
    scheduleitem.save(function(err) {
      if (err) {
        console.log(err);
      } else {
          var car_id = req.params.carId ? req.params.carId : undefined;
          currentcar = car_id;
          Schedule.find({carid: car_id}, function(err, docs){
              if(err) {
                  return next(err);
              } else {
                  carsschedule = docs;
                  res.redirect('/schedule');
              }
          });
      }
    });

  });
    app.get('/schedule', require('./schedule').get );
  app.get('/schedule/:carId', function(req, res, next){
    console.log('1');
    var car_id = req.params.carId ? req.params.carId : undefined;
    currentcar = car_id;
    Schedule.find({carid: car_id}, function(err, docs){
      if(err) {
          return next(err);
      } else {
          console.log('2');
carsschedule = docs;
          res.redirect('/schedule');
          }

      console.log('4');
    });
  });
};

