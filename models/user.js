const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
  about: {
    type: String,
    validate: {
      validator(v) {
        return v.length >= 2 && v.length <= 30;
      },
      message: 'Длина строки должна быть не менее 2 и не более 30 символов',
    },
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
