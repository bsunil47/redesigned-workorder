/**
 * Created by admin on 7/29/2016.
 */

var mongoose = require('mongoose');
var Collection_FacilitySchema = new mongoose.Schema({
    facility_number: {type: String, unique: true, required: true},
    facility_name: {type: String, required: true},
    facility_managers: [],
    facility_users: [],
    status: {type: Number, default: 1},
    created_on: Date,
    update_on: Date
});

mongoose.model('Collection_Facility', Collection_FacilitySchema);


