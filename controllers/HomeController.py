#!/usr/bin/env python

from BaseController import BaseHandler


class HomeHandler(BaseHandler):
    def get(self):
        self.render("home.html")
