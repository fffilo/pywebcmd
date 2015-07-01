#!/usr/bin/env python
# -*- coding: utf-8 -*-

'''
Configuration and class extensions.
Add your own methods here...
'''

### import modules
import os, threading, httplib, cgi, json, time
import Http, Api

### http config
#Http.NAME = SimpleHTTPServer.SimpleHTTPRequestHandler.server_version + ' ' + SimpleHTTPServer.SimpleHTTPRequestHandler.sys_version
Http.DOCROOT = os.path.realpath(os.path.dirname(__file__) + '/../html')
Http.INDEX = ['index.html', 'index.htm']
Http.ERRTEMP = '''\
<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
<meta name="robots" content="noindex, nofollow" />
<title>%(code)d %(message)s</title>
<style>
body { margin: 0; padding: 32px; }
h1 { margin: 0; padding: 0; }
p { margin: 16px 0; font-size: 16px; line-height: 24px; }
hr { height: 1px; margin: 16px 0; border: 0 none; background: gray; }
small { font-size: 12px; font-style: italic; }
</style>
</head>
<body>
<h1>%(message)s</h1>
<p>%(explain)s</p>
<hr />
<small>{server.name} at {server.address}:{server.port}</small>
</body>
</html>
'''
Http.RESPONSES = {
	403: ('Forbidden', 'You don\'t have permission to access %(url)s on this server.'),
	404: ('Not Found', 'The requested URL %(url)s was not found on this server.'),
}
#---
Http.ADDRESS = '0.0.0.0'
Http.PORT = 8008

### global objects
THREAD = None
CREDENTIALS = None
SESSCLEARTIME = None



def start():
	global THREAD
	THREAD = HttpThread(Http.ADDRESS, Http.PORT)
	THREAD.start()
	THREAD.loop()

def stop():
	if THREAD:
		THREAD.stop()

def status():
	result = ''

	try:
		headers = { 'User-Agent': 'httplib', 'Accept': '*/*', 'Content-Type': 'application/json', 'Content-Length': 0 }
		request = httplib.HTTPConnection(Http.ADDRESS, Http.PORT)

		request.connect()
		request.request('POST', '/status', '', headers)
		response = request.getresponse()
		result = response.read()
		request.close()
	except Exception, e:
		if e.errno == 111:
			return None

	try:
		return json.loads(result)
	except Exception, e:
		return False

def shutdown():
	try:
		headers = { 'User-Agent': 'httplib', 'Accept': '*/*', 'Content-Type': 'message/signal', 'Content-Length': 0 }
		request = httplib.HTTPConnection(Http.ADDRESS, Http.PORT)

		request.connect()
		request.request('SHUTDOWN', '/', '', headers)
		response = request.getresponse()
		status = response.status
		request.close()
	except Exception, e:
		print e
		return None

	return status



### Http.requestHandler extension class
class HttpRequestHandler(Http.RequestHandler):

	def __init__(self, request, client_address, server):
		self.session = Http.Session(self)
		Http.RequestHandler.__init__(self, request, client_address, server)

		global SESSCLEARTIME
		if SESSCLEARTIME is None or time.time() - SESSCLEARTIME > 86400:
			self.session.cache_clear()
			SESSCLEARTIME = time.time()

	def data(self):
		ctype = self.headers.getheader('Content-Type')
		length = self.headers.getheader('Content-Length')

		if not ctype is None:
			ctype, pdict = cgi.parse_header(ctype)

			if ctype == 'application/json':
				try:
					return json.loads(self.rfile.read(int(length)))
				except Exception, e:
					pass

		return {}

	def do_GET(self):
		controller = self.path.split('/')[1]

		if self.path == '/index.html':
			self.send_error(404)
		elif self.path == '/':
			self.session.start()
			# to do: implement login
			self.session.set('path', '/home')
			self.session.set('username', 'guest')
			self.session.set('permission', [])

			path = self.translate_path(self.path)
			ctype = self.guess_type(path)

			f = open(path, 'rb')
			fs = os.fstat(f.fileno())
			html = f.read()

			html = html.replace('{version}', str(Api.__version__))
			html = html.replace('{service}', str(Api.__service__))
			html = html.replace('{appname}', str(Api.__appname__))
			html = html.replace('{appweb}', str(Api.__appweb__))
			html = html.replace('{description}', str(Api.__description__))
			html = html.replace('{author}', str(Api.__author__))
			html = html.replace('{email}', str(Api.__email__).replace('@', 'AT'))

			self.send_response(200)
			self.send_header('Content-type', ctype)
			self.send_header('Content-Length', str(len(html)))
			self.send_header('Last-Modified', self.date_time_string(fs.st_mtime))
			self.end_headers()
			self.wfile.write(html)
			f.close()
		elif hasattr(Api, 'do_GET_' + controller):
			getattr(Api, 'do_GET_' + controller)(self)
		else:
			Http.RequestHandler.do_GET(self)

	def do_POST(self):
		controller = self.path.split('/')[1]

		if hasattr(Api, 'do_POST_' + controller):
			getattr(Api, 'do_POST_' + controller)(self)
		else:
			self.send_error(404)



### Http.server extension class
class HttpServer(Http.Server):

	def __init__(self, address, port, handler_class=HttpRequestHandler):
		Http.Server.__init__(self, address, port, handler_class)




### Http.thread extension class
class HttpThread(Http.Thread):

	def __init__(self, address, port):
		self.server = HttpServer(address, port)
		self.server._Thread__loop = False
		threading.Thread.__init__(self, target=self.server.serve_forever)
		self.setDaemon(True)

	def loop(self):
		self.server._Thread__loop = True
		while self.server._Thread__loop:
			pass
