'use strict';
require('../config/db');
var express = require('express');
var mongoose = require('mongoose');
var Class = mongoose.model('Collection_Class');
var Facility = mongoose.model('Collection_Facility');

exports.up = function (next) {
    var clas = new Class({
        facility_number: 'US51',
        class_name: 'Fiber',
        status: 1,
    });
    clas.save();
    var clas = new Class({
        facility_number: 'US51',
        class_name: 'Mixing',
        status: 1,
    });
    clas.save();
    var clas = new Class({
        facility_number: 'US51',
        class_name: 'Warehouse',
        status: 1,
    });
    clas.save();
    var clas = new Class({
        facility_number: 'US51',
        class_name: 'Test Lab',
        status: 1,
    });
    clas.save();
    var clas = new Class({
        facility_number: 'US51',
        class_name: 'Extrusion',
        status: 1,
    });
    clas.save();
    var clas = new Class({
        facility_number: 'US51',
        class_name: 'Extrusion Set-Up',
        status: 1,
    });
    clas.save();
    var clas = new Class({
        facility_number: 'US51',
        class_name: 'Cabling',
        status: 1,
    });
    clas.save();
    var clas = new Class({
        facility_number: 'US51',
        class_name: 'Cabling Set-Up',
        status: 1,
    });
    clas.save();
    var clas = new Class({
        facility_number: 'US51',
        class_name: 'Cable Inspection',
        status: 1,
    });
    clas.save();
    var clas = new Class({
        facility_number: 'US51',
        class_name: 'Braiding',
        status: 1,
    });
    clas.save();
    var clas = new Class({
        facility_number: 'US51',
        class_name: 'Braiding Se-Up',
        status: 1,
    });
    clas.save();
    var clas = new Class({
        facility_number: 'US51',
        class_name: 'Test',
        status: 1,
    });
    clas.save();
    var clas = new Class({
        facility_number: 'US51',
        class_name: 'Facility',
        status: 1,
    });
    clas.save();
    var clas = new Class({
        facility_number: 'US51',
        class_name: 'Facility Repair',
        status: 1,
    });
    clas.save();
    next();
};

exports.down = function (next) {
    next();
};
