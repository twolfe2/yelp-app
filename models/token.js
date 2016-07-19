'use strict';


const mongoose = require('mongoose');
const moment = require('moment');

const tokenSchema = new mongoose.Schema({

  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  code: { type: String, required: true },
  exp: { type: Date, required: true }

});


///////// 
// Token.generate(user._id, (err, token) => {

// })


//////
tokenSchema.statics.generate = function(userId, cb) {
  let code = Math.floor(Math.random() * 1000000).toString(16).toUpperCase();
  console.log(code);

  //remove the users old code
  this.remove({ user: userId }, err => {
    if (err) return cb(err);
    console.log('hi')
    let token = new Token({
      user: userId,
      code: code,
      exp: moment().add(30, 'minutes').toDate()
    });
    console.log(token);
    token.save(cb);
  });


};

tokenSchema.statics.verify = function(userId, code, cb) {
  console.log(code)
  this.findOne({ user: userId }, (err, token) => {
    if (err) return cb(err);
    if (!token) return cb(null, false);
    if (token.code === code.toUpperCase() && !moment().isAfter(token.exp)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  });
};

// Token.verify(user._id, code, (err, result) => {

// })



const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
