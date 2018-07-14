const dev = (process.env.NODE_ENV !== 'production');
let api_url;
if(dev) {
    //api_url = 'https://smi-dev-api.herokuapp.com/api'
    api_url = 'http://localhost:4000/api'
}
else {
    api_url = 'http://sign-me-in-api.herokuapp.com/api'
}
const socket_url = 'https://aqueous-hollows-89250.herokuapp.com/'
export {api_url, socket_url};
