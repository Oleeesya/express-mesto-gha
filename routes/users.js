const router = require('express').Router();
// const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

// возвращает всех пользователей
router.get('/', getUsers);

// router.get('/', celebrate({
//   body: Joi.object().keys({
//     title: Joi.string().required().min(2).max(30),
//     text: Joi.string().required().min(2),
//   }),
// }), getUsers);

// возвращает пользователей по _id
router.get('/:userId', getUserById);

// обновляет профиль
router.patch('/me', updateProfile);

// обновляет аватар
router.patch('/me/avatar', updateAvatar);

module.exports = router;
