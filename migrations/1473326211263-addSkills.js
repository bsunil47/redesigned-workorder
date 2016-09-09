'use strict';
require('../config/db');
var express = require('express');
var mongoose = require('mongoose');
var Skill = mongoose.model('Collection_Skills');
var Facility = mongoose.model('Collection_Facility');

exports.up = function (next) {
    var facilities = [{facility_number: 'US51'}, {facility_number: 'US52'}];
    var skill = new Skill({
        facilities: facilities,
        skill_name: 'Mechanical',
        status: 1,
    });
    skill.save();
    var skill = new Skill({
        facilities: facilities,
        skill_name: 'Electrical',
        status: 1,
    });
    skill.save();
    next();
};

exports.down = function (next) {
    next();
};
