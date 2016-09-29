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
    var qr = {};
    if (req.body.facility != 0) {
        query.workorder_facility = req.body.facility;
    }
    if (req.body.equipment != 0) {
        qr._id = query.workorder_equipment = req.body.equipment;
    }
    if (req.body.workorder_type == 2) {
        query.workorder_PM = {$exists: true, $not: {$size: 0}};
    }
    if (req.body.workorder_type == 1) {
        query.workorder_PM = {$exists: false};
    }
    Equipment.find(qr, function (err, equi) {
        var equipments = [];
        equi.forEach(function (eq) {
            console.log(eq.equipment_name);
            var total_hrs = 0;
            equipments.push(function (callback) {
                query.workorder_equipment = eq._id;
                WorkOrder.find(query, {},
                    {
                        sort: {
                            workorder_equipment: -1 //Sort by  DESC
                        }
                    }, function (err, workorders) {
                        if (err) {
                            next()
                        }
                        var Wkodrs = [];
                        workorders.forEach(function (wrkORder) {
                            Wkodrs.push(function (callback) {
                                var wo_timespent = 0;
                                var details = {};
                                var time_spent = wrkORder.wo_timespent.split(':');
                                if (time_spent[1] == "15") {
                                    wo_timespent = parseFloat(time_spent[0]) + 0.25;
                                    total_hrs = total_hrs + parseFloat(time_spent[0]) + parseFloat(0.25);
                                    details.wo_timespent = wo_timespent;
                                } else {
                                    if (time_spent[1] == "30") {
                                        wo_timespent = parseFloat(parseFloat(time_spent[0]) + parseFloat(0.5));
                                        total_hrs = total_hrs + parseFloat(time_spent[0]) + parseFloat(0.5);
                                        details.wo_timespent = wo_timespent;
                                    } else {
                                        if (time_spent[1] == "45") {
                                            wo_timespent = parseFloat(parseFloat(time_spent[0]) + parseFloat(0.75));
                                            total_hrs = total_hrs + parseFloat(time_spent[0]) + parseFloat(0.75);
                                            details.wo_timespent = wo_timespent;
                                        } else {
                                            wo_timespent = parseFloat(time_spent[0]);
                                            total_hrs = total_hrs + parseFloat(time_spent[0]);
                                            details.wo_timespent = wo_timespent;
                                        }
                                    }
                                }


                                details.workorder_number = setPadZeros(parseInt(wrkORder.workorder_number), 8);
                                Category.findOne({_id: wrkORder.workorder_category}, function (categoryErr, category) {
                                    if (categoryErr) {

                                    }
                                    details.workorder_category = category.category_name;
                                    callback(null, details);
                                });

                                console.log(wrkORder);
                                console.log('workorder issue');

                            });
                        });
                        async.parallel(Wkodrs, function (err, result) {
                            var category = {};
                            var itemsProcessed = 0;
                            console.log(result);
                            function callback1() {
                                var caty = [];
                                var equpment = {
                                    total_hrs: total_hrs,
                                    equipment_number: eq.equipment_number,
                                    equipment_name: eq.equipment_name,
                                    status: eq.status,
                                    equipments: eq.equipments,
                                    facilities: eq.facilities,
                                    workorders: category
                                };
                                console.log(itemsProcessed);
                                callback(null, equpment);
                            }


                            result.forEach((cat, index, array) => {
                                asyncFunction(cat, () => {
                                    if (typeof category[cat.workorder_category] === 'undefined') {
                                        category[cat.workorder_category] = [];
                                        category[cat.workorder_category] = {
                                            workorder_category: cat.workorder_category,
                                            wo_timespent: cat.wo_timespent
                                        };
                                    } else {
                                        category[cat.workorder_category].wo_timespent = category[cat.workorder_category].wo_timespent + cat.wo_timespent;
                                    }
                                    itemsProcessed++;
                                    console.log(itemsProcessed);
                                    console.log(array.length);
                                    if (itemsProcessed === array.length) {
                                        callback1();
                                    }
                                });
                            });
                            function asyncFunction(item, cb) {
                                setTimeout(() => {
                                    console.log('done with', item);
                                    cb();
                                }, 1000);
                            }

                            /*result.forEach(function (cat) {
                             console.log(category[cat.workorder_category]);
                             if(typeof category[cat.workorder_category] === 'undefined'){
                             category[cat.workorder_category] =[];
                             category[cat.workorder_category].push(cat);
                             }else{
                             category[cat.workorder_category].push(cat);
                             }
                             console.log(category);
                             });*/


                        })

                    });
            })
        });
        async.parallel(equipments, function (err, result) {
            console.log(result);
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
        });

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
    };

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
        };
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
                        if (isNaN(parseInt(work.wo_datecomplete))) {
                            var date = dateFormat(new Date(work.wo_datecomplete), 'isoDate');
                        } else {
                            var date = dateFormat(new Date(parseInt(work.wo_datecomplete)), 'isoDate');
                        }

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


};

module.exports = router;
