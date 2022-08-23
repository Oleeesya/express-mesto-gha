const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  NOT_FOUND,
} = require('../utils/errors/not_found');
const {
  CONFLICT,
} = require('../utils/errors/conflict');
const {
  UNAUTHORIZED,
} = require('../utils/errors/unauthorized');
const {
  BAD_REQUEST,
} = require('../utils/errors/bad_request');

// возвращает всех пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
};

// возвращает пользователей по _id
module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user === null) {
        throw new NOT_FOUND('Переданы несуществующий _id');
      }
      res.send({ data: user });
    })
    .catch(next);
};

// создает пользователей
module.exports.createUser = (req, res, next) => {
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
      if (err.code === 11000) {
        next(new CONFLICT('Пользователь с таким email уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new BAD_REQUEST('Некорректные данные при создании пользователя'));
      } else {
        next(err);
      }
    });
};

// обновляет профиль
module.exports.updateProfile = (req, res, next) => {
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
        next(new BAD_REQUEST('Некорректные данные при обновлении данных пользователя'));
      } else {
        next(err);
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
module.exports.updateAvatar = (req, res, next) => {
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
        next(new BAD_REQUEST('Некорректные данные при обновлении аватара пользователя'));
      } else {
        next(err);
      }
    });
};

// аутентификация — по адресу почты и паролю
// получаем из запроса почту и пароль и проверяем их
module.exports.login = (req, res, next) => {
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
      next(new UNAUTHORIZED(err.message));
    });
};
