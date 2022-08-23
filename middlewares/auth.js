// мидлвэр для авторизации
const jwt = require('jsonwebtoken');
const {
  UNAUTHORIZED,
} = require('../utils/errors/unauthorized');

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;

  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UNAUTHORIZED('Необходима авторизация'));
  }

  // извлечём токен
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    // После извлечения токена из запроса нужно убедиться (верифицировать токен),
    // что пользователь прислал именно тот токен,
    // который был выдан ему ранее. Такую проверку осуществляет метод
    // verify модуля jsonwebtoken
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    // отправим ошибку, если не получилось
    return next(new UNAUTHORIZED('Необходима авторизация'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
