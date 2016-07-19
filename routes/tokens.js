'use strict';


const express = require('express');
const request = require('request');
const client = require('twilio') (
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

let router = express.Router();

let User = require('../models/user');
let Token = require('../models/token');




router.post('/send',User.authorize({admin: false}), (req,res) => {
  console.log(req.user);
  Token.generate(req.user._id, (err, token) => {
    if(err) return res.status(400).send(err);
    // client.messages.create({
    //   to: req.user.phone.toString(),
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   body: `Enter the following code on the confirmation page: ${token}`
    // });
    // req.user.sendToken(token ,err => {

    // });
    console.log(token);
    req.user.sendToken(token.code, (err, result) => {
      if(err) return res.status(400).send(err);

      res.send();
    });
  });
});



router.post('/verify', User.authorize({admin: false}),(req,res) => {
  console.log(req.body);
  Token.verify(req.user._id, req.body.code, (err, result) => {
    if(err) return res.status(400).send(err);
    console.log(result);
    if(result === true) {
      User.findByIdAndUpdate(req.user._id, {isConfirmed: true}, (err, savedUser) => {
        if(err) return res.status(400).send(err);
        console.log(savedUser);
        res.send(savedUser);
      });
    } else{
      res.send({error: 'Invalid Code'});
    }
  });
});


module.exports = router;