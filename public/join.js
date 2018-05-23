// Make connection
const socket = io.connect("https://attendance-app-12.herokuapp.com/");
//const socket = io.connect('http://localhost:4000');

const join = document.getElementById('enter-name-btn');
const user = document.getElementById('user-name');
let usersList = document.getElementById('users-list');

/**
 * Indicate to the server that a new user request has been created
 */
join.addEventListener('click', () => {
  console.log('click');
  socket.emit('new-user', {
    name: user.value,
  });
});

/**
 * Get the id the user is requesting
 */
var url = document.location.href.split('/');
let route = url.pop();
let id = -1;
if(route.substring(0, 8) == "room?id=") {
  id = route.substring(8)
}

/**
 * Fills client page with a list of users received from the server
 */
socket.on('fill-page-with-users', (data) => {
  html = '';
  for (let user of data) {
    html += `<p>${user.name}</p>`;
  }
  usersList.innerHTML = html;
});

socket.on('already-signed-in', () => {
  console.log('hit it');
  alert('You can only sign in once');
});
