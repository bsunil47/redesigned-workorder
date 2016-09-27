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

var PM = mongoose.model('Collection_PM_Task');
var PartsRequest = mongoose.model('Collection_PartRequest');
var counters = mongoose.model('counter');

/* GET home page. */
router.post('/', function (req, res, next) {
    console.log('request made....print hr ');
    var today = new Date();
    var fullUrl = req.protocol + '://' + req.get('host');
    var query = {wo_timespent: {$exists: true, $not: {$size: 0}}};
    var search_date = {
        'from': "",
        'to': ""
    };
    var search_to = "";
    console.log(req.body.wo_datefrom);
    if ((req.body.wo_datefrom != "" ) && (req.body.wo_dateto != "")) {
        query = {
            wo_timespent: {$exists: true, $not: {$size: 0}},
            wo_datecomplete: {
                '$gte': req.body.wo_datefrom,
                '$lte': req.body.wo_dateto
            }
        };
        search_date = {
            'from': dateFormat(parseInt(req.body.wo_datefrom), 'shortDate'),
            'to': dateFormat(parseInt(req.body.wo_dateto), 'shortDate')
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
                        var time_spent = work.wo_timespent.split(':');
                        if (time_spent[1] == "15") {
                            console.log(time_spent[1]);
                            time_spent = time_spent[0] + '.25';
                            console.log(time_spent);
                        }
                        if (time_spent[1] == "30") {
                            time_spent = parseFloat(time_spent[0]) + 0.5;
                        }
                        if (time_spent[1] == "45") {
                            time_spent = parseFloat(time_spent[0]) + 0.75;
                        } else {
                            time_spent = parseFloat(time_spent[0]);
                        }
                        work.wo_timespent = parseInt(time_spent);
                        work.timespent = parseInt(time_spent);
                        console.log(parseFloat(work.timesoent));
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
                    search: search_date,
                    data: result
                };
                var renderedHtml = nunjucks.render('./view/ReportHourBase/report_hour.html', obj);
                pdf.create(renderedHtml, {ticketnum: 'hello'}).toStream(function (err, stream) {
                    stream.pipe(res);
                });
                //console.log(result);
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
    var search_date = {
        'from': "",
        'to': ""
    }

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
                '$lte': req.body.wo_dateto

            }
        }
        search_date = {
            'from': dateFormat(parseInt(req.body.wo_datefrom), 'shortDate'),
            'to': dateFormat(parseInt(req.body.wo_dateto), 'shortDate')
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
                    search: search_date,
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

router.post('/report_pm', function (req, res, next) {
    console.log('request made....print PM ');
    var today = new Date();
    var fullUrl = req.protocol + '://' + req.get('host');
    var query = {};
    if (req.body.equipment != 0) {
        query.workorder_equipment = req.body.equipment;
    }
    if (req.body.facility != 0) {
        query.workorder_facility = req.body.facility;
    }
    var pMquery = {};
    if ((req.body.wo_pm_date_from != "")) {
        if (req.body.wo_pm_date_to == "") {
            var created_on = new Date().valueOf();
        } else {
            var created_on = new Date(req.body.wo_pm_date_to).valueOf();
        }
        pMquery.pm_next_date = {
            '$gte': new Date(req.body.wo_pm_date_from).valueOf(),
            '$lte': parseInt(created_on)
        };
    }

    PM.find(pMquery, {}, {
        sort: {
            _id: -1 //Sort by Date Added DESC
        }
    }, function (err, pm) {
        if (err) {
            return next(err)
        }
        var calls = [];
        var workorders = [];
        pm.forEach(function (pmNM) {
            calls.push(function (callback) {
                WorkOrder.findOne({workorder_PM: pmNM.pm_number}, function (erra, work) {

                    if (erra) {

                    }
                    if (work != null) {

                        Equipment.findOne({_id: work.workorder_equipment}, function (er, ra) {
                            if (er) {
                                return false;
                            }
                            Facility.findOne({facility_number: work.workorder_facility}, function (erraa, fc) {
                                var order = {
                                    workorder_number: setPadZeros(parseInt(work.workorder_number), 8),
                                    workorder_PM: work.workorder_PM,
                                    pm_next_date: dateFormat(parseInt(pmNM.pm_next_date), 'shortDate'),
                                    workorder_description: work.workorder_description,
                                    workorder_facility: fc.facility_name,
                                    workorder_equipment: ra.equipment_name
                                };
                                //order.workorder_equipment = ra.equipment_name;
                                console.log(order);
                                callback(null, order);
                            });

                        });

                        //work.pm_next_date = pmNM.pm_next_date;
                    } else {
                        callback(null, null);
                    }


                });


            });

        });

        async.parallel(calls, function (err, result) {

            /* this code will run after all calls finished the job or
             when any of the calls passes an error */
            console.log('asda');
            if (err)
                return console.log(err);
            var v_result = [];
            for (var i in result) {
                console.log(result[i]);
                if (typeof result[i] === "undefined" || result[i] == null) {
                    delete result[i];
                } else {
                    v_result.push(result[i]);
                }
            }
            var obj = {
                url: fullUrl,
                date: today,
                data: v_result
            };
            var renderedHtml = nunjucks.render('./view/ReportPMTask/report_hour.html', obj);
            pdf.create(renderedHtml, {ticketnum: 'hello', "orientation": "landscape"}).toStream(function (err, stream) {
                stream.pipe(res);
            });
            console.log(result);
        });


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
