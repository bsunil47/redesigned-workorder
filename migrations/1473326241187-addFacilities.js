'use strict';
require('../config/db');
var express = require('express');
var mongoose = require('mongoose');
var Users = mongoose.model('Collection_Users');
var Roles = mongoose.model('Collection_Roles');
var Facility = mongoose.model('Collection_Facility');

exports.up = function (next) {
    Roles.find({$or: [{'role_name': 'admin'}, {'role_name': 'manager'}]}, {_id: 1}, function (err, roles) {
        if (err) {
            next(err);
        }
        var role_array = [];
        for (var role in roles) {
            role_array.push({'userrole': roles[role]._id});
        }
        Users.find({'email': {$ne: 'Eshwar.arasu@mytecsoft.com'}, $or: role_array}, function (err, users) {
            if (err) {
                next(err);
            }
            var manager_user_ids = [];
            for (var user in users) {
                manager_user_ids.push({'user_id': users[user]._id, 'email': users[user].email})
            }
            var facility = new Facility({
                facility_number: 'US51',
                facility_name: 'N. Dighton',
                facility_managers: manager_user_ids,
                status: 1,
            });
            facility.save();
        });

        //console.log(role_array);

    });

    next();
};

exports.down = function (next) {
    next();
};
