#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os, glob, json

__version__ = None
__service__ = None
__appname__ = None
__description__ = None

ICONSIZE = 16


def __response(RequestHandler, status, html=None):
	if status != 200:
		RequestHandler.send_error(500)
	else:
		RequestHandler.log_request(status)
		RequestHandler.wfile.write(html)


def status(RequestHandler):
	data = RequestHandler.data()
	if data != {}:
		__response(500)
		return

	result = {
		'started': RequestHandler.server.timestamp,
		'listening': str(RequestHandler.server.server_address[0]) + ':' + str(RequestHandler.server.server_address[1]),
		'version': str(__version__),
		'service': __service__,
		'name': __appname__,
		'description': __description__
	}

	__response(RequestHandler, 200, json.dumps(result))
