var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

var Users = mongoose.model('Collection_Users');
var Roles = mongoose.model('Collection_Roles');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Prysmian Group - Maintenance Work Order Application' });
});

module.exports = router;
