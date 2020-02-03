console.log('service worker working!!');

const myPWA_version = 'catv0.0';
const local_url = 'http://localhost:8000/';
const api_url = 'http://localhost:8888/';

const app_resources = {
    img: [
        'img/abisinio.jpeg',
        'img/africano_salvaje.jpg',
        'img/americano_pelocorto.jpg',
        'img/angora_turco.jpg',
        'img/azul_ruso.jpg',
        'img/curl_americano.jpg'],
    css: [
        'css/pure-min.css',
        'css/grids-responsive-min.css',
        'css/custom.css'],
    js: [
        'some.js',
        'sw.js']
};


self.addEventListener('install', event => {
    console.log('1. instalando sw!!');
    //1. crear cache
    caches.has(myPWA_version)
    .then(cache_exists => {
        if (! cache_exists ){
            console.log('creando nuevo cache');
            caches.open(myPWA_version)
            .then( cache => {
                console.log('mi cache se ha creado');
                console.log(cache);
                //descargar assets
                cache.add('/index.html');
                for (const key in app_resources) {
                    if (app_resources.hasOwnProperty(key)) {
                        const element = app_resources[key];
                        console.log('adding ' + key + ' resources');
                        cache.addAll(element);
                    }
                }
            })
        }
    })

})

self.addEventListener('activate', event => {
    //borrar cache viejo
    console.log('2. activando sw.');

})

if (window.SyncManager) {
    console.log('su navegador puede detectar conexion!!');

}

self.addEventListener('sync', event => {
    //evento cuando recuperamos conexion a internet
    console.log('tenemos conexion');
    console.log(event.tag);


})

self.addEventListener('fetch', event => {
    // intercepto las peticiones de imagenes y trato de responderlas desde el cache
    if (event.request.url.includes('.jpeg') || event.request.url.includes('.jpg')) {
        console.log(event.request.url + ' from cache');
        // let response = fetch(event.request);
        let response = new Promise((resolve, reject) => {
            caches.open(myPWA_version).then(cache => {
                cache.match(event.request.url)
                .then(rp => rp.blob()) // transformo la respuesta de la busqueda en cache en un objeto imagen
                .then(rp => {
                    let resource = new Response(rp); // hago un objeto respuesta para el navegador
                    resolve(resource);
                })

            })
        })
        event.respondWith(response)
    } else if (event.request.url.includes('.css')) {
        // intercepto las peticiones de css y trato de responderlas desde el cache
        let response = new Promise((resolve, reject) => {
            caches.open(myPWA_version).then(cache => {
                cache.match(event.request.url)
                .then(rp => rp.text()) // transformo la respuesta de la busqueda en cache en texto
                .then(rp => {
                    let resource = new Response(
                        rp, {headers: {"Content-Type": 'text/css'}} // mando como respuesta el texto y las cabeceras que explican que es css
                        );
                    resolve(resource);
                })

            })
        })
        event.respondWith(response)
    } else if (event.request.url.includes('.js')) {
        // intercepto las peticiones de javascript y trato de responderlas desde el cache
        let response = new Promise((resolve, reject) => {
            caches.open(myPWA_version).then(cache => {
                cache.match(event.request.url)
                .then(rp => rp.text()) // transformo la respuesta de la busqueda en cache en texto
                .then(rp => {
                    let resource = new Response(
                        rp, {headers: {"Content-Type": 'text/javascript'}} // mando como respuesta el texto y las cabeceras que explican que es js
                        );
                    resolve(resource);
                })

            })
        })
        event.respondWith(response)
    } else {
        // si no es un recurso, debe ser el html, trato de obtenerlo de la web, y si no funciona, del cache
        console.log('doing index');
        console.log(event.request.url);
        let response = new Promise((resolve, reject) => {
            fetch(event.request) // trato de obtener de internet el html
            .then(resp => resp.text()) // transformo la respuesta del fetch en texto
            .then(resp => {
                console.log('doing fetch');
                let response = new Response(
                    resp, {headers: {"Content-Type": 'text/html'}}
                );
                resolve(response);
            })
            .catch( error => {
                console.log('error on fetch');
                // abro el cache y miro si existe index.html
                caches.open(myPWA_version).then(cache => {
                    cache.match('index.html')
                    .then(rp => rp.text()) // transformo la respuesta de la busqueda en cache en texto
                    .then(rp => {
                        let resource = new Response(
                            rp, {headers: {"Content-Type": 'text/html'}}
                            );
                        resolve(resource);
                    })

                })
            })

            })
        event.respondWith(response)
    }
})

// (event.request.url === event.request.referrer)
