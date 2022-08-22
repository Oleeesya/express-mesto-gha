const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const process = require('process');
const { login, createUser, getCurrebtUserInfo } = require('./controllers/users');
const auth = require('./middlewares/auth');
// const { errors } = require('celebrate');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());

app.use('/users', auth, require('./routes/users'));

// сначала вызовется auth, а затем,
app.use('/cards', auth, require('./routes/cards'));

app.post('/signin', login);
app.post('/signup', createUser);
app.get('/me', auth, getCurrebtUserInfo);

app.use((req, res) => {
  // Ошибка!
  res.status(404).send({ message: 'Передан неправильный путь' });
});

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  // не поддерживаются:
  // useCreateIndex: true,
  // useFindAndModify: false,
});

// app.use(errors()); // обработчик ошибок celebrate

app.use((err, req, res) => {
  res.status(err.statusCode).send({ message: err.message });
});

app.listen(PORT, () => {
  console.log(`Port ${PORT}`);
});
