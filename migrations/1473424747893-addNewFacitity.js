'use strict';
require('../config/db');
var express = require('express');
var mongoose = require('mongoose');
var Users = mongoose.model('Collection_Users');
var Roles = mongoose.model('Collection_Roles');
var Facility = mongoose.model('Collection_Facility');

exports.up = function (next) {
    Users.findOne({'email': 'Eshwar.arasu@mytecsoft.com'}, function (err, users2) {
        if (err) {
            next(err);
        }
        var query = {
            facility_number: 'US52',
            facility_name: 'Schuylkill Haven',
            status: 1,
            facility_users: {user_id: users2._id, email: users2.email},
            facility_managers: {user_id: users2._id, email: users2.email}
        };
        var facility = new Facility(query);
        facility.save();

    });

    next();
};

exports.down = function (next) {
    next();
};
