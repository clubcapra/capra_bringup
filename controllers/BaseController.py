#!/usr/bin/env python

import tornado.web


class BaseHandler(tornado.web.RequestHandler):
    def get(self):
        return