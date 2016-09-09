'use strict';
require('../config/db');
var express = require('express');
var mongoose = require('mongoose');
var Users = mongoose.model('Collection_Users');
var Roles = mongoose.model('Collection_Roles');
var Facility = mongoose.model('Collection_Facility');

exports.up = function (next) {
    Users.find({email: {$ne: 'Eshwar.arasu@mytecsoft.com'}}, function (err, users1) {
        if (err) {
            next(err);
        }
        for (var user1 in users1) {
            var query = {facility_number: 'US51'};
            Facility.update(query, {$push: {facility_users: {user_id: users1[user1]._id, email: users1[user1].email}}},
                {safe: true, upsert: false},
                function (err, model) {
                    console.log(err);
                });
        }
    });


    next();
};

exports.down = function (next) {
    next();
};
