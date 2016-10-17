/**
 * Created by admin on 7/29/2016.
 */

var mongoose = require('mongoose');
var Collection_PartRequestSchema = new mongoose.Schema({
    equipment_number: {type: String, required: true},
    material_number: {type: String, required: true},
    qty: {type: Number, required: true},
    workorder_number: String,
    user_id: String,
    status: {type: Number, default: 1},
    created_on: Date,
    update_on: Date
});

mongoose.model('Collection_PartRequest', Collection_PartRequestSchema);


