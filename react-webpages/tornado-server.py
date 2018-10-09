import tornado.web
import os


class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('html/index.html')


def run_webserver():
    src_root = os.path.join(os.path.dirname(__file__), 'src')
    css_root = os.path.join(os.path.dirname(__file__), 'css')
    build_root = os.path.join(os.path.dirname(__file__), 'build')
    app = tornado.web.Application([
        (r'/', MainHandler),
        (r'/src/(.*)', tornado.web.StaticFileHandler, {'path': src_root}),
        (r'/css/(.*)', tornado.web.StaticFileHandler, {'path': css_root}),
        (r'/build/(.*)', tornado.web.StaticFileHandler, {'path': build_root}),
    ], debug=True)
    http_server = tornado.httpserver.HTTPServer(app)
    http_server.listen(8881)
    tornado.ioloop.IOLoop.current().start()


if __name__ == "__main__":
    run_webserver()
