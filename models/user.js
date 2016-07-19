'use strict';

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const client = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);


const JWT_SECRET = process.env.JWT_SECRET;

let userSchema = new mongoose.Schema({
  email: String,
  displayName: String,
  profileImage: String,
  password: String,
  score: Number,
  admin: { type: Boolean, default: false },
  facebook: String, //facebook profile id
  phone: Number,
  isConfirmed: { type: Boolean, default: false },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Business' }]
});

const Business = require('./business');


userSchema.statics.addFavorite = function(userId, yelpInfo, cb) {
  this.findById(userId, (err, user) => {
    if (err) return cb(err);

    Business.findOne({ yelpId: yelpInfo.yelpId }, (err, business) => {
      if (err) return cb(err);
      if (business) {
        user.favorites.push(business._id);
        business.favoriteIncrease((err, business) => {
          if (err) return cb(err);
          cb(null, business);
        });

      } else {
        Business.create({ yelpId: yelpInfo.yelpId, name: yelpInfo.name, favoriteCount: 1 }, (err, savedBus) => {
          if (err) return cb(err);
          user.favorites.push(savedBus._id);
          cb(null, savedBus);
        });
      };
    });
  });
};



userSchema.statics.authorize = function(paramsObj = { admin: false }) {

  return function(req, res, next) {
    // look at the cookie, and get the token
    // verify the token

    // if token is bad or absent, respond with error (not authorized)
    // if token is good, call next

    let tokenHeader = req.headers.authorization;

    if (!tokenHeader) {
      return res.status(401).send({ error: 'Missing authorization header.' });
    }

    let token = tokenHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, payload) => {
      if (err) return res.status(401).send(err);


      User.findById(payload._id, (err, user) => {
        if (err || !user) return res.status(401).send(err || { error: 'User not found.' });

        //if admin required && user is not an admin
        if (paramsObj.admin && !user.admin) {
          return res.status(401).send({ error: 'Access Denied. Must be Admin' });
        }
        req.user = user;

        next();
      });
    });
  };
};


userSchema.statics.register = function(userObj, cb) {

  // Check that the username is not taken
  // Create a new user document

  this.findOne({ email: userObj.email }, (err, user) => {
    if (err || user) return cb(err || { error: 'A user with this email already exists.' });

    this.create(userObj, (err, savedUser) => {
      if (err) cb(err);

      let token = savedUser.generateToken();
      cb(null, token);
    });
  });
};

userSchema.pre('save', function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  bcrypt.hash(this.password, 12, (err, hash) => {
    this.password = hash;
    next();
  });
});

userSchema.pre('save', function(next) {
  if (!this.isModified('phone')) {
    return next();
  }

  this.phoneConfirmed = false;
  next();
})

userSchema.statics.authenticate = function(userObj, cb) {

  // try to find user document by username
  // check if username and password match
  // set login state

  this.findOne({ email: userObj.email })
    .exec((err, user) => {
      if (err) return cb(err);

      if (!user) {
        return cb({ error: 'Invalid email or password.' });
      }
      //           ( password attempt,   db hash )
      bcrypt.compare(userObj.password, user.password, (err, isGood) => {
        if (err || !isGood) return cb(err || { error: 'Invalid email or password.' });

        let token = user.generateToken();

        cb(null, token);
      });
    });
};

////////Methods

userSchema.methods.generateToken = function() {

  let payload = {
    _id: this._id,
    email: this.email,
    admin: this.admin
  };

  let token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1 day' });

  return token;

};


userSchema.methods.sendToken = function(token, cb) {
  client.messages.create({
    to: this.phone.toString(),
    from: process.env.TWILIO_PHONE_NUMBER,
    body: `Enter the following code on the confirmation page: ${token}`
  }, cb);

};

let User = mongoose.model('User', userSchema);
module.exports = User;
