const express = require('express');
const app = express();
const socket = require('socket.io');
const db  = require('./db');

db.connect();

app.use(express.static(__dirname + '/public'));

app.get('/room', (req,res) => {
  //req.query.room
  res.sendFile(__dirname + '/public/room.html');
});

app.get('/:room', (req, res, next) => {  
  res.redirect('/room?id='+req.params.room);
});

const server = app.listen(4000, () => {
  console.log('listening for requests on port 4000.');
});

const io = require('socket.io')(server);

io.on('connection', (socket) => {
  //Get the id the user is requesting
  //console.log(socket.handshake)
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
    /**
     * Add the user to the database
     */
    db.addUser(room, data.name, (err, response) => {
      if(err) {
        console.log('insert failed');
        console.log(err);
      }
      else { 
        console.log(response);
        getUsers(room);
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