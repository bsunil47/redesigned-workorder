/**
 * Created by admin on 7/29/2016.
 */

var mongoose = require('mongoose');
var Collection_StatusSchema = new mongoose.Schema({
    facilities: [],
    status_number: {type: Number, required: true},
    status_name: {type: String, unique: true, required: true},
    created_on: Date,
    update_on: Date
});

mongoose.model('Collection_Status', Collection_StatusSchema);


