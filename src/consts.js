const dev = (process.NODE_ENV !== 'production');
let api_url;
if(dev) {
    api_url = 'https://smi-dev-api.herokuapp.com/api'
}
else {
    api_url = 'http://sign-me-in-api.herokuapp.com/api'
}
const socket_url = 'https://aqueous-hollows-89250.herokuapp.com/'
export {api_url, socket_url};