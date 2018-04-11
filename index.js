const express = require('express');
const app = express();
const socket = require('socket.io');

app.use(express.static(__dirname + '/public'));
/*
app.use(function(req, res, next) {
  sess = req.session;
  sess.user = 'test';
  if(sess.user) {
    console.log('user id is: ' + sess.user);
  }
  else{
    sess.user = req.sessionID;
    console.log('Welcome, user: ' + sess.user);
  }
});*/

const server = app.listen(4000, () => {
  console.log('listening for requests on port 4000.');
});

const io = require('socket.io')(server);

let numUsers = 0;
let users = [];
let connections = [];

io.on('connection', (socket) => {
  connections.push(socket);

  console.log(`${connections.length} users connected`);
  
  socket.emit('get-users', users);

  socket.on('new-user', (data) => {
    if(!socket.signedIn) {
      console.log(data);
      socket.username = data.name;
      users.push(data.name);
      data.users = users;
      io.sockets.emit('new-user', data);
    }
    else {
      socket.emit('signed-in', socket.username);
    }
  });

  socket.on('disconnect', (data) => {
    connections.splice(connections.indexOf(socket), 1);
    //console.log(socket.username + " disconnected");
    console.log(`Disconnected...${connections.length} sockets remaining.`);
  });
});