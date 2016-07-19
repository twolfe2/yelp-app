'use strict';


const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  yelpId: { type: String, required: true },
  favoriteCount: { type: Number, default: 0 },
  name: { type: String }
});


businessSchema.statics.favoriteIncrease = function(yelpInfo, cb) {
  this.findOne({ yelpId: yelpInfo.yelpId }, (err, business) => {
    if (err) return cb(err);

    if (business) {
      business.favoriteCount++;
      business.save(cb);
    } else {
      this.create({ yelpId: yelpInfo.yelpId, name: yelpInfo.name, favoriteCount: 1 }, cb);
    }
  });
};

businessSchema.methods.favoriteIncrease = function(cb) {
  this.favoriteCount++;
  this.save((err, savedBus) => {
    if(err) return cb(err);
    cb(null, savedBus);
  });
};






const Business = mongoose.model('Business', businessSchema);
module.exports = Business;
