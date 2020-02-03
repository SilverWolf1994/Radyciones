
const myPWA_version = 'catv0.0';
const local_url = 'http://localhost:8000/';
const api_url = 'http://localhost:8888/';


//verifica si se puede usar el serviceWorker
if(navigator.serviceWorker) {
    navigator.serviceWorker.register('/sw.js').then(serv => {
        serv.register('subir-foto');
    })
}

