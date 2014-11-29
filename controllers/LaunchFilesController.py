#!/usr/bin/env python

import json
from os import walk, environ
from tornado.escape import json_encode
from cgi import escape
from xml.dom import minidom

from BaseController import BaseHandler


class LaunchFilesHandler(BaseHandler):
    def get(self):
        files = []
        path = environ["IBEX_HOME"]+"/launch"
        for(dirpath, dir, file) in walk(path):
            files += file;
        self.render("LaunchFiles/launchmanager.html", files=files)

    def post(self, *args, **kwargs):
        self.write(json_encode(self.request.arguments))

class GetLaunchFilesByNameHandler(BaseHandler):
    def get(self, name):
        path = environ["IBEX_HOME"]+"/launch/"+name
        response = {}
        try:
            with open(path, 'r') as content_file:
                rawContent = content_file.read()
                response["success"] = True
                response["content"] = escape(rawContent)
                response["xml"] = rawContent
        except:
            response["success"] = False

        self.write(json_encode(response))