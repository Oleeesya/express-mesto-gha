const router = require('express').Router();
const User = require('../models/user');

router.get('/', (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
});

router.get('/:userID', (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
});

router.post('/', (req, res) => {
  console.log(req.user._id);
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    // вернем записанные в базу данные
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
});

module.exports = router;
