#!/usr/bin/env python

import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
import os.path

from controllers.HomeController import HomeHandler
from controllers.LaunchFilesController import LaunchFilesHandler, GetLaunchFilesByNameHandler

from tornado.options import define, options
define("port", default=8888, help="run on the given port", type=int)


class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r"/", HomeHandler),
            (r"/launchfiles", LaunchFilesHandler),
            (r"/launchfiles/(.+\.launch)", GetLaunchFilesByNameHandler)
        ]
        settings = dict(
            title=u"Capra BringUp",
            static_path=os.path.join(os.path.dirname(__file__), "assets"),
            template_path=os.path.join(os.path.dirname(__file__), "views"),
            xsrf_cookies=True,
            debug=True,
        )
        tornado.web.Application.__init__(self, handlers, **settings)


def main():
    tornado.options.parse_command_line()
    http_server = tornado.httpserver.HTTPServer(Application())
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()
