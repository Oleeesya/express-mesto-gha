const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const process = require('process');
const { NOT_FOUND } = require('./controllers/consts');

const { PORT = 3000 } = process.env;
const app = express();

// мидлвэр добавляет в каждый запрос объект user, захардкодили идентификатор пользователя,
//  поэтому кто бы ни создал карточку, в базе у неё будет один и тот же автор:
app.use((req, res, next) => {
  req.user = {
    _id: '62f15a2b057365df89f70b95',
  };

  next();
});

app.use(bodyParser.json());

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res, next) => {
  // Ошибка!
  next(res.status(NOT_FOUND).send({ message: 'Передан неправильный путь' }));
});

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  // не поддерживаются:
  // useCreateIndex: true,
  // useFindAndModify: false,
});

app.listen(PORT, () => {
  console.log(`Port ${PORT}`);
});
