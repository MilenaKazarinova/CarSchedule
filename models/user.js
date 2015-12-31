var crypto = require('crypto');
var async = require('async');
var util = require('util');

var mongoose = require('../lib/mongoose'),
  Schema = mongoose.Schema;
var Car = new Schema({
    identifier: {
        type: String,
        required: true
    },
    class: {
        type: String
    },
    color: {
        type: String
    },
    model: {
        type: String
    },
    mark: {
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId
    }
});
var User = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  fullname: {
    type: String
  },
  hashedPassword: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  email: {
    type: String
  }
});
var Schedule = new Schema({
    date: {
        type: String
    },
    timestart: {
        type: String
    },
    timeend: {
        type: String
    },
    carid: {
        type: mongoose.Schema.Types.ObjectId
    },
    username: {
        type: String
    }
});



User.methods.encryptPassword = function(password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

User.virtual('password')
  .set(function(password) {
    this._plainPassword = password;
    this.salt = Math.random() + '';
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() { return this._plainPassword; });


User.methods.checkPassword = function(password) {
  return this.encryptPassword(password) === this.hashedPassword;
};



Car.statics.updateuserscar = function(user, identifier, color, model, mark, class_car, callback) {
    var car = this;
    var user1 = mongoose.model('User');
    async.waterfall([
        function (callback) {
            car.findOne({owner: user}, callback);
        },
        function (car3, callback) {
            if(car3){
                car.findByIdAndUpdate({_id: car3._id}, {identifier: identifier, color: color, model: model, mark: mark, class: class_car}, function(err, car4){
                    if (err){
                        return callback(err);}
                    callback(null, car4);
                });
            } else {
                var car2 = new car({identifier: identifier, color: color, model: model, mark: mark, class: class_car, owner: user});
                car2.save(function(err) {
                    if (err){
                        return callback(err);}
                    callback(null, car);
                });
            }
        }
    ], callback);
};
User.statics.authorize = function(username, password, callback) {
  var User = this;

  async.waterfall([
    function(callback) {
      User.findOne({username: username}, callback);
    },
    function(user, callback) {
      if (user) {
        if (user.checkPassword(password)) {
          callback(null, user);
        } else {
          callback(new AuthError("Пароль неверен"));
        }
      } else {
        var user = new User({username: username, password: password});
        user.save(function(err) {
          if (err){
            return callback(err);}
          callback(null, user);
        });
      }
    }
  ], callback);
};

Car.statics.updatecar = function(identifier, user, color, model, mark, class_car, callback){
    var car2 = this;
    async.waterfall([
        function(callback) {
            car2.findOne({user_id: user}, callback);
        },
        function(car, callback) {
            if (car) {
                if (car.checkIdenifier(identifier, user)) {
                    callback(null, car);
                    console.log("Update");
                } else {
                    callback(new AuthError("Автомобиль привязан к другому пользователю"));
                }
            } else {
                var car = new car2({identifier: identifier, user_id: user, color: color, model: model, mark: mark, class: class_car});
                car.save(function(err) {
                    if (err){
                        console.log(err);
                        return callback(err);}
                    console.log("Сохранена");
                    callback(null, car);
                });
            }
        }
    ], callback);
};

exports.Car = mongoose.model('Car', Car);
exports.User = mongoose.model('User', User);
exports.Schedule = mongoose.model('Schedule', Schedule);


function AuthError(message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, AuthError);

  this.message = message;
}

util.inherits(AuthError, Error);

AuthError.prototype.name = 'AuthError';

exports.AuthError = AuthError;


