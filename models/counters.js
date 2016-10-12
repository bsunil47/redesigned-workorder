/**
 * Created by admin on 7/29/2016.
 */

var mongoose = require('mongoose');

var counterSchema = new mongoose.Schema({
    _id: {type: String, unique: true},
    seq: {type: Number, default: 1}

});
counterSchema.statics.increment = function (counter, callback) {
    return this.findByIdAndUpdate(counter, {$inc: {seq: 1}}, {new: true, upsert: true, select: {seq: 1}}, callback);
};

mongoose.model('counter', counterSchema);



