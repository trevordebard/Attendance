
const api = require('../api');
const io = require('./index.js').io;


const getUsers = (roomId) => {
  console.log('get users called');
  api.getUsers(roomId)
    .then((data) => {
      console.log(data);
      if (data.success) {
        io.sockets.to(roomId).emit('fill-page-with-users', data.result);
      }
    });
};

module.exports = (socket) => {
  socket.on('join-room', (roomId) => {
    console.log(`Attempted to join room ${roomId}`);
    socket.join(roomId);
    getUsers(roomId);
  });

  socket.on('create-room', (roomId) => {
    console.log(`Room ${roomId} requested to be created`);
    /*
     * Add the room to the database
     */
    api.createRoom(roomId);
    socket.join(roomId);
  });

  socket.on('new-user', (roomId, name, cb) => {
    /**
     * Add the user to the database
     */
    api.addUser(roomId, name)
      .then((data) => {
        if (data.success) {
          getUsers(roomId);
          cb(true);
        } else {
          console.log(data);
          cb(false);
        }
      });
  });
};
