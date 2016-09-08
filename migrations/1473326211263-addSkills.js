'use strict';
require('../config/db');
var express = require('express');
var mongoose = require('mongoose');
var Skill = mongoose.model('Collection_Skills');
var Facility = mongoose.model('Collection_Facility');

exports.up = function (next) {
    var skill = new Skill({
        facility_number: 'US51',
        skill_name: 'Mechanical',
        status: 1,
    });
    skill.save();
    var skill = new Skill({
        facility_number: 'US51',
        skill_name: 'Electrical',
        status: 1,
    });
    skill.save();
    next();
};

exports.down = function (next) {
    next();
};
