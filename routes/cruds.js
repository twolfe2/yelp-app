'use strict';


const express = require('express');



// api/cruds
let router = express.Router();

let Crud = require('../models/crud');








router.route('/')
  .get((req,res) => {
  Crud.find({}, (err, crud)=> {
    if(err) return res.status(400).send(err);
    res.send(crud);

  });
})
  .post((req,res) => {


    Crud.create(req.body, (err, savedDoc) => {
      if(err) return res.status(400).send(err);

      res.send(savedDoc);
    });
   
});
  
  router.route('/:id')
    .delete((req,res) => {
      Crud.findByIdAndRemove(req.params.id, (err) => {
        if(err) return res.status(400).send(err);

        res.send();
      });
    })
    .get((req,res) => {
      Crud.findById(req.params.id, (err, crud) => {
        if(err) return res.status(400).send(err);

        res.send(crud);
      });
    })
    .put((req, res) => {
      Crud.findByIdAndUpdate(req.params.id, req.body,{new: true}, (err, crud) => {
        if(err) return res.status(400).send(err);

        res.send(crud);
      });
    });
module.exports = router;
