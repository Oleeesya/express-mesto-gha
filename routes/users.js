const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const { linkRegex } = require('../utils/const');

const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getCurrebtUserInfo,
} = require('../controllers/users');

// возвращает всех пользователей
router.get('/', getUsers);

router.get('/me', auth, getCurrebtUserInfo);

// возвращает пользователей по _id
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUserById);

// обновляет профиль
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);

// обновляет аватар
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(linkRegex),
  }),
}), updateAvatar);

module.exports = router;
