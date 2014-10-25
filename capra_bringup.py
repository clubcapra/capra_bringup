#!/usr/bin/env python

import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
import os.path

from tornado.options import define, options
define("port", default=8888, help="run on the given port", type=int)


class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r"/", HomeHandler)
        ]
        settings = dict(
            title=u"Capra BringUp",
            view_path=os.path.join(os.path.dirname(__file__), "views"),
            js_path=os.path.join(os.path.dirname(__file__), "assets/js"),
            css_path=os.path.join(os.path.dirname(__file__), "assets/css"),
            img_path=os.path.join(os.path.dirname(__file__), "assets/img"),
            xsrf_cookies=True,
            debug=True,
        )
        tornado.web.Application.__init__(self, handlers, **settings)


class BaseHandler(tornado.web.RequestHandler):
    def get(self):
        return


class HomeHandler(BaseHandler):
    def get(self):
        self.render("views/home.html")


def main():
    tornado.options.parse_command_line()
    http_server = tornado.httpserver.HTTPServer(Application())
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()
