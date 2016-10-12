'use strict';
var express = require('express');
var mongoose = require('mongoose');
require('../config/db');
var Users = mongoose.model('Collection_Users');
var Facility = mongoose.model('Collection_Facility');

exports.up = function (next) {
    console.log('start');
    Users.find({'userrole': '57d2c16770d898548d598d30'}, function (err, users) {
        if (err) {
            next(err);
        }
        for (var user in users) {
            var query = {facility_number: 'US51'};
            Facility.update(query, {$push: {facility_users: {user_id: users[user]._id, email: users[user].email}}},
                {safe: true, upsert: false},
                function (err, model) {
                    console.log(err);
                });
        }
        //console.log(role_array);

    });
    next();
};

exports.down = function (next) {

    next();
};
