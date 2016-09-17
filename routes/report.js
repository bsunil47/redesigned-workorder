"use strict";
var express = require('express');
var mongoose = require('mongoose');
var app = express();
var async = require('async');
var dateFormat = require('dateformat');

var fs = require('fs');
var router = express.Router();
var phantom = require('phantom');
var phantomExpress = require("phantom-express");
var pdf = require('html-pdf');
//nunjucks templating
var nunjucks = require('nunjucks');
//var dateFilter = require('nunjucks-date-filter');



//html file which you want to convert into pdf.
//var html = fs.readFileSync('view/userlist/userlist.html', 'utf8');
//Nunjucks is a product from Mozilla and we are using it as a template engine.
nunjucks.configure('public', {
    autoescape: true,
    express: app
});
//dateFilter.install();

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
router.get('/', function (req, res, next) {
    console.log('request made....print 1 ');
    var today = new Date();
    var fullUrl = req.protocol + '://' + req.get('host');
    WorkOrder.find({wo_timespent: {$exists: true, $not: {$size: 0}}}, function (err, workorders) {
        if (err) {
            next()
        }

        if (workorders.length > 0) {
            var calls = [];
            workorders.forEach(function (work) {
                calls.push(function (callback) {
                    Category.findOne({_id: work.workorder_category}, function (e, r) {
                        if (e) {
                            return false;
                        }
                        work.workorder_category = r.category_name;
                    });
                    Equipment.findOne({_id: work.workorder_equipment}, function (er, ra) {
                        if (er) {
                            return false;
                        }
                        work.workorder_equipment = ra.equipment_name;
                        callback(null, work);
                    });

            });

            });

            async.parallel(calls, function (err, result) {

                /* this code will run after all calls finished the job or
                 when any of the calls passes an error */

                if (err)
                    return console.log(err);
                var obj = {
                    url: fullUrl,
                    date: today,
                    data: result
                };
                var renderedHtml = nunjucks.render('./view/ReportHourBase/report_hour.html', obj);
                pdf.create(renderedHtml, {ticketnum: 'hello'}).toStream(function (err, stream) {
                    stream.pipe(res);
                });
                console.log(result);
            });


        } else {
            res.redirect(fullUrl + "/#!/search_report_hour");
        }

    });
    // res.render('index', { title: 'Prysmian Group - Maintenance Work Order Application' });
});
router.get('/report_category', function (req, res, next) {
    console.log('request made....print 1 ');
    var today = new Date();
    var fullUrl = req.protocol + '://' + req.get('host');
    WorkOrder.find({status: 2}, function (err, workorders) {
        if (err) {
            next()
        }
        var obj = {
            url: fullUrl,
            date: today,
            data: workorders
        };
        if (workorders.length > 0) {
            var calls = [];
            workorders.forEach(function (work) {
                calls.push(function (callback) {
                    work.wo_datecomplete = dateFormat(new Date(work.wo_datecomplete).toISOString(), 'isoDate');
                    Category.findOne({_id: work.workorder_category}, function (e, r) {
                        if (e) {
                            return false;
                        }
                        work.workorder_category = r.category_name;
                    });
                    Equipment.findOne({_id: work.workorder_equipment}, function (er, ra) {
                        if (er) {
                            return false;
                        }
                        work.workorder_equipment = ra.equipment_name;
                        callback(null, work);
                    });

                });

            });

            async.parallel(calls, function (err, result) {

                /* this code will run after all calls finished the job or
                 when any of the calls passes an error */

                if (err)
                    return console.log(err);
                var obj = {
                    url: fullUrl,
                    date: today,
                    data: result
                };
                var renderedHtml = nunjucks.render('./view/ReportClosedWorkOrder/report_closed.html', obj);
                pdf.create(renderedHtml, {ticketnum: 'hello'}).toStream(function (err, stream) {
                    stream.pipe(res);
                });
                console.log(result);
            });

        } else {
            res.redirect(fullUrl + "/#!/search_closed_report");
        }

    });


    // res.render('index', { title: 'Prysmian Group - Maintenance Work Order Application' });
});


module.exports = router;
