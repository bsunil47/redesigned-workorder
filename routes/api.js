var express = require('express');
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

router.post('/', function(req, res, next) {
  Users.findOne({email: req.body.username,password: req.body.password},function(err, users) {
    if (err) { return next(err); }

    if (users != null) {
      Roles.findOne({_id: users.userrole},function(err,role) {
        if (err) { return next(err); }
          Facility.find({}, function (err, facilities) {
              if (err) {
                  return next(err);
              }
              res.json({Code: 200, Info: {user: users, role: role.role_name, facilities: facilities}});
          });

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
        var workOrder = new WorkOrder({
            workorder_number: req.body.workorder_number + "-" + count,
            workorder_creator: req.body.creator,
            workorder_description: req.body.workorder_description,
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
                res.json({Code: 200, Info: 'sucessfull'});
            }
        });
    })
});

router.post('/create_category', function (req, res, next) {
    Facility.findOne({facility_number: req.body.facility_number}, function (err, facility) {
        if (err) {
            return next(err);
        }
        var category = new Category({
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
        });
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
        var clas = new Class({
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
        });
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

router.post('/create_equipment', function (req, res, next) {
    Facility.findOne({facility_number: req.body.facility_number}, function (err, facility) {
        if (err) {
            return next(err);
        }
        var equipment = new Equipment({
            facility_number: req.body.facility_number,
            equipment_name: req.body.equipment_name,
            equipment_number: req.body.equipment_number,
            equipment_vendorname: req.body.equipment_vendorname,
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
});
router.post('/equipments', function (req, res, next) {
    Equipment.find({}, function (err, equipments) {
        if (err) {
            return next(err)
        }
        if (equipments != null) {
            res.json({Code: 200, Info: {equipments: equipments}});
        } else {
            res.json({Code: 406, Info: 'no class'});
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
    Facility.find({}, function (err, facilities) {
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
        var priority = new Priority({
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
    Facility.findOne({facility_number: req.body.facility_number}, function (err, facility) {
        if (err) {
            return next(err);
        }
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


module.exports = router;
