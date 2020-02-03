import tornado.ioloop
import tornado.web
from datetime import datetime, timedelta
from random import randint


class APIHandler(tornado.web.RequestHandler):
    def initialize(self):
        self.time_format = '%d-%m-%Y_%H:%M:%S'

    def set_default_headers(self, *args, **kwargs):
        """Define headers to be used
        """
        super().set_default_headers()
        self.set_header("Access-Control-Allow-Origin", '*')
        self.set_header(
            "Access-Control-Allow-Headers",
            "Content-Type, crsf-header, file-length, file-token, x-csrftoken, "
        )
        self.set_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")

    def options(self):
        """Handle options method for browser to know if service is ok
        """
        self.set_status(204)
        self.finish()

    def post(self):
        self.write(
            {
                'created': datetime.now().strftime(self.time_format)
            }
        )

    def get(self):
        self.write(
            {
                'time': datetime.now().strftime(self.time_format),
                'cats': [
                    {'name': 'africano salvaje', 'img': 'img/africano_salvaje.jpg'},
                    {'name': 'americano pelocorto', 'img': 'img/americano_pelocorto.jpg'},
                    {'name': 'angora turco', 'img': 'img/angora_turco.jpg'},
                    {'name': 'azul ruso', 'img': 'img/azul_ruso.jpg'},
                    {'name': 'curl americano', 'img': 'img/curl_americano.jpg'},
                    {'name': 'abisinio', 'img': 'img/abisinio,jpeg'},
                ]
            }
        )

def make_app():
    return tornado.web.Application([
        (r"/", APIHandler),
    ])

if __name__ == "__main__":
    app = make_app()
    app.listen(8888)
    tornado.ioloop.IOLoop.current().start()
