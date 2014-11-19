#!/usr/bin/env python

from BaseController import BaseHandler


class LaunchFilesHandler(BaseHandler):
    def get(self):
        self.render("launchmanager.html")