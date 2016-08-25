/**
 * Created by admin on 8/11/2016.
 */
var normalizedPath = require("path").join(__dirname, "../models");


var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var db = mongoose.connect('mongodb://localhost/WorkOrder');
require("fs").readdirSync(normalizedPath).forEach(function(file) {
    require("../models/" + file);
});
