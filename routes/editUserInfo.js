var User = require('../models/user').User;
var express = require('express');
var mongoose = require('../lib/mongoose');
exports.get = function(req, res) {
    res.render('editUserInfo');
};

exports.post = function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var fullname = req.body.fullname;



        User.findOneAndUpdate({ _id: req.session.user._id }, {email: email, username:username, fullname: fullname}, function(err, todo) {
        });
    res.render('editUserInfo');
};