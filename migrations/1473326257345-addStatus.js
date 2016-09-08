'use strict';
require('../config/db');
var express = require('express');
var mongoose = require('mongoose');
var Status = mongoose.model('Collection_Status');
var Facility = mongoose.model('Collection_Facility');

exports.up = function (next) {

    var status = new Status({
        facilities: {facility_number: 'US51'},
        status_number: 1,
        status_name: 'Open',
    });
    status.save();

    var status = new Status({
        facilities: {facility_number: 'US51'},
        status_number: 2,
        status_name: 'Closed',
    });
    status.save();

    var status = new Status({
        facilities: {facility_number: 'US51'},
        status_number: 3,
        status_name: 'Hold',
    });
    status.save();
    next();
};

exports.down = function (next) {
    next();
};
