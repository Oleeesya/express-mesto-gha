const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { linkRegex } = require('../utils/const');

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
    link: Joi.string().regex(linkRegex).required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), createCard);

// удаляет карточку по идентификатору
router.delete('/:cardsId', celebrate({
  params: Joi.object().keys({
    cardsId: Joi.string().alphanum().length(24),
  }),
}), removeCard);

// поставить лайк карточке
router.put('/:cardsId/likes', celebrate({
  params: Joi.object().keys({
    cardsId: Joi.string().alphanum().length(24),
  }),
}), putLikeCard);

// убрать лайк с карточки
router.delete('/:cardsId/likes', celebrate({
  params: Joi.object().keys({
    cardsId: Joi.string().alphanum().length(24),
  }),
}), deleteLikeCard);

module.exports = router;
