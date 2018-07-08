const path = require('path');
const express = require('express');
  const app = express();
const dotenv = require('dotenv');
  dotenv.config();
const db = require('./db');
db.connect();
const PORT = process.env.PORT || 4006;
const routes = require('./routes')(app);
const dev = app.get('env') !== 'production';

const server = app.listen(PORT, () => {
  console.log(`listening for requests on port ${PORT}`);
});

if (!dev) {
  // Security to prevent people from seeing this is powered by express
  console.log('Production environment')
  app.disable('x-powered-by');

  app.use(express.static(path.resolve(__dirname, '../../build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../build', 'index.html'));
  });
}

const io = module.exports.io = require('socket.io')(server);
const sockets = require('./sockets');

io.on('connection', sockets);