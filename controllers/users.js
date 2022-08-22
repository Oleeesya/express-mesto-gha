const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');

const {
  BAD_REQUEST,
} = require('../utils/errors/bad_request');
const {
  NOT_FOUND,
} = require('../utils/errors/not_found');

// возвращает всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => {
      res.send({ data: user });
    })
    .catch(() => { res.status(500).send({ message: 'Произошла ошибка' }); });
};

// возвращает пользователей по _id
module.exports.getUserById = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.userId)) {
    throw new BAD_REQUEST('Пользователь с некорректными данными _id');
  }
  User.findById(req.params.userId)
    .then((user) => {
      if (user === null) {
        throw new NOT_FOUND('Переданы несуществующий123123123 _id');
      }
      res.send({ data: user });
    })
    .catch(next);
};

// создает пользователей
module.exports.createUser = (req, res) => {
  // хешируем пароль
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash, // записываем хеш в базу
    }))

    .then((user) => {
      res.status(201).send({
        _id: user._id,
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else if (err.code === 11000) {
        res.status(409).send({ message: 'Пользователь с таким email уже существует' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

// обновляет профиль
module.exports.updateProfile = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { ...req.body },
    // Передадим объект опций:
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

// возвращает информацию о текущем пользователе
module.exports.getCurrebtUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user === null) {
        throw new NOT_FOUND('Переданы несуществующий _id');
      }
      res.send({ data: user });
    })
    .catch(next);
};

// обновляет аватар
module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { ...req.body },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

// аутентификация — по адресу почты и паролю
// получаем из запроса почту и пароль и проверяем их
module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      // создадим токен
      // Пейлоуд токена — зашифрованный в строку объект пользователя.
      // Методу sign мы передали два аргумента: пейлоуд токена и секретный ключ подписи:
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });

      // вернём токен
      res.send({ token });
    })
    .catch((err) => {
      // ошибка аутентификации
      res
        .status(401)
        .send({ message: err.message });
    });
};
