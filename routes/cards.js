const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards,
  createCard,
  removeCard,
  putLikeCard,
  deleteLikeCard,
} = require('../controllers/cards');

// возвращает все карточки
router.get('/', getCards);

// создаёт карточку
router.post('/', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(/[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*)?/i).required(),
    name: Joi.string().min(2).max(30).required(),
  }).unknown(true),
}), createCard);

// удаляет карточку по идентификатору
router.delete('/:cardsId', celebrate({
  params: Joi.object().keys({
    cardsId: Joi.string().alphanum().length(24),
  }).unknown(true),
}), removeCard);

// поставить лайк карточке
router.put('/:cardsId/likes', celebrate({
  params: Joi.object().keys({
    cardsId: Joi.string().alphanum().length(24),
  }).unknown(true),
}), putLikeCard);

// убрать лайк с карточки
router.delete('/:cardsId/likes', celebrate({
  params: Joi.object().keys({
    cardsId: Joi.string().alphanum().length(24),
  }).unknown(true),
}), deleteLikeCard);

module.exports = router;
