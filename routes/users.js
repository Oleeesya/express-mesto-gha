const router = require('express').Router();

const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

// возвращает всех пользователей
router.get('/', getUsers);

// возвращает пользователей по _id
router.get('/:userId', getUserById);

// обновляет профиль
router.patch('/me', updateProfile);

// обновляет аватар
router.patch('/me/avatar', updateAvatar);

module.exports = router;
