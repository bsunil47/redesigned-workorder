'use strict';
require('../config/db');
var express = require('express');
var mongoose = require('mongoose');
var Users = mongoose.model('Collection_Users');
var Roles = mongoose.model('Collection_Roles');
var Facility = mongoose.model('Collection_Facility');
var Equipment = mongoose.model('Collection_Equipment');

exports.up = function (next) {
    console.log('start');
    var equipment = Equipment({
        equipment_number: 'CT4X222AN65B',
        equipment_name: 'PLCV',
        facilities: {facility_number: 'US51'},
        equipments: [
            {
                material_number: '124-02',
                material_description: 'Test Material 02',
                vendor_number: '100931',
                vendor_name: 'McAlistar',
                min_qty: '5',
                max_qty: '8'
            },
            {
                material_number: '124-03',
                material_description: 'Test Material 03',
                vendor_number: '100470',
                vendor_name: 'McJunkin',
                min_qty: '2',
                max_qty: '7'
            }, {
                material_number: '124-01',
                material_description: 'Test Material 01',
                vendor_number: '101452',
                vendor_name: 'Rainbow',
                min_qty: '2',
                max_qty: '4'
            }
        ]
    });
    equipment.save();
    var equipment = Equipment({
        equipment_number: 'A74626',
        equipment_name: 'PX4',
        facilities: {facility_number: 'US51'},
        equipments: [
            {
                material_number: '123-06',
                material_description: 'Test Material 04',
                vendor_number: '100706',
                vendor_name: 'Hingham Bay',
                min_qty: '4',
                max_qty: '6'
            }
        ]
    });
    equipment.save();
    console.log('end');

    next();
};

exports.down = function (next) {
    next();
};
