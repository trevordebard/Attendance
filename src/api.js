const fetch = require('node-fetch');
const url = process.env.ORIGIN_URL + ':' + process.env.PORT + '/api';
console.log('api url is: ' + url);
function createRoom(roomId) {
  return fetch(`${url}/createRoom/${roomId}`)
    .then(res => res.json())
    .then(data => (data))
    .catch(error => ('There was a problem processing your request'));
}

function doesRoomExist(roomId) {
  return fetch(`${url}/doesRoomExist/${roomId}`)
    .then(res => res.json())
    .then(data => (data))
    .catch(error => ('There was a problem processing your request'));
}

function addUser(roomId, name) {
  return fetch(`${url}/addUser/${roomId}/${name}`)
    .then(res => res.json())
    .then(data => data)
    .catch(error => error);
}

function getUsers(roomId) {
  return fetch(`${url}/getUsers/${roomId}`)
    .then(res => res.json())
    .then(data => data)
    .catch(error => error);
}

module.exports = {
 createRoom, doesRoomExist, addUser, getUsers 
};
