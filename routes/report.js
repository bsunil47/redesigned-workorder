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
router.post('/', function (req, res, next) {
    console.log('request made....print 1 ');
    var today = new Date();
    var fullUrl = req.protocol + '://' + req.get('host');
    var query = {wo_timespent: {$exists: true, $not: {$size: 0}}};
    if ((req.body.wo_datefrom != "" ) && (req.body.wo_dateto != "")) {
        query = {
            wo_timespent: {$exists: true, $not: {$size: 0}},
            wo_datecomplete: {
                '$gte': req.body.wo_datefrom,
                '$lt': req.body.wo_dateto
            }
        }
    }
    if (req.body.facility != 0) {
        query.workorder_facility = req.body.facility;
    }
    if (req.body.equipment != 0) {
        query.workorder_equipment = req.body.equipment;
    }
    if (req.body.workorder_type == 2) {
        query.workorder_PM = {$exists: true, $not: {$size: 0}};
    }
    if (req.body.workorder_type == 1) {
        query.workorder_PM = {$exists: false};
    }
    console.log(query);
    WorkOrder.find(query, function (err, workorders) {
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
                        work.workorder_number = setPadZeros(parseInt(work.workorder_number), 8);
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
router.post('/report_category', function (req, res, next) {
    console.log('request made....print 1 ');
    var today = new Date();
    var fullUrl = req.protocol + '://' + req.get('host');
    var query = {status: 2};

    if ((req.body.wo_datefrom != "") && (req.body.wo_dateto != "")) {
        /*query = {
         status: 2,
         wo_datecomplete: {
         '$gte': parseInt(req.body.wo_datefrom),
         '$lt': parseInt(req.body.wo_dateto)
         }
     }*/
        query = {
            status: 2,
            wo_datecomplete: {
                '$gte': req.body.wo_datefrom,
                '$lt': req.body.wo_dateto

            }
        }
    }

    if (req.body.categories != 0) {
        query.workorder_category = req.body.categories;
    }
    console.log(query);
    WorkOrder.find(query, function (err, workorders) {
        if (err) {
            next()
        }
        if (workorders.length > 0) {
            var calls = [];
            workorders.forEach(function (work) {
                calls.push(function (callback) {

                    console.log(dateFormat(new Date(parseInt(work.wo_datecomplete)), 'isoDate'));
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

                        var date = dateFormat(new Date(parseInt(work.wo_datecomplete)), 'isoDate');
                        work.workorder_number = setPadZeros(parseInt(work.workorder_number), 8);
                        work.wo_datecomplete = date;
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

var setPadZeros = function (num, size) {
    try {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    } catch (err) {
        return null;
    }


}

module.exports = router;
