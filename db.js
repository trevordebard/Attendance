const pg = require('pg');

const client = new pg.Client('postgres://localhost/attendance_db');

const connect = () => {
  client.connect((err) => {
    if(!err) {
      console.log('Successfully connected to database');
    }
    else {
      console.log('Error connecting to database: ');
      console.log(err);
    }
  });
};

const createRoom = (room, cb) => {
  client.query(`INSERT INTO rooms (roomId) VALUES ('${room}');`, (err, res) => {
    if(err) {
      return cb(err);
    }
    cb(`Room ${room} has been created`);
  });
}

const getUsers = (room, cb) => {
  client.query(`SELECT name FROM users WHERE roomid='${room}'`, (err, result) => {
    if(err) {
      return cb(err);
    }
    if(result.rows.length == 0) {
      return cb('no record');
    }
    cb(null, result.rows);
  });
};

const addUser = (room, user, cb) => {
  client.query(`INSERT INTO users (name, roomid) VALUES ('${user}', '${room}');`, (err, result) => {
    if(err) {
      return cb(err);
    }
    cb(null, 'Insert complete');
  });
};


module.exports = {
    connect,
    createRoom,
    getUsers,
    addUser
};