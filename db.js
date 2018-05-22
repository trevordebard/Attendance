const pg = require('pg');

const client = new pg.Client('postgres://aosriwjguxrbzk:027542f3d7a4d279f4b0021455f512e4dca32b5eb1248cd876a70c9ebca0d437@ec2-54-225-107-174.compute-1.amazonaws.com:5432/d9voq6n6jvr5lh?ssl=true');

/**
 * Establishes connection with the client database
 */
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

/**
 * Insert a room into the database
 * @param {string} room the room to be created
 * @param {function} cb the callbackfunction
 */
const createRoom = (room, cb) => {
  client.query(`INSERT INTO rooms (roomId) VALUES ('${room}');`, (err, res) => {
    if(err) {
      return cb(err);
    }
    cb(`Room ${room} has been created`);
  });
}

/**
 * Retrieve a list of users for a given room
 * @param {string} room 
 * @param {function} cb 
 */
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

/**
 * Add a user to a given room
 * @param {string} room 
 * @param {string} user 
 * @param {function} cb 
 */
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