/**
 * Created by admin on 7/29/2016.
 */

var mongoose = require('mongoose');
var PM_TaskSchema = new mongoose.Schema({
    __v: {type: Number, select: false},
    pm_number: {type: String, unique: true, required: true},
    pm_frequency: Number,
    pm_next_date: String,
    pm_current_date: String,
    pm_previous_date: String,
    status: {type: Number, default: 1, required: true}
});

mongoose.model('Collection_PM_Task', PM_TaskSchema);


