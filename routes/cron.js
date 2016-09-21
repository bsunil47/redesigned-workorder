"use strict";
var express = require('express');
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var app = express();
var async = require('async');
var dateFormat = require('dateformat');
var smtpTransport = require('nodemailer-smtp-transport');
var transporter = nodemailer.createTransport(smtpTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'pgworkorder@gmail.com',
        pass: 'PGw0rk0rder'
    },
    logger: true, // log to console
    debug: true // include SMTP traffic in the logs
}, {
    // default message fields

    // sender info
    from: 'Prysmian WOA <pgworkorder@gmail.com>'
}));

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

var setPadZeros = function (num, size) {
    try {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    } catch (err) {
        return null;
    }


}
var cron = require('node-cron');

cron.schedule('* 1 * * *', function () {
    var num = setPadZeros(10, 8);
    PM.find({}, function (err, tasks) {
        if (err) {
            console.log(err);
        }
        for (var ky in tasks) {
            if (typeof (new Date(tasks[ky].pm_next_date) === 'Invalid Date')) {
                var nextDate = new Date(parseInt(tasks[ky].pm_next_date));
            } else {
                var nextDate = new Date(tasks[ky].pm_next_date);
            }
            var today = new Date();
            if (today.getDate() == nextDate.getDate() && today.getMonth() == nextDate.getMonth() && today.getFullYear() == nextDate.getFullYear()) {
                createWorkOrder(tasks[ky])
            }

        }
    });
    console.log(num + 'running a task every minute');
});

var createWorkOrder = function (task) {

    WorkOrder.findOne({workorder_PM: task.pm_number}, function (err, wkOrd) {
        if (err) {
            return false;
        }
        counters.increment('workorder_number', function (err, result) {
            if (err) {
                console.error('Counter on photo save error: ' + err);
                return;
            }
            var workOrder = new WorkOrder({
                workorder_number: result.seq,
                workorder_creator: wkOrd.workorder_creator,
                workorder_description: wkOrd.workorder_description,
                workorder_facility: wkOrd.workorder_facility,
                workorder_category: wkOrd.workorder_category,
                workorder_equipment: wkOrd.workorder_equipment,
                workorder_priority: wkOrd.workorder_priority,
                created_on: new Date().valueOf(),
                workorder_PM: wkOrd.workorder_PM,
                status: 1
            });
            workOrder.save(function (err, resp) {
                if (err) {
                    console.log(err);
                    res.json({
                        Code: 499,
                        message: err,
                    });
                } else {
                    var currentDt = new Date();
                    currentDt.setDate(currentDt.getDate() + parseInt(task.pm_frequency));
                    var pm_task = {
                        pm_number: task.pm_number,
                        pm_frequency: task.pm_frequency,
                        pm_next_date: new Date(currentDt).valueOf(),
                        pm_current_date: new Date().valueOf(),
                        pm_previous_date: new Date(parseInt(task.pm_previous_date)).valueOf(),
                        status: 1
                    };
                    var where = {pm_number: task.pm_number};
                    PM.findOneAndUpdate(where, pm_task, {upsert: true}, function (err, pm) {
                        if (err) {
                            console.log(err);
                        }
                    });
                    var facility, category, equipment, priority;
                    Facility.findOne({facility_number: wkOrd.workorder_facility}, function (err, facility) {
                        if (err) {
                            console.log(err);
                        }
                        Category.findOne({_id: wkOrd.workorder_category}, function (err, category) {
                            if (err) {
                                console.log(err);
                            }
                            Equipment.findOne({_id: wkOrd.workorder_equipment}, function (err, equipment) {
                                if (err) {
                                    console.log(err);
                                }
                                Priority.findOne({_id: wkOrd.workorder_priority}, function (err, priority) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    var facility_namagers = facility.facility_managers;
                                    var manager_email = "";
                                    for (var man in facility_namagers) {
                                        if (typeof facility_namagers[man].email !== 'undefined') {
                                            manager_email += facility_namagers[man].email + ", ";
                                        }
                                    }
                                    var mail_to = manager_email;

                                    var mailData = {
                                        // Comma separated list of recipients
                                        to: mail_to,
                                        // Subject of the message
                                        subject: 'New PM Maintenance Work Order number ' + setPadZeros(result.seq, 8) + ' has been submited for your approval', //

                                        // plaintext body
                                        //text: 'Hello to sunil',

                                        // HTML body
                                        html: '<p>New PM Maintenace Work Order number <b>' + setPadZeros(result.seq, 8) + '</b> has been submited for your approval</p>'
                                        +
                                        '<p><b>Work Order Details</b></p>'
                                        +
                                        '<p><b>Work Order Number</b>: ' + setPadZeros(result.seq, 8) + '</p>'
                                        +
                                        '<p><b>Work Order Date</b>: ' + new Date() + '</p>'
                                        +
                                        '<p><b>Facility</b>: ' + facility.facility_name + '</p>'
                                        +
                                        '<p><b>Category</b>: ' + category.category_name + '</p>'
                                        +
                                        '<p><b>Equipment</b>: ' + equipment.equipment_name + '</p>'
                                        +
                                        '<p><b>Priority</b>: ' + priority.priority_name + '</p>'
                                        +
                                        '<p><b>Description</b>: ' + wkOrd.workorder_description + '</p>'
                                        +
                                        '<p>Please click <a href="http://183.82.107.134:3030">here</a> for Maintenance Work Order Application</p>'

                                    };
                                    transporter.sendMail(mailData, function (err, info) {
                                        if (err) {
                                            console.log(err);
                                        }
                                        console.log('Message sent successfully!');
                                        console.log(info);

                                    });

                                });
                            });
                        });
                    });
                    console.log('WorkOrder ' + result.seq + ' created sucessfully');
                    //res.json({Code: 200, Info: {msg: 'sucessfull', workorder_number: result.seq}});
                }
            });
        });
    });

}



module.exports = router;
