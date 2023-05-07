const mongoose = require('mongoose');

const details = new mongoose.Schema({
  name: String,
  last: Number,
  buy: Number,
  sell: Number,
  volume: Number,
  base_unit: String,
});

const Details = mongoose.model('Details', details);

module.exports = Details;
