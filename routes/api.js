"use strict";
var express = require('express');
var nodemailer = require('nodemailer');
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
var router = express.Router();
var mongoose = require('mongoose');
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
var dateFormat = require('dateformat');
var PartsRequest = mongoose.model('Collection_PartRequest');
var counters = mongoose.model('counter');

router.post('/', function (req, res, next) {
    var regex = new RegExp(["^", req.body.username, "$"].join(""), "i");
    var query = {
        'username': {$regex: regex},
        //$text: {$search: req.body.username},
        password: req.body.password
    };
    console.log(query);
    Users.findOne(query, function (err, users) {
        if (err) {
            return next(err);
        }

        if (users != null) {
            Roles.findOne({_id: users.userrole}, function (err, role) {
                if (err) {
                    return next(err);
                }
                /*Facility.find({}, function (err, facilities) {
                 if (err) {
                 return next(err);
                 }
                 res.json({Code: 200, Info: {user: users, role: role.role_name, facilities: facilities}});
                 });*/
                res.json({Code: 200, Info: {user: users, role: role.role_name}});

            });


        } else {
            res.json({Code: 406, Info: 'no user'});
        }

    });
    //Res.json('respond with asa resource');
});

router.post('/userlist', function (req, res, next) {
    Users.find({}, function (err, users) {
        if (err) {
            return next(err)

        }
        if (users != null) {
            Roles.find({}, function (err, role) {
                if (err) {
                    return next(err);
                }
                res.json({Code: 200, Info: {users: users, roles: role}});
            })

        } else {
            res.json({Code: 406, Info: 'no user'});
        }

    });
    //Res.json('respond with asa resource');
});

router.post('/createuser', function (req, res, next) {
    if (!req.body.username || !req.body.email || !req.body.firstname || !req.body.lastname || !req.body.userrole || !req.body.facility) {
        return res.json({Code: 496, Info: 'All fields are required'});
    }
    Roles.findOne({role_name: req.body.userrole}, function (err, role) {
        if (err) {
            return next(err);
        }
        Users.count({$text: {$search: req.body.username}}, function (err, cnt) {
            if (cnt == 0) {
                var email = req.body.email;
                var user = new Users({
                    username: req.body.username,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: email.toLowerCase(),
                    userrole: role._id,
                    status: 1,
                    password: req.body.password,
                });
                user.save(function (err, resp) {
                    if (err) {

                        console.log(err);
                        res.json({
                            Code: 499,
                            Info: 'Email Already exist',
                        });
                    } else {
                        var query = {facility_number: req.body.facility};
                        if (req.body.userrole == 'manager' || req.body.userrole == 'admin') {
                            Facility.update(query, {
                                    $push: {
                                        "facility_managers": {
                                            user_id: resp._id.toString(),
                                            email: req.body.email
                                        }
                                    }
                                },
                                {safe: true, upsert: true},
                                function (err, model) {
                                    console.log(err);
                                });
                        }
                        Facility.update(query, {
                                $push: {
                                    "facility_users": {
                                        user_id: resp._id.toString(),
                                        email: req.body.email
                                    }
                                }
                            },
                            {safe: true, upsert: true},
                            function (err, model) {
                                console.log(err);
                            });
                        res.json({Code: 200, Info: 'User Created successfully'});
                    }
                });
            } else {
                res.json({
                    Code: 499,
                    Info: 'Username already exist ',
                });
            }
        });

        //Res.json({Code:200,Info:{user:users,role:role.role_name}});
    });

    //User.save();
    //res.json({Code:200,Info:"sucessfull"});
    //res.json('respond with asa resource');
});

router.post('/changepassword', function (req, res, next) {
    //Return res.json({Code:200,Info:"sucessfull"});
    var query = {_id: req.body.id};
    Users.findOne(query, function (err, user) {
        if (err) {
            res.json({
                Code: 499,
                Info: 'Error changing password',
            });
        } else {
            Users.findOneAndUpdate(query, {password: req.body.password}, {upsert: true}, function (err, doc) {
                if (err) return res.json({
                    Code: 499,
                    Info: 'Error changing password',
                });
                return res.json({Code: 200, Info: 'Password Changed Successfully'});
            });
        }

    });


    //User.save();
    //res.json({Code:200,Info:"sucessfull"});
    //res.json('respond with asa resource');
});

router.post('/create_workorder', function (req, res, next) {
    var count;
    WorkOrder.count({workorder_creator: req.body.creator}, function (err, c) {
        count = c;
        console.log('Count is ' + c);
    });
    Users.findOne({_id: req.body.creator}, function (err, user) {
        if (err) {
            return next(err);
        }
        counters.increment('workorder_number', function (err, result) {
            if (err) {
                console.error('Counter on photo save error: ' + err);
                return;
            }
            var date = new Date();
            var workOrder = new WorkOrder({
                workorder_number: result.seq,
                workorder_creator: req.body.creator,
                workorder_description: req.body.workorder_description,
                workorder_facility: req.body.workorder_facility,
                workorder_category: req.body.workorder_category,
                workorder_equipment: req.body.workorder_equipment,
                workorder_priority: req.body.workorder_priority,
                created_on: dateToDesireDateString(req.body.created_on),
                status: 1
            });
            workOrder.save(function (err, resp) {
                if (err) {
                    console.log(err);
                    res.json({
                        Code: 499,
                        Info: 'Error Creating workorder',
                    });
                } else {
                    var facility, category, equipment, priority;
                    Facility.findOne({facility_number: req.body.workorder_facility}, function (err, facility) {
                        if (err) {
                            console.log(err);
                        }
                        Category.findOne({_id: req.body.workorder_category}, function (err, category) {
                            if (err) {
                                console.log(err);
                            }
                            Equipment.findOne({_id: req.body.workorder_equipment}, function (err, equipment) {
                                if (err) {
                                    console.log(err);
                                }
                                Priority.findOne({_id: req.body.workorder_priority}, function (err, priority) {
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
                                    //var mail_to = 'pgmanager7@gmail.com';

                                    var mailData = {
                                        // Comma separated list of recipients
                                        to: mail_to,
                                        // Subject of the message
                                        subject: 'New Maintenance Work Order number ' + setPadZeros(result.seq, 8) + ' has been submited for your approval', //

                                        // plaintext body
                                        //text: 'Hello to sunil',

                                        // HTML body
                                        html: '<p>New Maintenace Work Order number <b>' + setPadZeros(result.seq, 8) + '</b> has been submited for your approval</p>'
                                        +
                                        '<p><b>Work Order Details</b></p>'
                                        +
                                        '<p><b>Work Order Number</b>: ' + setPadZeros(result.seq, 8) + '</p>'
                                        +
                                        '<p><b>Work Order Date</b>: ' + req.body.created_on + '</p>'
                                        +
                                        '<p><b>Facility</b>: ' + facility.facility_name + '</p>'
                                        +
                                        '<p><b>Category</b>: ' + category.category_name + '</p>'
                                        +
                                        '<p><b>Equipment</b>: ' + equipment.equipment_name + '</p>'
                                        +
                                        '<p><b>Priority</b>: ' + priority.priority_name + '</p>'
                                        +
                                        '<p><b>Description</b>: ' + req.body.workorder_description + '</p>'
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

                    res.json({Code: 200, Info: {msg: 'sucessfull', workorder_number: result.seq}});
                }
            });
        });

    })
});

router.post('/create_category', function (req, res, next) {
    if (!req.body.facility_number || !req.body.category_name) {
        return res.json({Code: 496, Info: 'All fields are required'});
    }
    Facility.findOne({facility_number: req.body.facility_number}, function (err, facility) {
        if (err) {
            return next(err);
        }
        if (Boolean(req.body.operator_available)) {
            var query_count = {
                category_name: {$regex: new RegExp('^' + req.body.category_name + '$', "i")},
                "facilities.facility_number": req.body.facility_number,
                operator_available: "true"
            };
        }
        else {
            var query_count = {
                category_name: {$regex: new RegExp('^' + req.body.category_name + '$', "i")},
                "facilities.facility_number": req.body.facility_number
            };
        }


        Category.count(query_count, function (err, categorycount) {
            if (err) {
                return next(err);
            }
            console.log("query_count" + JSON.stringify(query_count));
            if (categorycount) {
                return res.json({Code: 498, Info: 'Category for the Facility already exists'});
                next();
            }
            var query = {
                category_name: req.body.category_name
            };
            Category.update(query, {
                    operator_available: Boolean(req.body.operator_available),
                    status: 1,
                    $push: {"facilities": {facility_number: req.body.facility_number}}
                },
                {safe: true, upsert: true},
                function (err, model) {
                    if (err) {
                        console.log(err);
                        res.json({
                            Code: 499,
                            Info: 'Error creating category',
                        });
                    } else {
                        res.json({Code: 200, Info: 'Category created sucessfully'});
                    }
                });

        });
    });
});
router.post('/categories', function (req, res, next) {
    Category.find({}, function (err, categories) {
        if (err) {
            return next(err)
        }
        if (categories != null) {
            res.json({Code: 200, Info: {categories: categories}});
        } else {
            res.json({Code: 406, Info: 'no user'});
        }

    });
});

router.post('/create_class', function (req, res, next) {
    Facility.findOne({facility_number: req.body.facility_number}, function (err, facility) {
        if (err) {
            return next(err);
        }
        // validations ** start

        var query_count_class = {
            class_name: {$regex: new RegExp('^' + req.body.class_name + '$', "i")},
            "facilities.facility_number": req.body.facility_number
        };

        Class.count(query_count_class, function (err, classcount) {
            if (err) {
                return next(err);
            }
            console.log("query_count_class" + JSON.stringify(query_count_class));
            if (classcount) {
                return res.json({Code: 498, Info: 'Class for the Facility already exists'});
                next();
            }
            // validations ** end
            var query = {
                class_name: req.body.class_name
            };
            Class.update(query, {status: 1, $push: {"facilities": {facility_number: req.body.facility_number}}},
                {safe: true, upsert: true},
                function (err, model) {
                    if (err) {
                        console.log(err);
                        res.json({
                            Code: 499,
                            Info: 'Error creating Class',
                        });
                    } else {
                        res.json({Code: 200, Info: 'Class Created Sucessfully'});
                    }
                });
        });

    });
});
router.post('/classes', function (req, res, next) {
    Class.find({}, function (err, classes) {
        if (err) {
            return next(err)
        }
        if (classes != null) {
            res.json({Code: 200, Info: {classes: classes}});
        } else {
            res.json({Code: 406, Info: 'no class'});
        }
    });
});

/*router.post('/create_equipment', function (req, res, next) {
 Facility.findOne({facility_number: req.body.facility_number}, function (err, facility) {
 if (err) {
 return next(err);
 }
 var equipment = new Equipment({
 facility_number: req.body.facility_number,
 equipment_name: req.body.equipment_name,
 equipment_number: req.body.equipment_number,
 status: 1
 });
 equipment.save(function (err, resp) {
 if (err) {
 console.log(err);
 res.json({
 Code: 499,
 message: err,
 });
 } else {
 res.json({Code: 200, Info: 'sucessfull'});
 }
 });
 })
 });*/
router.post('/create_equipment', function (req, res, next) {
    Facility.findOne({facility_number: req.body.facility_number}, function (err, facility) {
        if (err) {
            return next(err);
        }

        var equipment = new Equipment({
            facilities: {facility_number: req.body.facility_number},
            equipment_name: req.body.equipment_name,
            equipment_number: req.body.equipment_number,
            //equipment_vendorname: req.body.equipment_vendorname,
            status: 1
        });
        var upsertData = equipment.toObject();

        Equipment.count({
            equipment_number: {$regex: new RegExp('^' + req.body.equipment_number + '$', "i")},
            equipment_name: req.body.equipment_name,
            facilities: {facility_number: req.body.facility_number}
        }, function (err, count) {
            if (count) {
                res.json({Code: 200, Info: 'Equipment number already exists'});
            }
            else {
                Equipment.update({equipment_number: req.body.equipment_number}, equipment, {upsert: true}, function (err, resp) {
                    console.log("Session1: " + JSON.stringify(err));
                    if (err) {
                        Equipment.update({equipment_number: req.body.equipment_number}, {$push: {"facilities": {facility_number: req.body.facility_number}}}, function (err, resp) {
                            if (err) {
                                console.log(err);

                                res.json({
                                    Code: 499,
                                    Info: "Error creating equipment",
                                });
                            } else {
                                res.json({Code: 200, Info: 'Equipment added to facility'});
                            }
                        });
                    } else {
                        res.json({Code: 200, Info: 'Equipment created successfully'});
                    }
                });
            }
        });
    });
});
router.post('/equipments', function (req, res, next) {
    Equipment.find({}, function (err, equipments) {
        if (err) {
            return next(err)
        }
        console.log(equipments);
        if (equipments != null) {
            res.json({Code: 200, Info: {equipments: equipments}});
        } else {
            res.json({Code: 406, Info: 'no equipments'});
        }
    });
});

router.post('/create_facility', function (req, res, next) {
    if (!req.body.facility_number || !req.body.facility_name) {
        return res.json({Code: 496, Info: 'All fields are required'});
    }
    // validations ** start

    var query_count_facility = {facility_number: {$regex: new RegExp('^' + req.body.facility_number + '$', "i")}};

    Facility.count(query_count_facility, function (err, facilitycount) {
        if (err) {
            return next(err);
        }
        console.log("query_count_facility" + JSON.stringify(query_count_facility));
        if (facilitycount) {
            return res.json({Code: 498, Info: 'Facility Number already exists'});
        }
        // validations ** end
        var facility = new Facility({
            facility_number: req.body.facility_number,
            facility_name: req.body.facility_name,
            status: 1
        });
        facility.save(function (err, resp) {
            if (err) {
                console.log(err);
                res.json({
                    Code: 499,
                    Info: 'Error creating Facility',
                });
            } else {
                res.json({Code: 200, Info: 'Facility Created sucessfully'});
            }
        });
    });

});
router.post('/facilities', function (req, res, next) {
    Facility.find({}, {facility_users: 0, facility_managers: 0}, function (err, facilities) {
        if (err) {
            return next(err)
        }
        if (facilities != null) {
            res.json({Code: 200, Info: {facilities: facilities}});
        } else {
            res.json({Code: 406, Info: 'no facilities'});
        }
    });
});
router.post('/allfacilities', function (req, res, next) {
    Facility.find({}, {}, function (err, facilities) {
        if (err) {
            return next(err)
        }
        if (facilities != null) {
            res.json({Code: 200, Info: {facilities: facilities}});
        } else {
            res.json({Code: 406, Info: 'no facilities'});
        }
    });
});


router.post('/create_priority', function (req, res, next) {
    if (!req.body.priority_name || !req.body.facility_number) {
        return res.json({Code: 496, Info: 'All fields are required'});
    }
    Facility.findOne({facility_number: req.body.facility_number}, function (err, facility) {
        if (err) {
            return next(err);
        }
        // validations ** start

        var query_count_priority = {
            priority_name: {$regex: new RegExp('^' + req.body.priority_name + '$', "i")},
            "facilities.facility_number": req.body.facility_number
        };

        Priority.count(query_count_priority, function (err, prioritycount) {
            if (err) {
                return next(err);
            }
            console.log("query_count_priority" + JSON.stringify(query_count_priority));
            if (prioritycount) {
                return res.json({Code: 498, Info: 'Priority for the Facility already exists'});
                next();
            }
            // validations ** end
            var query = {
                priority_name: req.body.priority_name
            };
            Priority.update(query, {status: 1, $push: {"facilities": {facility_number: req.body.facility_number}}},
                {safe: true, upsert: true},
                function (err, model) {
                    if (err) {
                        console.log(err);
                        res.json({
                            Code: 499,
                            Info: 'Error creating Priority',
                        });
                    } else {
                        res.json({Code: 200, Info: 'Priority created sucessfull'});
                    }
                });
        });

    })
});
router.post('/priorities', function (req, res, next) {
    Priority.find({}, function (err, priorities) {
        if (err) {
            return next(err)
        }
        if (priorities != null) {
            res.json({Code: 200, Info: {priorities: priorities}});
        } else {
            res.json({Code: 406, Info: 'no priorities'});
        }
    });
});


router.post('/create_skill', function (req, res, next) {
    if (!req.body.facility_number || !req.body.skill_name) {
        return res.json({Code: 496, Info: 'All fields are required'});
    }
    Facility.findOne({facility_number: req.body.facility_number}, function (err, facility) {
        if (err) {
            return next(err);
        }

        // validations ** start

        var query_count_skill = {
            skill_name: {$regex: new RegExp('^' + req.body.skill_name + '$', "i")},
            "facilities.facility_number": req.body.facility_number
        };

        Skill.count(query_count_skill, function (err, skillcount) {
            if (err) {
                return next(err);
            }
            console.log("query_count_skill" + JSON.stringify(query_count_skill));
            if (skillcount) {
                return res.json({Code: 498, Info: 'Skill for the Facility already exists'});
                next();
            }
            var query = {
                skill_name: req.body.skill_name,
            };
            // validations ** end
            Skill.update(query, {status: 1, $push: {"facilities": {facility_number: req.body.facility_number}}},
                {safe: true, upsert: true},
                function (err, model) {
                    if (err) {
                        console.log(err);
                        res.json({
                            Code: 499,
                            Info: 'Error creating skill',
                        });
                    } else {
                        res.json({Code: 200, Info: 'Skill Sucessfully created'});
                    }
                });
        });

    })
});
router.post('/skills', function (req, res, next) {
    Skill.find({}, function (err, skills) {
        if (err) {
            return next(err)
        }
        if (skills != null) {
            res.json({Code: 200, Info: {skills: skills}});
        } else {
            res.json({Code: 406, Info: 'no class'});
        }
    });
});
router.post('/status_list', function (req, res, next) {
    Status.find({}, function (err, status) {
        if (err) {
            return next(err)
        }
        if (status != null) {
            res.json({Code: 200, Info: {status_list: status}});
        } else {
            res.json({Code: 406, Info: 'no status'});
        }
    });
});
router.post('/create_status', function (req, res, next) {
    if (!req.body.status_name || !req.body.facility_number) {
        return res.json({Code: 496, Info: 'All fields are required'});
    }

    Facility.findOne({facility_number: req.body.facility_number}, function (err, facility) {
        if (err) {
            return next(err);
        }
        // validations ** start

        var query_count_status = {
            status_name: {$regex: new RegExp('^' + req.body.status_name + '$', "i")},
            "facilities.facility_number": req.body.facility_number
        };

        Status.count(query_count_status, function (err, statuscount) {
            if (err) {
                return next(err);
            }
            console.log("query_count_status" + JSON.stringify(query_count_status));
            if (statuscount) {
                return res.json({Code: 498, Info: 'Status already exists'});
                next();
            }

            Status.count({}, function (err, incstatuscount) {
                if (err) {
                    return next(err);
                }
                console.log("count_status" + JSON.stringify(incstatuscount));
                if (incstatuscount) {
                    var statuscountinc = incstatuscount + 1;
                }
                // validations ** end
                var query = {
                    status_name: req.body.status_name
                };

                Status.update(query, {
                        $setOnInsert: {status_number: statuscountinc},
                        $push: {"facilities": {facility_number: req.body.facility_number}}
                    },
                    {safe: true, upsert: true},
                    function (err, model) {
                        if (err) {
                            console.log(err);
                            res.json({
                                Code: 499,
                                Info: 'Error creating Status',
                            });
                        } else {
                            res.json({Code: 200, Info: 'Status created sucessfull'});
                        }
                    });
            });
        })

    })
});

router.post('/createparts', function (req, res, next) {
    if (!req.body.equipment_name || !req.body.equipment_number || !req.body.part_number || !req.body.part_name || !req.body.vendor_number || !req.body.vendor_name || !req.body.min_qty || !req.body.max_qty) {
        return res.json({Code: 496, Info: 'All fields are required'});
    }
    if (req.body.min_qty > req.body.max_qty) {
        return res.json({Code: 495, Info: 'Min Qty cant be greater than Max Qty'});
    }
    Equipment.findOne({
        equipment_name: req.body.equipment_name,
        equipment_number: req.body.equipment_number
    }, function (err, facility) {
        if (err) {
            return next(err);
        }

        var pequipments = new Equipment({
            equipment_name: req.body.equipment_name,
            equipment_number: req.body.equipment_number,
            material_number: req.body.part_number,
            material_description: req.body.part_name,
            vendor_number: req.body.vendor_number,
            vendor_name: req.body.vendor_name,
            min_qty: req.body.min_qty,
            max_qty: req.body.max_qty,
            //equipment_vendorname: req.body.equipment_vendorname,
            status: 1
        });
        var upsertData = pequipments.toObject();

        Equipment.count({
            equipment_number: req.body.equipment_number, equipment_name: req.body.equipment_name, equipments: {
                material_number: {$regex: new RegExp('^' + req.body.part_number + '$', "i")},
                material_description: req.body.part_name,
                vendor_number: req.body.vendor_number,
                vendor_name: req.body.vendor_name,
                min_qty: req.body.min_qty,
                max_qty: req.body.max_qty
            }
        }, function (err, count) {
            if (count) {
                res.json({Code: 200, Info: 'Part Number already exists'});
            }
            else {
                Equipment.update({equipment_number: req.body.equipment_number}, pequipments, {upsert: true}, function (err, resp) {
                    console.log("Session1: " + JSON.stringify(err));
                    if (err) {
                        Equipment.update({equipment_number: req.body.equipment_number}, {
                            $push: {
                                "equipments": {
                                    material_number: req.body.part_number,
                                    material_description: req.body.part_name,
                                    vendor_number: req.body.vendor_number,
                                    vendor_name: req.body.vendor_name,
                                    min_qty: req.body.min_qty,
                                    max_qty: req.body.max_qty
                                }
                            }
                        }, function (err, resp) {
                            if (err) {
                                console.log(err);

                                res.json({
                                    Code: 499,
                                    Info: 'Error creating Part',
                                });
                            } else {
                                res.json({Code: 200, Info: 'Part added to facility'});
                            }
                        });
                    } else {
                        res.json({Code: 200, Info: 'Part created successfully'});
                    }
                });
            }
        });
    });
});

router.post('/create_part_request', function (req, res, next) {
    var in_qry = req.body;
    in_qry.status = 1;
    var partRequest = new PartsRequest(in_qry);
    if (req.body.workorder_number != "" && typeof req.body.workorder_number !== 'undefined') {
        WorkOrder.count({workorder_number: req.body.workorder_number, status: 1}, function (err, cnt) {
            if (err) {
            }
            if (cnt != 0) {
                partRequest.save(function (er) {
                    if (er) {
                        res.json({
                            Code: 499,
                            Info: 'Error creating part request'
                        });
                    }
                    res.json({Code: 200, Info: 'Part request created successfully'});
                    sendMailPartRequest(req);
                });
            } else {
                res.json({Code: 499, Info: 'This WorkOrder dont exist or already Closed'});
            }
        });
    } else {
        partRequest.save(function (er) {
            if (er) {
                res.json({
                    Code: 499,
                    Info: 'Error creating part request'
                });
            }
            res.json({Code: 200, Info: 'Part request created successfully'});
            sendMailPartRequest(req);
        });
    }


});

router.post('/partsequipments', function (req, res, next) {
    Equipment.find({}, {_id: 0, equipment_number: 1, equipment_name: 1}, function (err, partsequipments) {
        if (err) {
            return next(err)
        }
        // var partsequipments_obj = [];
        // for (var pe in partsequipments) {
        //             partsequipments_obj.push(partsequipments[pe].equipment_number + ":" +  partsequipments[pe].equipment_name);
        //         }
        // console.log("partsequipments_obj: "+ JSON.stringify(partsequipments_obj));
        // console.log("partsequipments_obj_0: "+ JSON.stringify(partsequipments_obj[0]));
        // console.log("partsequipments_obj_1: "+ JSON.stringify(partsequipments_obj[1]));
        if (partsequipments != null) {
            res.json({Code: 200, Info: {partsequipments: partsequipments}});
            //res.json({Code: 200, Info: {partsequipments: partsequipments_obj}});

        } else {
            res.json({Code: 406, Info: 'no class'});
        }
    });
});

router.post('/get_parts', function (req, res, next) {
    Equipment.aggregate([
        {
            $unwind: "$equipments"
        },
        {
            $match: {
                "equipments.material_number": req.body.part_number,

            }
        },
        {
            $project: {
                equipment_number: 1,
                equipment_name: 1,
                "equipments.material_number": 1,
                "equipments.material_description": 1,
                "equipments.vendor_number": 1,
                "equipments.vendor_name": 1,
                "equipments.min_qty": 1,
                "equipments.max_qty": 1

            }

        }], function (err, result) {
        if (err) {
            return next(err)
        }
        if (result != null) {
            console.log("API result: " + JSON.stringify(result));
            var tempstr = JSON.stringify(result).slice(1, -1);
            var gpresult = JSON.parse(tempstr);
            res.json({Code: 200, Info: {equipment: gpresult}});
        } else {
            res.json({Code: 406, Info: 'provide details are wrong.'});
        }
    });
});

router.post('/edit_parts', function (req, res, next) {
    console.log("Api JS Edit parts 1: " + JSON.stringify(req.body));
    Equipment.count({
        _id: req.body._id,
        equipment_number: req.body.equipment_number,
        equipment_name: req.body.equipment_name,
        "equipments.material_number": req.body.material_number,
        "equipments.min_qty": req.body.min_qty,
        "equipments.max_qty": req.body.max_qty
    }, function (err, equipment_count) {
        if (err) {
            return next(err);
        }
        else if (equipment_count) {
            return res.json({Code: 299, Info: 'No changes made to the document'});

            next();
        }
        else {
            Equipment.update({
                    _id: req.body._id,
                    equipment_number: req.body.equipment_number,
                    "equipments.material_number": req.body.material_number
                }, {$set: {"equipments.$.min_qty": req.body.min_qty, "equipments.$.max_qty": req.body.max_qty}},
                function (err, model) {
                    console.log(err);
                });
        }
        res.json({Code: 200, Info: 'Document updated'});
    });

}, function (err) {
    console.log(err);
});

router.post('/search_facilities', function (req, res, next) {
    Facility.find(
        {
            facility_users: {
                $elemMatch: {user_id: req.body._id}
            }
        }, {facility_users: 0, facility_managers: 0}, function (err, facilities) {
            if (err) {
                return next(err)
            }
            if (facilities != null) {
                res.json({Code: 200, Info: {facilities: facilities}});
            } else {
                res.json({Code: 406, Info: 'no facilities'});
            }
        });
});
router.post('/edit_facility', function (req, res, next) {
    Facility.count({
        _id: req.body._id,
        facility_number: req.body.facility_number,
        facility_name: req.body.facility_name
    }, function (err, facility_count) {
        if (err) {
            return next(err);
        }
        else if (facility_count) {
            return res.json({Code: 299, Info: 'No changes made to the document'});

            next();
        }
        else {
            Facility.update({
                    _id: req.body._id,
                    facility_number: req.body.facility_number
                }, {$set: {"facility_name": req.body.facility_name}},
                function (err, model) {
                    console.log(err);
                });
        }
        res.json({Code: 200, Info: 'Document updated'});
    });

}, function (err) {
    console.log(err);
});
router.post('/get_facility', function (req, res, next) {
    Facility.findOne(
        {
            facility_number: req.body.facility_number
        }, {facility_number: 1, facility_name: 1}, function (err, facility) {
            if (err) {
                return next(err)
            }
            if (facility != null) {
                res.json({Code: 200, Info: {facility: facility}});
            } else {
                res.json({Code: 406, Info: 'provide details are wrong.'});
            }
        });
});

router.post('/search_category', function (req, res, next) {
    var query = {
        facilities: {
            $elemMatch: {facility_number: req.body.facility_number}
        }
    };
    console.log(req.body.operator_available);
    if (typeof req.body.operator_available !== 'undefined') {
        query.operator_available = Boolean(req.body.operator_available);
    }
    console.log(query);
    Category.find(
        query, function (err, categories) {
            if (err) {
                return next(err)
            }
            if (categories != null) {
                res.json({Code: 200, Info: {categories: categories}});
            } else {
                res.json({Code: 406, Info: 'no facilities'});
            }
        });
});

router.post('/search_equipment', function (req, res, next) {
    Equipment.find(
        {
            facilities: {
                $elemMatch: {facility_number: req.body.facility_number}
            }
        }, function (err, equipments) {
            if (err) {
                return next(err)
            }
            if (equipments != null) {
                res.json({Code: 200, Info: {equipments: equipments}});
            } else {
                res.json({Code: 406, Info: 'no equipments'});
            }
        });
});
router.post('/get_equipment', function (req, res, next) {
    Equipment.findOne(
        {
            equipment_number: req.body.equipment_number
        }, {equipment_number: 1, equipment_name: 1, facilities: 1}, function (err, equipment) {
            if (err) {
                return next(err)
            }
            if (equipment != null) {
                res.json({Code: 200, Info: {equipment: equipment}});
            } else {
                res.json({Code: 406, Info: 'provide details are wrong.'});
            }
        });
});

router.post('/edit_equipment', function (req, res, next) {
    Equipment.count({
        _id: req.body._id,
        equipment_number: req.body.equipment_number,
        equipment_name: req.body.equipment_name
    }, function (err, equipment_count) {
        if (err) {
            return next(err);
        }
        else if (equipment_count) {
            return res.json({Code: 299, Info: 'No changes made to the document'});

            next();
        }
        else {
            Equipment.update({
                    _id: req.body._id,
                    equipment_number: req.body.equipment_number
                }, {$set: {"equipment_name": req.body.equipment_name}},
                function (err, model) {
                    console.log(err);
                });
        }
        res.json({Code: 200, Info: 'Document updated'});
    });

}, function (err) {
    console.log(err);
});
router.post('/search_priority', function (req, res, next) {
    Priority.find(
        {
            facilities: {
                $elemMatch: {facility_number: req.body.facility_number}
            }
        }, function (err, priorities) {
            if (err) {
                return next(err)
            }
            if (priorities != null) {
                res.json({Code: 200, Info: {priorities: priorities}});
            } else {
                res.json({Code: 406, Info: 'no equipments'});
            }
        });
});
router.post('/manager_workorder', function (req, res, next) {
    Facility.find(
        {
            facility_users: {
                $elemMatch: {user_id: req.body._id}
            }
        }, {facility_users: 0, facility_managers: 0}, function (err, facilities) {
            if (err) {
                return next(err)
            }
            if (facilities != null) {
                var facilities_array = [];
                for (var fa in facilities) {
                    facilities_array.push(facilities[fa].facility_number);
                }

                Roles.findOne({_id: req.body.userrole}, function (err, role) {
                    if (err) {
                        return next(err)
                    }
                    console.log(role);
                    var query = {workorder_facility: {$in: facilities_array}};
                    if (role.role_name == 'technician') {
                        //query.workorder_technician = req.body._id;
                    }
                    if (role.role_name == 'clerk') {
                        //query.workorder_technician = req.body._id;
                        PartsRequest.find({
                            status: 1,
                            workorder_number: {$exists: true}
                        }, function (error, partrequest) {
                            if (error) {
                                return next(err);
                            }

                            if (partrequest != null) {
                                var list_workorders = [];
                                for (var ky in partrequest) {
                                    list_workorders.push(partrequest[ky].workorder_number);
                                }
                                query = {
                                    workorder_number: {$in: list_workorders}
                                };
                                query.status = 1;
                                console.log(query);
                                WorkOrder.find(query, {}, {
                                    sort: {
                                        _id: -1 //Sort by Date Added DESC
                                    }
                                }, function (err, workorders) {
                                    if (err) {
                                        return next(err)
                                    }
                                    if (workorders != null) {
                                        res.json({Code: 200, Info: {workorders: workorders}});
                                    } else {
                                        res.json({Code: 406, Info: 'no workorders'});
                                    }
                                });
                            }
                        });
                    } else {
                        query.status = 1;
                        WorkOrder.find(query, {}, {
                            sort: {
                                _id: -1 //Sort by Date Added DESC
                            }
                        }, function (err, workorders) {
                            if (err) {
                                return next(err)
                            }
                            if (workorders != null) {
                                res.json({Code: 200, Info: {workorders: workorders}});
                            } else {
                                res.json({Code: 406, Info: 'no workorders'});
                            }

                        });
                    }
                });
            } else {
                res.json({Code: 406, Info: 'no facilities'});
            }
        });
});
router.post('/search_skill', function (req, res, next) {
    Skill.find(
        {
            facilities: {
                $elemMatch: {facility_number: req.body.facility_number}
            }
        }, function (err, skills) {
            if (err) {
                return next(err)
            }
            if (skills != null) {
                res.json({Code: 200, Info: {skills: skills}});
            } else {
                res.json({Code: 406, Info: 'no skills'});
            }
        });
});
router.post('/search_class', function (req, res, next) {
    Class.find(
        {
            facilities: {
                $elemMatch: {facility_number: req.body.facility_number}
            }
        }, function (err, classes) {
            if (err) {
                return next(err)
            }
            if (classes != null) {
                res.json({Code: 200, Info: {classes: classes}});
            } else {
                res.json({Code: 406, Info: 'no facilities'});
            }
        });
});
router.post('/search_status', function (req, res, next) {
    Status.find(
        {
            facilities: {
                $elemMatch: {facility_number: req.body.facility_number}
            }
        }, function (err, statuses) {
            if (err) {
                return next(err)
            }
            if (statuses != null) {
                res.json({Code: 200, Info: {statuses: statuses}});
            } else {
                res.json({Code: 406, Info: 'no statuses'});
            }
        });
});
router.post('/get_users_type', function (req, res, next) {
    Facility.findOne({
        facility_number: req.body.facility_number
    }, function (err, facility) {
        if (err) {
            return next(err)
        }
        if (facility != null) {
            var fusers = facility.facility_users;
            var user_ids = [];
            for (var user_key in fusers) {
                user_ids.push(fusers[user_key].user_id);
            }
            Roles.findOne({role_name: 'technician'}, function (err, role) {
                if (err) {
                    return next(err);
                }
                Users.find({_id: {$in: user_ids}, userrole: role._id}, function (err, users) {
                    if (err) {
                        return next(err)
                    }
                    if (users != null) {
                        res.json({Code: 200, Info: {users: users}});
                    } else {
                        res.json({Code: 406, Info: 'no users'});
                    }
                });
            });

        }
    });

});
router.post('/get_workorder', function (req, res, next) {
    WorkOrder.findOne(
        {
            workorder_number: req.body.workorder_number
        }, function (err, workorder) {
            if (err) {
                return next(err)
            }
            if (workorder != null) {
                res.json({Code: 200, Info: {workorder: workorder}});
            } else {
                res.json({Code: 406, Info: 'provide details are wrong.'});
            }
        });
});
router.post('/get_user', function (req, res, next) {
    Users.findOne(
        {
            _id: req.body.workorder_creator
        }, function (err, user) {
            if (err) {
                return next(err)
            }
            if (user != null) {
                res.json({Code: 200, Info: {user: user}});
            } else {
                res.json({Code: 406, Info: 'provide details are wrong.'});
            }
        });
});
router.post('/update_workorder', function (req, res, next) {
    var requestedArray = req.body;
    if (req.body.wo_goodsreceipt == 1) {
        PartsRequest.findOneAndUpdate({'workorder_number': req.body.workorder_number}, {'status': 1}, {upsert: false}, function (err, doc) {

        });
    }
    if (typeof requestedArray.wo_datecomplete !== "undefined") {
        requestedArray.wo_datecomplete = dateToDesireDateString(requestedArray.wo_datecomplete);
    }
    if (req.body.wo_pm_frequency > 0 && typeof requestedArray.workorder_PM !== 'undefined') {
        var pmNumber;
        requestedArray.workorder_PM = pmNumber = req.body.wo_pm_number;
        if (req.body.pm_task == 1) {
            requestedArray.workorder_PM = pmNumber = req.body.wo_pm_number;
        }
        if (req.body.wo_pm_previous_date === undefined) {
            var previous_date = new Date()
        } else {
            var previous_date = req.body.wo_pm_previous_date;
        }
        var pm_task = {
            pm_number: pmNumber,
            pm_frequency: req.body.wo_pm_frequency,
            pm_next_date: dateToDesireDateString(req.body.wo_pm_date),
            pm_current_date: new Date().valueOf(),
            pm_previous_date: new Date(previous_date).valueOf(),
            status: 1
        };
        var where = {pm_number: pm_task.pm_number};
        requestedArray.workorder_number = parseInt(req.body.workorder_number);
        WorkOrder.count({
            workorder_PM: pm_task.pm_number,
            workorder_number: parseInt(req.body.workorder_number)
        }, function (err, count) {
            if (count != 0) {
                PM.findOneAndUpdate(where, pm_task, {upsert: true}, function (err, pm) {
                    if (err) {
                        console.log(err);
                    }
                    updateWorkOrder({'workorder_number': parseInt(req.body.workorder_number)}, requestedArray, req, res);
                });
            } else {
                PM.count(where, function (er, cnt) {
                    if (cnt == 0) {
                        PM.findOneAndUpdate(where, pm_task, {upsert: true}, function (err, pm) {
                            if (err) {
                                console.log(err);
                            }
                            updateWorkOrder({'workorder_number': parseInt(req.body.workorder_number)}, requestedArray, req, res);
                        });
                    } else {
                        res.json({Code: 499, Info: 'PM Task already in use'});
                    }
                });
            }
        });
    } else {
        requestedArray.workorder_number = parseInt(req.body.workorder_number);
        updateWorkOrder({'workorder_number': parseInt(req.body.workorder_number)}, requestedArray, req, res);
    }


});
router.post('/get_pm_task', function (req, res, next) {
    PM.findOne(req.body, function (err, pm_task) {
        if (err) {
            return next(err)
        }

        if (pm_task != null) {
            res.json({Code: 200, Info: {pm_task: pm_task}});
        } else {
            res.json({Code: 406, Info: 'Not able to find any task'});
        }
    });
});
router.post('/get_role', function (req, res, next) {
    Roles.findOne(req.body, function (err, user_role) {
        if (err) {
            return next(err)
        }
        if (user_role != null) {
            res.json({Code: 200, Info: {user_role: user_role}});
        } else {
            res.json({Code: 406, Info: 'No User Role'});
        }
    });
});
router.post('/get_roles', function (req, res, next) {
    Roles.find({}, function (err, roles) {
        if (err) {
            return next(err)
        }
        if (roles != null) {
            res.json({Code: 200, Info: {roles: roles}});
        } else {
            res.json({Code: 406, Info: 'No User Role'});
        }
    });
});
router.post('/get_users', function (req, res, next) {
    Users.find(req.body, function (err, users) {
        if (err) {
            return next(err)
        }
        if (users != null) {
            res.json({Code: 200, Info: {users: users}});
        } else {
            res.json({Code: 406, Info: 'No Users'});
        }
    });
});

router.post('/get_user_details', function (req, res, next) {
    var userd;
    console.log("in apijs get user details: " + req.body.user_email);
    Users.aggregate([
        {
            $match: {"email": req.body.user_email}
        },
        {
            $lookup: {
                from: "collection_roles",
                localField: "userrole",
                foreignField: "_id",
                as: "roles"
            }
        }], function (err, result) {
        if (result) {
            var tempstr = JSON.stringify(result).slice(1, -1);
            userd = JSON.parse(tempstr);
            var queryud;

            if (userd.roles[0].role_name == "manager") {
                queryud = {facility_managers: {$elemMatch: {user_id: userd._id, email: userd.email}}};
            } else {
                queryud = {facility_users: {$elemMatch: {user_id: userd._id, email: userd.email}}};
            }

            Facility.findOne(queryud, {facility_number: 1, facility_name: 1}, function (err, facility) {
                if (err) {
                    return next(err)
                }
                if (facility != null) {

                    userd.facility_number = facility.facility_number;
                    userd.facility_name = facility.facility_name;

                    res.json({Code: 200, Info: {user: userd}});
                } else {
                    userd.facility_number = "";
                    userd.facility_name = "";

                    res.json({Code: 200, Info: {user: userd}});
                }
            });
            //console.log("userd after log last : "+ JSON.stringify(userd));

        }
        else {
            next(err);
        }

    });

});

router.post('/edit_user', function (req, res, next) {
    console.log("Details in apijs: " + JSON.stringify(req.body));
    Users.count({
        _id: req.body._id,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        userrole: req.body.userrole,
        password: req.body.password
    }, function (err, user_count) {
        if (err) {
            return next(err);
        }
        if (user_count) {
            return res.json({Code: 299, Info: 'No changes made to the document'});

            next();
        }
        else {
            Users.update({_id: req.body._id, email: req.body.email}, {
                    $set: {
                        "firstname": req.body.firstname,
                        "lastname": req.body.lastname,
                        "userrole": req.body.userrole,
                        "password": req.body.password
                    }
                },
                function (err, model) {
                    console.log(err);
                });
        }
        res.json({Code: 200, Info: 'Document updated'});
    });

}, function (err) {
    console.log(err);
});

router.post('/get_search_wo', function (req, res, next) {
    var query = req.body;
    var user_details = {
        user_id: req.body.user_id,
        userrole: req.body.userrole,
        role: req.body.role
    };
    delete query['user_id'];
    delete query['userrole'];
    delete query['role'];
    if (user_details.role == 'technician') {
        //query.workorder_technician = user_details.user_id;
    }
    if (typeof req.body.created_on_from !== "undefined") {
        if (typeof req.body.created_on_to === "undefined") {
            var created_on = dateFormat(new Date(), 'yyyymmdd');
        } else {
            var created_on = dateFormat(new Date(req.body.created_on_to), 'yyyymmdd');
            delete query['created_on_to'];
        }
        query.created_on = {
            '$gte': dateFormat(new Date(req.body.created_on_from), 'yyyymmdd'),
            '$lte': created_on

        };
        delete query['created_on_from'];
    }
    if (typeof req.body.wo_datecomplete_from !== "undefined") {
        if (typeof req.body.wo_datecomplete_to === "undefined") {
            var created_on = dateFormat(new Date(), 'yyyymmdd');
        } else {
            var created_on = dateFormat(new Date(req.body.wo_datecomplete_to), 'yyyymmdd');
            delete query['wo_datecomplete_to'];
        }
        query.wo_datecomplete = {
            $exists: true,
            '$gte': dateFormat(new Date(req.body.wo_datecomplete_from), 'yyyymmdd'),
            '$lte': created_on
        };
        delete query['wo_datecomplete_from'];
    }
    if (typeof req.body.wo_pm_date_from !== "undefined") {
        var pMquery = {};
        if (typeof req.body.wo_pm_date_to === "undefined") {
            var created_on = dateFormat(new Date(), 'yyyymmdd');
        } else {
            var created_on = dateFormat(new Date(req.body.wo_datecomplete_to), 'yyyymmdd');
            delete query['wo_pm_date_to'];
        }
        pMquery.pm_next_date = {
            '$gte': dateFormat(new Date(req.body.wo_pm_date_from), 'yyyymmdd'),
            '$lte': created_on
        };
        delete query['wo_pm_date_from'];
        PM.find(pMquery, function (err, pm) {
            if (err) {
                return next(err)
            }
            var pm_list = [];
            for (var ky in pm) {
                console.log(pm[ky]);
                pm_list.push(pm[ky].pm_number)
            }
            query.workorder_PM = {$in: pm_list};
            console.log('pmdate');
            console.log(query);
            WorkOrder.find(query, {}, {
                sort: {
                    _id: -1 //Sort by Date Added DESC
                }
            }, function (err, workOrders) {
                if (err) {
                    return next(err)
                }
                if (workOrders != null) {
                    res.json({Code: 200, Info: {workorders: workOrders}});
                } else {
                    res.json({Code: 406, Info: 'No Users'});
                }
            });
        });


    } else {
        console.log(query);
        WorkOrder.find(query, {}, {
            sort: {
                _id: -1 //Sort by Date Added DESC
            }
        }, function (err, workOrders) {
            if (err) {
                return next(err)
            }
            if (workOrders != null) {
                res.json({Code: 200, Info: {workorders: workOrders}});
            } else {
                res.json({Code: 406, Info: 'No Users'});
            }
        });
    }

});


var SendMail = function (req, it_pm_workorder) {
    Facility.findOne({facility_number: req.body.workorder_facility}, function (err, facility) {
        if (err) {
            console.log(err);
        }
        Category.findOne({_id: req.body.workorder_category}, function (err, category) {
            if (err) {
                console.log(err);
            }
            Equipment.findOne({_id: req.body.workorder_equipment}, function (err, equipment) {
                if (err) {
                    console.log(err);
                }
                Priority.findOne({_id: req.body.workorder_priority}, function (err, priority) {
                    if (err) {
                        console.log(err);
                    }
                    Users.findOne({_id: req.body.user_id}, function (err, user) {
                        if (err) {
                            console.log(err);
                        }
                        console.log(user);
                        Roles.findOne({_id: user.userrole}, function (err, role) {
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
                            //manager_email = "pgmanager7@gmail.com,";
                            //console.log(manager_email);
                            if (role.role_name == 'clerk') {
                                Users.findOne({_id: req.body.workorder_technician}, function (err, tech) {
                                    var mail_to = manager_email + tech.email;
                                    var last_message = ' parts received';
                                    send(mail_to, last_message, req, facility, category, equipment, priority);
                                });

                            } else {
                                if (role.role_name == 'technician') {
                                    var mail_to = manager_email;
                                    if (req.body.status == 1) {
                                        var last_message = ' has been updated';
                                    } else {
                                        if (req.body.status == 2) {
                                            var last_message = ' has been closed';
                                        } else {
                                            var last_message = ' has been on hold';
                                        }
                                    }
                                    send(mail_to, last_message, req, facility, category, equipment, priority);
                                } else {
                                    if (req.body.status != 2) {
                                        Users.findOne({_id: req.body.workorder_technician}, function (err, tech) {
                                            var mail_to = tech.email;
                                            var last_message = ' has been assgined';
                                            send(mail_to, last_message, req, facility, category, equipment, priority);
                                        });
                                    }


                                }

                            }


                        });
                    });
                });
            });
        });
    });
};
var send = function (mail_to, last_message, req, facility, category, equipment, priority) {
    var mailData = {
        // Comma separated list of recipients
        to: mail_to,
        // Subject of the message
        subject: 'Maintenance Work Order number ' + setPadZeros(parseInt(req.body.workorder_number), 8) + last_message, //

        // plaintext body
        //text: 'Hello to sunil',

        // HTML body
        html: '<p>Maintenace Work Order number <b>' + setPadZeros(parseInt(req.body.workorder_number), 8) + '</b>' + last_message + '</p>'
        +
        '<p><b>Work Order Details</b></p>'
        +
        '<p><b>Work Order Number</b>: ' + setPadZeros(parseInt(req.body.workorder_number), 8) + '</p>'
        +
        '<p><b>Work Order Date</b>: ' + req.body.created_on + '</p>'
        +
        '<p><b>Facility</b>: ' + facility.facility_name + '</p>'
        +
        '<p><b>Category</b>: ' + category.category_name + '</p>'
        +
        '<p><b>Equipment</b>: ' + equipment.equipment_name + '</p>'
        +
        '<p><b>Priority</b>: ' + priority.priority_name + '</p>'
        +
        '<p><b>Description</b>: ' + req.body.workorder_description + '</p>'
        +
        '<p>Please click <a href="http://183.82.107.134:3030">here</a> for Maintenance Work Order Application</p>'

    };
    transporter.sendMail(mailData, function (err, info) {
        if (err) {
            console.log(err);
        }
        console.log('Message sent successfully!');

    });
};
var updateWorkOrder = function (query, requestedArray, req, res) {
    //delete requestedArray['user_id'];
    if (requestedArray.wo_pm_frequency != "") {
        var pm_frequency = requestedArray['wo_pm_frequency'];
        var it_pm_workorder = 1;
    } else {
        var it_pm_workorder = 0;
    }
    delete requestedArray['wo_pm_frequency'];
    //delete requestedArray['wo_pm_date'];
    delete requestedArray['wo_pm_previous_date'];
    delete requestedArray['__v'];
    requestedArray.created_on = dateToDesireDateString(requestedArray.created_on);
    if (typeof requestedArray.wo_pm_date !== "undefined") {
        requestedArray.wo_pm_date = dateToDesireDateString(requestedArray.wo_pm_date);
    }
    WorkOrder.findOneAndUpdate(query, requestedArray, {upsert: false}, function (err, doc) {
        if (err) return res.json({Code: 500, Info: err});
        if (doc != null) {
            if (typeof requestedArray.workorder_PM !== 'undefined' && requestedArray.status == 2) {
                WorkOrder.count({
                    workorder_PM: requestedArray.workorder_PM,
                    created_on: {'$gt': requestedArray.created_on}
                }, function (err, wrkordr) {
                    if (err) {
                        console.log(err);
                    }
                    if (wrkordr == 0) {
                        createWorkOrderPM({
                            pm_number: requestedArray.workorder_PM,
                            wo_pm_date: requestedArray.wo_pm_date,
                            pm_frequency: pm_frequency
                        });
                    }
                });

            }
            SendMail(req, it_pm_workorder);
            res.json({Code: 200, Info: "succesfully saved"});
        } else {
            res.json({Code: 499, Info: "Not able update"});
        }

    });
};
var createWorkOrderPM = function (task) {

    WorkOrder.findOne({workorder_PM: task.pm_number}, function (err, wkOrd) {
        if (err) {
            return false;
        }
        counters.increment('workorder_number', function (err, result) {
            if (err) {
                console.error('Counter on workeOrder error: ' + err);
                return;
            }
            var pm_date = new Date(dateStringToDate(task.wo_pm_date));
            pm_date.setDate(pm_date.getDate() + parseInt(task.pm_frequency));
            var pmdate = dateFormat(pm_date, 'yyyymmdd')

            var insert_query = {
                workorder_number: result.seq,
                workorder_creator: wkOrd.workorder_creator,
                workorder_description: wkOrd.workorder_description,
                workorder_facility: wkOrd.workorder_facility,
                workorder_category: wkOrd.workorder_category,
                workorder_equipment: wkOrd.workorder_equipment,
                workorder_priority: wkOrd.workorder_priority,
                workorder_skill: wkOrd.workorder_skill,
                workorder_class: wkOrd.workorder_class,
                created_on: task.wo_pm_date,
                workorder_PM: wkOrd.workorder_PM,
                wo_pm_date: pmdate,
                status: 1
            };
            console.log(insert_query);
            var workOrder = new WorkOrder(insert_query);
            workOrder.save(function (err, resp) {
                if (err) {
                    console.log(err);
                    res.json({
                        Code: 499,
                        Info: 'Error creating workorder',
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
                                    //manager_email = "pgmanager7@gmail.com,";
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
                                        '<p><b>Work Order Date</b>: ' + task.wo_pm_date + '</p>'
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

};
var sendMailPartRequest = function (req) {
    Users.findOne({_id: req.body.user_id}, function (err, user) {
        if (err) {
            console.log(err);
        }
        if (user != null) {
            Facility.findOne({
                facility_users: {
                    $elemMatch: {user_id: req.body.user_id}
                }
            }, function (err, facility) {

                var users = facility.facility_users;
                var users_managers = facility.facility_managers;
                console.log(facility.facility_managers);
                var users_in = [];
                for (var ky in users) {
                    users_in.push(users[ky].user_id)
                }
                var mail_managers = "";
                for (var ke in users_managers) {
                    if (typeof users_managers[ke].email !== 'undefined') {
                        mail_managers += users_managers[ke].email + ',';
                    }
                }
                console.log('mail');
                console.log(mail_managers);
                mail(mail_managers, req);
                Roles.findOne({role_name: 'clerk'}, function (err, userrole) {
                    if (err) {
                    }
                    Users.find({_id: {$in: users_in}, userrole: userrole._id}, function (err, userlist) {
                        if (err) {
                        }
                        var mail_clerks = "";
                        for (var k in userlist) {
                            mail_clerks += userlist[k].email + ',';
                        }
                        console.log('mailc');
                        console.log(mail_clerks);
                        mail(mail_clerks, req);
                    });
                });
            });
        }
    });


};

function mail(mail_to, req) {
    Equipment.aggregate([
        {
            $unwind: "$equipments"
        },
        {
            $match: {
                "equipments.material_number": req.body.material_number,
            }
        },
        {
            $project: {
                equipment_number: 1,
                equipment_name: 1,
                "equipments.material_number": 1,
                "equipments.material_description": 1,
                "equipments.vendor_number": 1,
                "equipments.vendor_name": 1
            }

        }], function (err, result) {
        if (err) {
            return next(err)
        }
        if (result != null) {

            if (isNaN(parseInt(req.body.workorder_number))) {
                var wo_number = "-";
            } else {
                var wo_number = setPadZeros(parseInt(req.body.workorder_number), 8);
            }
            console.log("API result: " + JSON.stringify(result));
            var tempstr = JSON.stringify(result).slice(1, -1);
            var gpresult = JSON.parse(tempstr);
            var mailData = {
                // Comma separated list of recipients
                to: mail_to,
                // Subject of the message
                subject: 'Part Request', //

                // plaintext body
                //text: 'Hello to sunil',

                // HTML body
                html: '<p>Parts Request raised for following equipment<b>'
                +
                '<p><b>Work Order Number</b>: ' + wo_number + '</p>'
                +
                '<p><b>Qty</b>: ' + req.body.qty + '</p>'
                +
                '<p><b>Date</b>: ' + dateFormat(new Date(), 'shortDate') + '</p>'
                +
                '<p><b>Equipment Number</b>: ' + gpresult.equipment_number + '</p>'
                +
                '<p><b>Equipment Name</b>: ' + gpresult.equipment_name + '</p>'
                +
                '<p><b>Part Number</b>: ' + gpresult.equipments.material_number + '</p>'
                +
                '<p><b>Part Description</b>: ' + gpresult.equipments.material_description + '</p>'
                +
                '<p><b>Vendor Name</b>: ' + gpresult.equipments.vendor_name + '</p>'
                +
                '<p><b>Vendor Number</b>: ' + gpresult.equipments.vendor_number + '</p>'
                +
                '<p>Please click <a href="http://183.82.107.134:3030">here</a> for Part request</p>'

            };
            transporter.sendMail(mailData, function (err, info) {
                if (err) {
                    console.log(err);
                }
                console.log('Message sent successfully!');

            });
        } else {
            res.json({Code: 406, Info: 'provide details are wrong.'});
        }
    });

}

function getNextSequence(name) {
    counters.increment;
    var ret = counters.findAndModify(
        {
            query: {_id: name},
            update: {$inc: {seq: 1}},
            new: true
        }
    );

    return ret.seq;
}
var setPadZeros = function (num, size) {
    try {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    } catch (err) {
        return null;
    }
};

var dateToDesireDateString = function (str) {
    var res = str.split("/");
    var mm = (parseInt(res[0]) < 10) ? '0' + parseInt(res[0]) : res[0];
    var dd = (parseInt(res[1]) < 10) ? '0' + parseInt(res[1]) : res[1];
    return res[2] + mm + dd;
}

var dateStringToDateISO = function (str) {
    var res = str.split("");
    var year = "";
    var month = "";
    var day = "";
    for (var i = 0; i < res.length; i++) {
        if (i < 4) {
            year += res[i];
        } else {
            if (i > 5) {
                day += res[i];
            } else {
                month += res[i];
            }
        }
    }
    return month + "/" + day + "/" + year;
};

var dateStringToDate = function (str) {
    var res = str.split("");
    var year = "";
    var month = "";
    var day = "";
    for (var i = 0; i < res.length; i++) {
        if (i < 4) {
            year += res[i];
        } else {
            if (i > 5) {
                day += res[i];
            } else {
                month += res[i];
            }
        }
    }
    return year + "-" + month + "-" + day;
};

module.exports = router;
