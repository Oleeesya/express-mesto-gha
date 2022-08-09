const router = require('express').Router();
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
router.post('/', createCard);

// удаляет карточку по идентификатору
router.delete('/:cardsId', removeCard);

// поставить лайк карточке
router.put('/:cardsId/likes', putLikeCard);

// убрать лайк с карточки
router.delete('/:cardsId/likes', deleteLikeCard);

module.exports = router;
