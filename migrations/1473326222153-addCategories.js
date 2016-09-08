'use strict';
require('../config/db');
var express = require('express');
var mongoose = require('mongoose');
var Category = mongoose.model('Collection_Category');
var Facility = mongoose.model('Collection_Facility');

exports.up = function (next) {
    var category = new Category({
        facility_number: 'US51',
        category_name: 'Safety',
        status: 1,
    });
    category.save();
    var category = new Category({
        facility_number: 'US51',
        category_name: 'Breakdown',
        status: 1,
    });
    category.save();
    var category = new Category({
        facility_number: 'US51',
        category_name: 'Maintenance Support',
        status: 1,
    });
    category.save();
    var category = new Category({
        facility_number: 'US51',
        category_name: 'Production Support',
        status: 1,
    });
    category.save();
    var category = new Category({
        facility_number: 'US51',
        category_name: 'Planed',
        status: 1,
    });
    category.save();
    var category = new Category({
        facility_number: 'US51',
        category_name: 'PM',
        status: 1,
    });
    category.save();
    var category = new Category({
        facility_number: 'US51',
        category_name: 'Indirect Labor',
        status: 1,
    });
    category.save();
    var category = new Category({
        facility_number: 'US51',
        category_name: 'Tool Request',
        status: 1,
    });
    category.save();

    next();
};

exports.down = function (next) {
    next();
};
