/**
 * Created by admin on 7/29/2016.
 */

var mongoose = require('mongoose');
var autoIncrement = require("mongodb-autoincrement");
/*mongoose.plugin(autoIncrement.mongoosePlugin, optionalOptions);
 autoIncrement.setDefaults({
 collection: 'Collection_Workorders',     // collection name for counters, default: counters
 field: 'workorder_number',               // auto increment field name, default: _id
 step: 1             // auto increment step
 });*/
var WorkorderSchema = new mongoose.Schema({
    __v: {type: Number, select: false},
    workorder_number: {type: String, unique: true, required: true},
    workorder_creator: {type: mongoose.Schema.Types.ObjectId, ref: 'Collection_Users'},
    workorder_facility: String,
    workorder_category: String,
    workorder_equipment: String,
    workorder_priority: String,
    workorder_skill: String,
    workorder_technician: {type: mongoose.Schema.Types.ObjectId, ref: 'Collection_Users'},
    workorder_class: String,
    wo_goodsreceipt: String,
    wo_equipmentcost: String,
    wo_timespent: String,
    wo_datecomplete: String,
    workorder_description: String,
    workorder_leadcomments: String,
    workorder_actiontaken: String,
    workorder_PM: String,
    status: {type: Number, default: 1, required: true},
    created_on: String,
    update_on: Date
});

mongoose.model('Collection_Workorders', WorkorderSchema);


