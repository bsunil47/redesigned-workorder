'use strict';
require('../config/db');
var express = require('express');
var mongoose = require('mongoose');
var Priority = mongoose.model('Collection_Priority');
var Facility = mongoose.model('Collection_Facility');

exports.up = function (next) {
    var facilities = [{facility_number: 'US51'}, {facility_number: 'US52'}];
    var prio = new Priority({
        facilities: facilities,
        priority_name: 'Low',
        status: 1,
    });
    prio.save();
    var prio = new Priority({
        facilities: facilities,
        priority_name: 'Medium',
        status: 1,
    });
    prio.save();
    var prio = new Priority({
        facilities: facilities,
        priority_name: 'High',
        status: 1,
    });
    prio.save();
    next();
};

exports.down = function (next) {
    next();
};
