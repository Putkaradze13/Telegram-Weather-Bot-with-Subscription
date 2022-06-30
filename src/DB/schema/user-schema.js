const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  chatId: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
  },
  timezone: {
    type: Number,
  },
  time: {
    type: String,
  },
});

module.exports = mongoose.model('User', UserSchema);
