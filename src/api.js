const fetch = require('node-fetch');
console.log('api url is: ' + process.env.REACT_APP_API_URL);
function createRoom(roomId) {
  return fetch(`${process.env.REACT_APP_API_URL}/createRoom/${roomId}`)
    .then(res => res.json())
    .then(data => (data))
    .catch(error => ('There was a problem processing your request'));
}

function doesRoomExist(roomId) {
  return fetch(`${process.env.REACT_APP_API_URL}/doesRoomExist/${roomId}`)
    .then(res => res.json())
    .then(data => (data))
    .catch(error => ('There was a problem processing your request'));
}

function addUser(roomId, name) {
  return fetch(`${process.env.REACT_APP_API_URL}/addUser/${roomId}/${name}`)
    .then(res => res.json())
    .then(data => data)
    .catch(error => error);
}

function getUsers(roomId) {
  return fetch(`${process.env.REACT_APP_API_URL}/getUsers/${roomId}`)
    .then(res => res.json())
    .then(data => data)
    .catch(error => error);
}

module.exports = {
 createRoom, doesRoomExist, addUser, getUsers 
};
