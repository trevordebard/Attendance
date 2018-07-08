const db = require('./db');
const io = require('./server.js').io;

module.exports = (socket) => {
    socket.on('join-room', (roomId) => {
        console.log(`Attempted to join room ${roomId}`);
        socket.join(roomId);
        getUsers(roomId);
    });

    socket.on('create-room', (data) => {
        console.log(`Room ${data.roomId} requested to be created`); 
        /*
        * Add the room to the database
        */
        db.createRoom(data.roomId, (err, res) =>{
        if(err) {
            console.log(err);
        }
        else {
            console.log(res);
        }
        socket.join(data.roomId);
        //socket.emit('redirect', data.roomId);
        });
    });

    socket.on('new-user', (roomCode, name, cb) => {
        /**
         * Add the user to the database
         */
        db.addUser(roomCode, name, (err, response) => {
            if(err) {
            console.log('insert failed');
            console.log(err);
            }
            else { 
            getUsers(roomCode);
            cb(true);
            }
            });
    });

    /**
     * Retrieve the users that have signed up for a particular room from the database
     * and use socket io to display those users on the page
     * @param room the room id whose users we are getting
     

    const getUsers = (roomId) => {
    console.log('get users called in server.js');
    api.getUsers(roomId)
        .then((data) => {
        if (data.success) {
            io.sockets.to(roomId).emit('fill-page-with-users', data.result);
        }
        });
    };
    */

    /**
     * Retrieve the users that have signed up for a particular room from the database
     * and use socket io to display those users on the page
     * @param room the room id whose users we are getting 
     */
    const getUsers = (room) => {
    db.getUsers(room, (err, users) => {
        if(err) {
        console.log('error retrieving users from the database');
        }
        else{
        console.log(users.result);
        io.sockets.to(`${room}`).emit('fill-page-with-users', users.result);
        }
    });
    }
}