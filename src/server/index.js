const app = require('http').createServer();
const dotenv = require('dotenv');
const io = module.exports.io = require('socket.io')(app);

dotenv.config();

const PORT = process.env.PORT || 9045;

const SocketManager = require('./SocketManager');

io.on('connection', SocketManager);

app.listen(PORT, () => {
  console.log(`Connected to port ${PORT}`);
});
