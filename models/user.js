const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { linkRegex } = require('../utils/const');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    validate: {
      validator(v) {
        return v.length >= 2 && v.length <= 30;
      },
      message: 'Длина строки должна быть не менее 2 и не более 30 символов',
    },
    default: 'Жак-Ив Кусто',
    required: false,
  },
  about: {
    type: String,
    validate: {
      validator(v) {
        return v.length >= 2 && v.length <= 30;
      },
      message: 'Длина строки должна быть не менее 2 и не более 30 символов',
    },
    default: 'Исследователь',
    required: false,
  },
  avatar: {
    type: String,
    match: linkRegex,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false, // хеш пароля пользователя не будет возвращаться из базы
  },
});

// добавим метод findUserByCredentials схеме пользователя
// у него будет два параметра — почта и пароль
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          return user; // теперь user доступен
        });
    });
};

module.exports = mongoose.model('user', userSchema);
