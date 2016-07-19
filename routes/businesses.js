'use strict';


const express = require('express');
const request = require('request');
const Yelp = require('yelp');


var yelp = new Yelp({
  consumer_key: process.env.YELP_CONSUMER_KEY,
  consumer_secret: process.env.YELP_CONSUMER_SECRET,
  token: process.env.YELP_TOKEN,
  token_secret: process.env.YELP_TOKEN_SECRET
});

let router = express.Router();

let Business = require('../models/business');
let User = require('../models/user');



router.get('/:yelpId', (req, res) => {
  Business.findOne({ yelpId: req.params.yelpId }, (err, business) => {
    if (err) return res.status(400).send(err);
    //if the business is in the database 
    if (business) {
      let businessInfo = {
        favoriteCount: business.favoriteCount,
        id: business._id
      };

      yelp.business(business.yelpId)
        .then(res => {
          console.log(res);
          businessInfo.yelpInfo = res;
          res.send(businessInfo);
        }).catch(err => {
          if (err) return res.status(400).send(err);
        });
    } else {

      yelp.business(business.yelpId)
        .then(res => {
          console.log(res);
          businessInfo.yelpInfo = res;
          res.send(businessInfo);
        }).catch(err => {
          if (err) return res.status(400).send(err);
        });
    }
  });
});

router.put('/favoriteIncrease', User.authorize({admin: false}), (req,res) => {
  Business.favoriteIncrease(req.body, (err) => {
    if (err) return res.status(400).send(err);
    res.send();
  });
});
