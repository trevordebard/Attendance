// Make connection
const socket = io.connect('localhost:4000');
const firebaseRef = firebase.database().ref();
const directoryRef = firebase.database().ref('directory/');

const join = document.getElementById('enter-name-btn');
const user = document.getElementById('user-name');
let usersList = document.getElementById('users-list');

/*
firebaseRef.child('directory').on('value', (snapshot) => {
  //console.log(snapshot.val());
  let users = snapshot.val();
  console.log(users);
  console.log(users.user0);
  for (x in users) {
    usersList.innerHTML = `<p>${users[x]}</p>`;
  }
});*/

join.addEventListener('click', () => {
  socket.emit('new-user', {
    name: user.value,
  });
});
  
socket.on('new-user', (data) => {
  console.log(data.users.length);
  directoryRef.child(`user${data.users.length}`).set(data.name); //Make the param a variable
  getUsers(data.users);
});

socket.on('get-users', (data) => {
  getUsers(data);
});

socket.on('signed-in', (data) => {
  alert(`You are already signed in as ${data}`);
})

socket.on('multiple-user-attempt', () => {
  alert('You may only login with one name');
});

socket.on('duplicate-attempt', () => {
  alert('You have already logged in with this name');
});

function getUsers(users) {
  html = '';
  console.log(users);
  for (let i = 0; i < users.length; i++) {
    html += `<p>${users[i]}</p>`;
  }
  console.log(html);
  usersList.innerHTML = html;
}
