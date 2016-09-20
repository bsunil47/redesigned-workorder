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
var PartsRequest = mongoose.model('Collection_PartRequest');
var counters = mongoose.model('counter');

router.post('/', function(req, res, next) {

  Users.findOne({email: req.body.username,password: req.body.password},function(err, users) {
    if (err) { return next(err); }

    if (users != null) {
      Roles.findOne({_id: users.userrole},function(err,role) {
        if (err) { return next(err); }
          /*Facility.find({}, function (err, facilities) {
              if (err) {
                  return next(err);
              }
              res.json({Code: 200, Info: {user: users, role: role.role_name, facilities: facilities}});
           });*/
          res.json({Code: 200, Info: {user: users, role: role.role_name}});

      });


    }else {
      res.json({Code: 406,Info: 'no user'});
    }

  });
  //Res.json('respond with asa resource');
});

router.post('/userlist', function(req, res, next) {
  Users.find({},function(err, users) {
    if (err) {
      return next(err)

    }
      if (users != null) {
      Roles.find({},function(err,role) {
        if (err) { return next(err); }
        res.json({Code: 200,Info: {users: users, roles: role}});
      })

    }else {
      res.json({Code: 406,Info: 'no user'});
    }

  });
  //Res.json('respond with asa resource');
});

router.post('/createuser', function(req, res, next) {
  Roles.findOne({role_name: req.body.userrole},function(err,role) {
    if (err) { return next(err); }
    var user = new Users({
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      userrole: role._id,
      status: 1,
      password: req.body.password,
    });
    user.save(function(err,resp) {
      if (err) {

        console.log(err);
        res.json({
          Code: 499,
          message: 'Already used',
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
          Facility.update(query, {$push: {"facility_users": {user_id: resp._id.toString(), email: req.body.email}}},
              {safe: true, upsert: true},
              function (err, model) {
                  console.log(err);
              });
        res.json({Code: 200,Info: 'sucessfull'});
      }
    });
    //Res.json({Code:200,Info:{user:users,role:role.role_name}});
  });

  //User.save();
  //res.json({Code:200,Info:"sucessfull"});
  //res.json('respond with asa resource');
});

router.post('/changepassword', function(req, res, next) {
  //Return res.json({Code:200,Info:"sucessfull"});
  var query = {_id: req.body.id};
  Users.findOne(query,function(err,user) {
    if (err) {
      res.json({
        Code: 499,
        message: err,
      });
    }else {
      Users.findOneAndUpdate(query, {password: req.body.password}, {upsert: true}, function(err, doc) {
        if (err) return res.send(500, {error: err});
        return res.json({Code: 200, Info: 'sucessfull'});
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
                created_on: new Date().valueOf(),
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
                                    if (req.body.workorder_facility == 'US51') {
                                        var mail_to = '"Arun" <pgmanager7@gmail.com>';
                                    } else {
                                        var mail_to = '"Eshwar" <pgmanager7@gmail.com>';
                                    }
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
                                        '<p><b>Work Order Date</b>: ' + date + '</p>'
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
    Facility.findOne({facility_number: req.body.facility_number}, function (err, facility) {
        if (err) {
            return next(err);
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
                        message: err,
                    });
                } else {
                    res.json({Code: 200, Info: 'sucessfull'});
                }
            });

        /* var category = new Category({
            facility_number: req.body.facility_number,
            category_name: req.body.category_name,
            status: 1
        });
        category.save(function (err, resp) {
            if (err) {
                console.log(err);
                res.json({
                    Code: 499,
                    message: err,
                });
            } else {
                res.json({Code: 200, Info: 'sucessfull'});
            }
         });*/
    })
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
        var query = {
            class_name: req.body.class_name
        };
        Category.update(query, {status: 1, $push: {"facilities": {facility_number: req.body.facility_number}}},
            {safe: true, upsert: false},
            function (err, model) {
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
        /*var clas = new Class({
            facility_number: req.body.facility_number,
            class_name: req.body.class_name,
            status: 1
        });
        clas.save(function (err, resp) {
            if (err) {
                console.log(err);
                res.json({
                    Code: 499,
                    message: err,
                });
            } else {
                res.json({Code: 200, Info: 'sucessfull'});
            }
         });*/
    })
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
            equipment_number: req.body.equipment_number,
            equipment_name: req.body.equipment_name,
            facilities: {facility_number: req.body.facility_number}
        }, function (err, count) {
            if (count) {
                res.json({Code: 200, Info: 'Document already exists'});
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
                                    message: err,
                                });
                            } else {
                                res.json({Code: 200, Info: 'sucessfull in if'});
                            }
                        });
                    } else {
                        res.json({Code: 200, Info: 'sucessfull'});
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
                message: err,
            });
        } else {
            res.json({Code: 200, Info: 'sucessfull'});
        }
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


router.post('/create_priority', function (req, res, next) {
    Facility.findOne({facility_number: req.body.facility_number}, function (err, facility) {
        if (err) {
            return next(err);
        }
        var query = {
            priority_name: req.body.priority_name
        };
        Priority.update(query, {status: 1, $push: {"facilities": {facility_number: req.body.facility_number}}},
            {safe: true, upsert: false},
            function (err, model) {
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

        /*var priority = new Priority({
            facility_number: req.body.facility_number,
            priority_name: req.body.priority_name,
            status: 1
        });
        priority.save(function (err, resp) {
            if (err) {
                console.log(err);
                res.json({
                    Code: 499,
                    message: err,
                });
            } else {
                res.json({Code: 200, Info: 'sucessfull'});
            }
         });*/
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
    Facility.findOne({facility_number: req.body.facility_number}, function (err, facility) {
        if (err) {
            return next(err);
        }
        var query = {
            skill_name: req.body.skill_name,
        };
        Skill.update(query, {status: 1, $push: {"facilities": {facility_number: req.body.facility_number}}},
            {safe: true, upsert: false},
            function (err, model) {
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
        /*
        var skill = new Skill({
            facility_number: req.body.facility_number,
            skill_name: req.body.skill_name,
            status: 1
        });
        skill.save(function (err, resp) {
            if (err) {
                console.log(err);
                res.json({
                    Code: 499,
                    message: err,
                });
            } else {
                res.json({Code: 200, Info: 'sucessfull'});
            }
         });*/
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

router.post('/createparts', function (req, res, next) {
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
                material_number: req.body.part_number,
                material_description: req.body.part_name,
                vendor_number: req.body.vendor_number,
                vendor_name: req.body.vendor_name,
                min_qty: req.body.min_qty,
                max_qty: req.body.max_qty
            }
        }, function (err, count) {
            if (count) {
                res.json({Code: 200, Info: 'Document already exists'});
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
                                    message: err,
                                });
                            } else {
                                res.json({Code: 200, Info: 'sucessfull in if'});
                            }
                        });
                    } else {
                        res.json({Code: 200, Info: 'sucessfull'});
                    }
                });
            }
        });
    });
});

router.post('/create_part_request', function (req, res, next) {
    var partRequest = new PartsRequest(req.body);
    partRequest.save(function (er) {
        if (er) {
            res.json({
                Code: 499,
                message: 'issue with content',
            });
        }
        res.json({Code: 200, Info: 'sucessfull'});

    })
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
                        query.workorder_technician = req.body._id;
                    }
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
    if (req.body.wo_pm_frequency > 0 && requestedArray.workorder_PM != "") {
        var pmNumber;
        requestedArray.workorder_PM = pmNumber = 'PM-' + new Date().valueOf() + "-" + req.body.user_id;
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
            pm_next_date: new Date(req.body.wo_pm_date).valueOf(),
            pm_current_date: new Date().valueOf(),
            pm_previous_date: new Date(previous_date).valueOf(),
            status: 1
        };
        var where = {pm_number: pm_task.pm_number};
        requestedArray.workorder_number = parseInt(req.body.workorder_number);
        if (requestedArray.wo_datecomplete == 'NaN') {
            delete requestedArray['wo_datecomplete'];
        }
        PM.findOneAndUpdate(where, pm_task, {upsert: true}, function (err, pm) {
            if (err) {
                console.log(err);
            }
            updateWorkOrder({'workorder_number': parseInt(req.body.workorder_number)}, requestedArray, req, res);
        });
    } else {
        requestedArray.workorder_number = parseInt(req.body.workorder_number);
        if (requestedArray.wo_datecomplete == 'NaN') {
            delete requestedArray['wo_datecomplete'];
        }
        console.log('no pm');
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



var SendMail = function (req) {
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
                            if (role.role_name == 'clerk') {
                                var mail_to = '"Arun" <pgmanager7@gmail.com>, "Technician" <pgtechnician@gmail.com>';
                                var last_message = ' parts received';
                            } else {
                                if (role.role_name == 'technician') {
                                    var mail_to = '"Arun" <pgmanager7@gmail.com>';
                                    if (req.body.status == 1) {
                                        var last_message = ' has been updated';
                                    } else {
                                        if (req.body.status == 2) {
                                            var last_message = ' has been closed';
                                        } else {
                                            var last_message = ' has been on hold';
                                        }
                                    }

                                } else {
                                    var mail_to = '"Technician" <pgtechnician@gmail.com>';
                                    var last_message = ' has been updated';
                                }

                            }

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
                        });
                    })





                });
            });
        });
    });
}
var updateWorkOrder = function (query, requestedArray, req, res) {
    //delete requestedArray['user_id'];
    delete requestedArray['wo_pm_frequency'];
    delete requestedArray['wo_pm_date'];
    delete requestedArray['wo_pm_previous_date'];
    delete requestedArray['__v'];
    WorkOrder.findOneAndUpdate(query, requestedArray, {upsert: false}, function (err, doc) {
        if (err) return res.json(500, {error: err});
        SendMail(req);
        res.json({Code: 200, Info: "succesfully saved"});
    });
}

function getNextSequence(name) {
    counters.increment
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


}
module.exports = router;
