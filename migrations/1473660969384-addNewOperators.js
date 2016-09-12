'use strict';
require('../config/db');
var express = require('express');
var mongoose = require('mongoose');
var Users = mongoose.model('Collection_Users');
var Roles = mongoose.model('Collection_Roles');

exports.up = function (next) {
    console.log('roles');
    Roles.findOne({"role_name": 'operator'}, function (err, role) {
        if (err) {
            next(err);
        }
        var user = new Users({
            "username": "Mike	Dollarhide",
            "firstname": "Mike",
            "lastname": "Dollarhide",
            "email": "mike.dollarhide@prysmiangroup.com",
            "password": "operator123",
            "status": 1,
            "userrole": role._id,
        });
        user.save();
        console.log('Mike	Dollarhide');
        var user = new Users({
            "username": "Scott Theroux",
            "firstname": "Scott",
            "lastname": "Theroux",
            "email": "scott.theroux@prysmiangroup.com",
            "password": "operator123",
            "status": 1,
            "userrole": role._id,
        });
        user.save();
        console.log('Scott Theroux');
        var user = new Users({
            "username": "James White",
            "firstname": "James",
            "lastname": "White",
            "email": "james.white@prysmiangroup.com",
            "password": "operator123",
            "status": 1,
            "userrole": role._id,
        });
        user.save();
        console.log('James White');
        var user = new Users({
            "username": "Stephen Falk",
            "firstname": "Stephen",
            "lastname": "Falk",
            "email": "stephen.falk@prysmiangroup.com",
            "password": "operator123",
            "status": 1,
            "userrole": role._id,
        });
        user.save();
        console.log('Stephen Falk');
        var user = new Users({
            "username": "Matthew Beaty",
            "firstname": "Matthew",
            "lastname": "Beaty",
            "email": "matthew.beaty@prysmiangroup.com",
            "password": "operator123",
            "status": 1,
            "userrole": role._id,
        });
        user.save();
        console.log('Matthew Beaty');
        var user = new Users({
            "username": "Richard Rounds",
            "firstname": "Richard",
            "lastname": "Rounds",
            "email": "richard.rounds@prysmiangroup.com",
            "password": "operator123",
            "status": 1,
            "userrole": role._id,
        });
        user.save();
        console.log('Richard Rounds');
        var user = new Users({
            "username": "Peter Medeiros",
            "firstname": "Peter",
            "lastname": "Medeiros",
            "email": "peter.medeiros@prysmiangroup.com",
            "password": "operator123",
            "status": 1,
            "userrole": role._id,
        });
        user.save();
        console.log('Peter Medeiros');
        var user = new Users({
            "username": "Michael Silva",
            "firstname": "Michael",
            "lastname": "Silva",
            "email": "michael.silva@prysmiangroup.com",
            "password": "operator123",
            "status": 1,
            "userrole": role._id,
        });
        user.save();
        console.log('Michael Silva');
        var user = new Users({
            "username": "Richard Dionne",
            "firstname": "Richard",
            "lastname": "Dionne",
            "email": "richard.dionne@prysmiangroup.com",
            "password": "operator123",
            "status": 1,
            "userrole": role._id,
        });
        user.save();
        console.log('Richard Dionne');
        var user = new Users({
            "username": "William Wilson",
            "firstname": "William",
            "lastname": "Wilson",
            "email": "william.wilson@prysmiangroup.com",
            "password": "operator123",
            "status": 1,
            "userrole": role._id,
        });
        user.save();
        console.log('William Wilson');
    });
    next();
};

exports.down = function (next) {
    next();
};
