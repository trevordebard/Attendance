// Make connection
const socket = io.connect("http://localhost:4000/");
const join = document.getElementById('enter-name-btn');
const user = document.getElementById('user-name');
let usersList = document.getElementById('users-list');


join.addEventListener('click', () => {
  console.log('click');
  socket.emit('new-user', {
    name: user.value,
  });
});

//Get the id the user is requesting
var url = document.location.href.split('/');
let route = url.pop();
let id = -1;
if(route.substring(0, 8) == "room?id=") {
  id = route.substring(8)
}


socket.on('new-user', (data) => {
  console.log('im here');
  let numUsers = 0;
  //getUsers(data.users);
});

socket.on('fill-page-with-users', (data) => {
  console.log("yeeyee");
  console.log(data);
  html = '';
  for (let user of data) {
    html += `<p>${user.name}</p>`;
  }
  usersList.innerHTML = html;
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

