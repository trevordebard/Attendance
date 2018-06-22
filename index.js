const express = require('express');
const dotenv = require('dotenv');
const app = express();
const socket = require('socket.io');
dotenv.config();
var session = require("express-session")({
  secret: "my-secret",
  resave: true,
  saveUninitialized: true
});
const sharedsession = require("express-socket.io-session");
const db  = require('./db');
//const location = require('../location')

db.connect(); //connect to the database

app.use(session);

const port = process.env.PORT || 4000;

const server = app.listen(port, () => {
  console.log(`listening for requests on port ${port}`);
});
app.use(express.static(__dirname + '/public/'));

app.get('/join/:room', (req, res) => { 
  req.session.uid = req.sessionID;
  console.log('eventually ');
  console.log(req.session.hasCreated);

  db.doesRoomExist(req.params.room, (err, response)=> {
    if(err || !response) {
      res.send('error');
    }
    else {
      if(req.session.hasCreated) {
        if((req.session.roomsCreated).includes(`${req.params.room}`)) {
          console.log('you created this room');
        }
        else {
          console.log('you did not create this room, but you did create others')
        }
      }
      else {
        console.log('you have not created any rooms yet. Just a user');
      }
      console.log(req.session.roomsCreated);
      res.sendFile( __dirname + "/public/" + "room.html" );
    }
  });
});

const io = require('socket.io')(server);
io.use(sharedsession(session));
io.on('connection', (socket) => {
  //Get the id the user is requesting
  console.log('connected');

  socket.emit('get-location');

  console.log('OG Session: ' + socket.handshake.session.uid);
  if(socket.handshake.session.uid == null) {
    socket.handshake.session.uid = socket.id;
    socket.handshake.session.save();
  }
  const session = socket.handshake.session.uid;

  console.log('Post connect session: ' + session);
 

  socket.on('new-user', (data) => {
    db.doesSessionExist(data.room, session, (err, response) => {
      if(err) {
        console.log('Error determining whether session exists');
        console.log(err);
      }
      else {
        if(response) {
          socket.emit('already-signed-in');
        }
        else {
          /**
           * Add the user to the database
           */
          db.addUser(data.room, data.name, socket.handshake.session.uid, (err, response) => {
            if(err) {
              console.log('insert failed');
              console.log(err);
            }
            else { 
              getUsers(data.room);
              socket.emit('successfull-sign-in')
            }
          });
        }
      }
    });
  });

  socket.on('disconnect', (data) => {
    console.log(`Disconnected...`);
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
      socket.handshake.session.hasCreated = true;
      if(!socket.handshake.session.roomsCreated) {
        socket.handshake.session.roomsCreated = [`${data.roomId}`];
      }
      else {
        (socket.handshake.session.roomsCreated).push(`${data.roomId}`);
      }
      socket.join(data.roomId);
      socket.handshake.session.save();
      //socket.emit('redirect', data.roomId);
    });
  });

  socket.on('does-room-exist', (roomId) => {
    console.log(roomId);
    db.doesRoomExist(roomId, (err, response)=> {
      if(err || !response) {
        console.log(err); 
        console.log('Whoops It appears that room does not exist.');
        socket.emit('room-does-not-exist');
      }
      else {
        socket.emit('room-exists');
      }
    });
  });
  socket.on('join-room', (roomId) => {
    console.log('attempted to join');
    socket.join(roomId);
  });
});

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
      io.sockets.to(`${room}`).emit('fill-page-with-users', users);
    }
  });
}