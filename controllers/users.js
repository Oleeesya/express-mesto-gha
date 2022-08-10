const mongoose = require('mongoose');
const User = require('../models/user');
const { NOT_FOUND, BAD_REQUEST, INTERNAL_ERROR } = require('../utils/consts');

// возвращает всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => {
      res.send({ data: user });
    })
    .catch(() => { res.status(INTERNAL_ERROR).send({ message: 'Произошла ошибка' }); });
};

// возвращает пользователей по _id
module.exports.getUserById = (req, res) => {
  if (!mongoose.isValidObjectId(req.params.userId)) {
    res.status(BAD_REQUEST).send({ message: 'Пользователь с некорректными данными _id' });
    return;
  }
  User.findById(req.params.userId)
    .then((user) => {
      if (user === null) {
        res.status(NOT_FOUND).send({ message: 'Переданы несуществующий _id' });
        return;
      }
      res.send({ data: user });
    })
    .catch(() => {
      res.status(INTERNAL_ERROR).send({ message: 'Произошла ошибка' });
    });
};

// создает пользователей
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    // вернем записанные в базу данные
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(INTERNAL_ERROR).send({ message: 'Произошла ошибка' });
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
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else {
        res.status(INTERNAL_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
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
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } else {
        res.status(INTERNAL_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};
