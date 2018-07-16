var api = require('../api');
const addUser = api.addUser;
const getUsers = api.getUsers;

const db = require('./db');
const io = require('./server.js').io;

module.exports = (socket) => {
    socket.on('join-room', (roomId) => {
        console.log(`Attempted to join room ${roomId}`);
        socket.join(roomId);
        getUsers(roomId)
            .then((data) => {
                if(data.success) {
                    io.sockets.to(`${roomId}`).emit('fill-page-with-users', data.result);
                }
                else {
                    console.log(`Error retrieving users for room ${roomId}`)
                }
            });
    });

    socket.on('new-user', (roomCode, name, phone, email, cb) => {
        addUser(roomCode, name, phone, email)
            .then((data) => {
                if(data.success === true) {
                    getUsers(roomCode)
                        .then((data) => {
                            if(data.success) {
                                io.sockets.to(`${roomCode}`).emit('fill-page-with-users', data.result);
                                cb(data);
                            }
                            else {
                                console.log(`Error retrieving users for room ${roomId}`)
                            }
                        });
                }
                else {
                    cb(data);
                }
            })
    });
}