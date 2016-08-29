/**
 * Created by admin on 7/29/2016.
 */

var mongoose = require('mongoose');
var Collection_PrioritySchema = new mongoose.Schema({
    facility_number: {type: String, required: true},
    priority_name: {type: String, unique: true, required: true},
    status: {type: Number, default: 1},
    created_on: Date,
    update_on: Date
});

mongoose.model('Collection_Priority', Collection_PrioritySchema);


