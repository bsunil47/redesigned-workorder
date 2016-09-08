var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

var Users = mongoose.model('Collection_Users');
var Roles = mongoose.model('Collection_Roles');
var WorkOrder = mongoose.model('Collection_Workorders');
var Category = mongoose.model('Collection_Category');
var Class = mongoose.model('Collection_Class');
var Equipment = mongoose.model('Collection_Equipment');
var Facility = mongoose.model('Collection_Facility');
var Priority = mongoose.model('Collection_Priority');
var Skill = mongoose.model('Collection_Skills');
var Status = mongoose.model('Collection_Status');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Prysmian Group - Maintenance Work Order Application' });
});

module.exports = router;
