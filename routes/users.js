const router = require('express').Router();

const {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

// возвращает всех пользователей
router.get('/', getUsers);

// возвращает пользователей по _id
router.get('/:userId', getUserById);

//удалить
// // создает пользователей
// router.post('/', createUser);

// обновляет профиль
router.patch('/me', updateProfile);

// // возвращает информацию о текущем пользователе
// router.patch('/me', infoProfile);

// обновляет аватар
router.patch('/me/avatar', updateAvatar);

module.exports = router;
