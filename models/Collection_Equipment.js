/**
 * Created by admin on 7/29/2016.
 */

var mongoose = require('mongoose');
var Collection_EquipmentSchema = new mongoose.Schema({
    equipment_number: {type: String, unique: true, required: true},
    facility_number: {type: String, required: true},
    equipment_name: {type: String, required: true},
    equipment_vendorname: {type: String},
    status: {type: Number, default: 1},
    created_on: Date,
    update_on: Date
});

mongoose.model('Collection_Equipment', Collection_EquipmentSchema);


