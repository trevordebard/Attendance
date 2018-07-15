var consts = require('./consts');
const fetch = require('node-fetch');
const url = consts.api_url;
function createRoom(roomId, uuid, phone, email) {
  return fetch(`${url}/createRoom/${roomId}/${uuid}/true/${phone}/${email}`)
    .then(res => res.json())
    .then(data => (data))
    .catch(error => ('There was a problem processing your request'));
}

function didCreateRoom(roomId, uuid) {
  return fetch(`${url}/didCreateRoom/${roomId}/${uuid}`)
    .then(res => res.json())
    .then(data => {
      return data;
    })
    .catch(error => ('There was a problem processing your request'));
}
function doesRoomExist(roomId) {
  return fetch(`${url}/doesRoomExist/${roomId}`)
    .then(res => res.json())
    .then(data => (data))
    .catch(error => ('There was a problem processing your request'));
}

function addUser(roomId, name, phone, email) {
  console.log('add user')
  return fetch(`${url}/addUser?roomId=${roomId}&name=${name}&phone=${phone}&email=${email}`)
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
function getRequiredParams(roomId) {
  return fetch(`${url}/getRequiredParams/${roomId}`)
    .then(res => res.json())
    .then(data => data)
    .catch(error => error);
}

module.exports = {
  addUser: addUser,
  createRoom: createRoom,
  didCreateRoom: didCreateRoom,
  doesRoomExist: doesRoomExist,
  getUsers: getUsers,
  getRequiredParams: getRequiredParams,
}