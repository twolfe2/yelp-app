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


router.get('/search/:searchTerm/:location', (req,res) => {
  // console.log('searchTerm', req.params.searchTerm);
  yelp.search({term: req.params.searchTerm, location: req.params.location})
    .then(data => {
      // console.log(data);
      res.send(data);
    }).catch(err => {
      console.log('err', err);
      if (err) return res.status(400).send(err);
    })
});


router.get('/details/:yelpId', (req, res) => {
  console.log(req.params.yelpId)
  Business.findOne({ yelpId: req.params.yelpId }, (err, business) => {
    if (err) return res.status(400).send(err);
    //if the business is in the database 
    let businessInfo = {};
    if (business) {
      businessInfo = {
        favoriteCount: business.favoriteCount,
        id: business._id,
        users: business.users
      };

      yelp.business(business.yelpId)
        .then(data => {
          // console.log(res);
          businessInfo.yelpInfo = data;
          res.send(businessInfo);
        }).catch(err => {
          if (err) return res.status(400).send(err);
        });
    } else {

      yelp.business(req.params.yelpId)
        .then(data => {
          // console.log(data);
          
          businessInfo.yelpInfo = data;
          // console.log('businessInfo:',businessInfo);
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

module.exports = router;