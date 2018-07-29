const dev = (process.env.NODE_ENV !== 'production');
let api_url, socket_url;
if(dev) {
    //api_url = 'https://smi-dev-api.herokuapp.com/api'
    api_url = 'http://localhost:4000/api';
    socket_url = 'http://localhost:4005/';
}
else {
    api_url = 'https://sign-me-in-api.herokuapp.com/api';
    socket_url = 'https://aqueous-hollows-89250.herokuapp.com/';
}
module.exports =  {api_url: api_url, socket_url: socket_url};