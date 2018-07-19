var consts = require('./consts');
const fetch = require('node-fetch');
const url = consts.api_url;
function createRoom(roomId, uuid, reqs) {
  return fetch(`${url}/createRoom/${roomId}/${uuid}?params=${JSON.stringify(reqs)}`)
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

function addUser(roomId, reqArray) {
  console.log('add user')
  console.log(reqArray)
  
  return fetch(`${url}/addUser?roomId=${roomId}&reqs=${JSON.stringify(reqArray)}`)
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