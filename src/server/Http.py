#!/usr/bin/env python
# -*- coding: utf-8 -*-

'''
A simple BaseHTTPServer.HTTPServer extension:
configure your docroot, index files, error template
and error response messages
'''

### import modules
import os, threading, tempfile, glob, json, string, random, time, SimpleHTTPServer, BaseHTTPServer, Cookie

### configuration
NAME = SimpleHTTPServer.SimpleHTTPRequestHandler.server_version + ' ' + SimpleHTTPServer.SimpleHTTPRequestHandler.sys_version
DOCROOT = os.path.realpath(os.path.dirname(__file__))
INDEX = ['index.html', 'index.htm', 'index.txt']
ERRTEMP = '''\
<head>
<title>Error response</title>
</head>
<body>
<h1>Error response</h1>
<p>Error code %(code)d.
<p>Message: %(message)s.
<p>Error code explanation: %(code)s = %(explain)s.
</body>
'''
RESPONSES = {
	404: ('Not Found', 'Nothing matches the given URI')
}



### Http session
class Session():

	name = 'pysessid'
	path = tempfile.gettempdir()
	file_prefix = 'pysess.'
	expire = 1440

	def __init__(self, handler_class):
		self._RequestHandlerClass = handler_class
		self._object = None
		self._header = None

	def _file_save(self):
		if self._object:
			try:
				f = open(self.path + '/' + self.file_prefix + self._object['session_id'], 'w')
				f.write(json.dumps(self._object, default=lambda o: o.__dict__, indent=4))
				f.close()
			except Exception, e:
				self.destroy()

	### start session
	def start(self):
		# empty session
		sessid = None
		values = {}

		# get session id from cookie
		if 'Cookie' in self._RequestHandlerClass.headers:
			cookie = Cookie.SimpleCookie(self._RequestHandlerClass.headers['Cookie'])
			if self.name in cookie:
				sessid = cookie[self.name].value

		# no session file
		if not sessid is None:
			if not os.path.isfile(self.path + '/' + self.file_prefix + sessid):
				sessid = None

		# create random session id
		if sessid is None:
			while (sessid is None) or (os.path.exists(self.path + '/' + self.file_prefix + sessid)):
				sessid = ''.join(random.choice(string.ascii_uppercase + string.ascii_lowercase + string.digits) for x in range(26))
			open(self.path + '/' + self.file_prefix + sessid, 'a').close()

		# check expire
		else:
			try:
				# read file and convert content to json
				f = open(self.path + '/' + self.file_prefix + sessid)
				values = json.loads(f.read())
				f.close()

				# if expired go to exception block
				if time.time() - values['last_activity'] > self.expire:
					raise Exception
			except Exception, e:
				# save session_id in _object
				self._object = {'session_id': sessid}

				# restart
				self.destroy();
				self.start()

				return

		# set values
		values['session_id'] = sessid
		values['ip_address'] = self._RequestHandlerClass.client_address[0]
		values['user_agent'] = self._RequestHandlerClass.headers['user-agent']
		values['last_activity'] = time.time()

		# save session
		self._object = values
		self._header = {'key': 'Set-Cookie', 'value': self.name + '=' + self._object['session_id'] + ';'}
		self._file_save()

	### destroy session
	def destroy(self):
		if not self._object is None:
			if os.path.isfile(self.path + '/' + self.file_prefix + self._object['session_id']):
				try:
					os.remove(self.path + '/' + self.file_prefix + self._object['session_id'])
				except Exception, e:
					pass

		self._object = None
		self._header = {'key': 'Set-Cookie', 'value': self.name + '=' + 'deleted' + '; expires=Thu, 01 Jan 1970 00:00:00 GMT;'}

	### get session property
	def get(self, key):
		if self._object and key in self._object:
			return self._object[key]

		return None

	### set session property
	def set(self, key, value):
		if self._object and key not in ['session_id', 'ip_address', 'user_agent', 'last_activity']:
			self._object[key] = value
			self._file_save()

	### delete session property
	def delete(self, key):
		if self._object and key in self._object and key not in ['session_id', 'ip_address', 'user_agent', 'last_activity']:
			del self._object[key]
			self._file_save()

	### send header to client so it can set/delete cookie
	def header(self):
		return self._header

	### clear old session files
	def cache_clear(self):
		for f in glob.glob(self.path + '/' +  self.file_prefix + '*'):
			if time.time() - os.path.getmtime(f) > self.expire:
				try:
					os.remove(f)
				except Exception, e:
					pass



### SimpleHTTPServer.SimpleHTTPRequestHandler extension class
class RequestHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):

	### set error template, response codes and init extended SimpleHTTPServer.SimpleHTTPRequestHandler
	def __init__(self, request, client_address, server):
		self.error_message_format = ERRTEMP
		self.error_message_format = self.error_message_format.replace('{server.name}', NAME)
		self.error_message_format = self.error_message_format.replace('{server.address}', str(client_address[0]))
		self.error_message_format = self.error_message_format.replace('{server.port}', str(server.server_port))

		self.responses.update(RESPONSES)

		if not hasattr(self, 'session'):
			self.session = Session(self)

		SimpleHTTPServer.SimpleHTTPRequestHandler.__init__(self, request, client_address, server)

	### handle GET request (display error 403, error 404 or self.path)
	def do_GET(self):
		if os.path.isdir(self.translate_path(self.path)):
			self.send_error(403)
		elif not os.path.isfile(self.translate_path(self.path)):
			self.send_error(404)
		else:
			SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self)

	### handle POST request (by default show 501 error)
	def do_POST(self):
		self.send_error(501, 'Unsupported method (%r)' % self.command)

	### handle PUT request (by default show 501 error)
	def do_PUT(self):
		self.send_error(501, 'Unsupported method (%r)' % self.command)

	### handle DELETE request (by default show 501 error)
	def do_DELETE(self):
		self.send_error(501, 'Unsupported method (%r)' % self.command)

	### handle SHUTDOWN request (exit loop in Http.Thread)
	def do_SHUTDOWN(self):
		if self.path == '/' and self.client_address[0] == '127.0.0.1' and self.headers.getheader('Content-Type') == 'message/signal':
			self.wfile.write("%s %d %s\r\n" % (self.protocol_version, 200, None))
			self.send_header('Server', self.version_string())
			self.send_header('Date', self.date_time_string())

			self.server._Thread__loop = False
		else:
			self.send_error(501, 'Unsupported method (%r)' % self.command)

	'''
	### you can define your own CUSTOM method
	def do_CUSTOM(self):
		self.send_error(501, 'Unsupported method (%r)' % self.command)
	'''

	### url added in BaseHTTPServer.BaseHTTPRequestHandler.send_error() explain variable
	def send_error(self, code, message=None):
		try:
			short, long = self.responses[code]
		except KeyError:
			short, long = '???', '???'
		if message is None:
			message = short
		explain = (long % {'url': self.path})
		self.log_error("code %d, message %s", code, message)
		content = (self.error_message_format % {'code': code, 'message': message.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"), 'explain': explain})
 		self.send_response(code, message)
		self.send_header("Content-Type", self.error_content_type)
		self.send_header('Connection', 'close')
		self.end_headers()
		if self.command != 'HEAD' and code >= 200 and code not in (204, 304):
			self.wfile.write(content)

	### send cookie to header
	def end_headers(self):
		if self.session.header():
			self.send_header(self.session.header()['key'], self.session.header()['value'])

		SimpleHTTPServer.SimpleHTTPRequestHandler.end_headers(self)

	### translate path using DOCROOT and INDEX
	def translate_path(self, path):
		# docroot
		path = DOCROOT + path

		# check for index
		if os.path.isdir(path):
			for f in INDEX:
				if os.path.exists(path + '/' + f):
					return os.path.realpath(path + '/' + f)

		# result
		return os.path.realpath(path)



### BaseHTTPServer.HTTPServer extension class
class Server(BaseHTTPServer.HTTPServer):
	def __init__(self, address, port, handler_class=RequestHandler):
		try:
			port = int(port)
		except Exception, e:
			raise Exception('Port must be integer value.')
		if port < 0 or port > 65535:
			raise Exception('Port must be in range 0-65535.')

		BaseHTTPServer.HTTPServer.__init__(self, (address, port), handler_class)
		self.timestamp = time.time()
		self._Thread__loop = False



### threading.Thread with http.server
class Thread(threading.Thread):
	def __init__(self, address, port):
		self.server = server(address, port)
		self.server._Thread__loop = False
		threading.Thread.__init__(self, target=self.server.serve_forever)
		self.setDaemon(True)

	def start(self):
		threading.Thread.start(self)

	def stop(self):
		self.server._Thread__loop = False
		self.server.socket.close()

	def loop(self):
		self.server._Thread__loop = True
		while self.server._Thread__loop:
			pass
