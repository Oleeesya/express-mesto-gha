const mongoose = require('mongoose');
const { linkRegex } = require('../utils/const');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    validate: {
      validator(v) {
        return v.length >= 2 && v.length <= 30;
      },
      message: 'Длина строки должна быть не менее 2 и не более 30 символов',
    },
    required: true,
  },
  link: {
    type: String,
    match: linkRegex,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    // type: Object,
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
