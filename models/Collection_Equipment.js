/**
 * Created by admin on 7/29/2016.
 */

var mongoose = require('mongoose');
var Collection_EquipmentSchema = new mongoose.Schema({
    equipment_number: {type: String, unique: true, required: true},
    facilities: [],
    equipment_name: {type: String, required: true},
    equipments: [],
    status: {type: Number, default: 1},
    created_on: Date,
    update_on: Date
});

mongoose.model('Collection_Equipment', Collection_EquipmentSchema);


