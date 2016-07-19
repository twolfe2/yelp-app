'use strict';

const mongoose = require('mongoose');


let Crud = mongoose.model('Crud', {
  name:String
});



module.exports = Crud;