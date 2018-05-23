const express = require('express');
const app = express();
const socket = require('socket.io');
var session = require("express-session")({
  secret: "my-secret",
  resave: true,
  saveUninitialized: true
});
const sharedsession = require("express-socket.io-session");
const db  = require('./db');

db.connect(); //connect to the database

app.use(session);
app.use(express.static(__dirname + '/public'));

app.get('/room', (req,res) => {
  req.session.uid = req.sessionID;
  console.log('eventually ');
  console.log(req.session);
  if(!req.query.id) {
    return res.send('Please enter the room you would like to join');
  }
  db.doesRoomExist(req.query.id, (err, response)=> {
    if(err || !response) {
      console.log(err); 
      res.send('Whoops! It appears that room does not exist.')
    }
    else {
      res.sendFile(__dirname + '/public/room.html');
    }
  });
});

app.get('/:room', (req, res, next) => { 
  res.redirect('/room?id='+req.params.room);
});
 
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log('listening for requests on port ' + port);
});

const io = require('socket.io')(server);
io.use(sharedsession(session));
io.on('connection', (socket) => {
  //Get the id the user is requesting
  console.log('connected');
  //console.log(socket.handshake.session);
  const session = socket.handshake.session.uid;

  let url = socket.handshake.headers.referer.split('/');
  let route = url.pop();
  let id = -1;
  if(route.substring(0, 8) == "room?id=") {
    id = route.substring(8)
  }
  else {
    console.log("Could not retrieve id");
  }
  let room = -1;
  if(id != -1) {
    room = id;
    socket.join(room);
    getUsers(room);
  }

  socket.on('new-user', (data) => {
    db.doesSessionExist(room, session, (err, response) => {
      if(err) {
        console.log('Error determining whether session exists');
      }
      else {
        if(response) {
          socket.emit('already-signed-in');
        }
        else {
          /**
           * Add the user to the database
           */
          db.addUser(room, data.name, socket.handshake.session.uid, (err, response) => {
            if(err) {
              console.log('insert failed');
              console.log(err);
            }
            else { 
              getUsers(room);
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
    });
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