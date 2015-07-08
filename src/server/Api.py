#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os, json, exceptions, ffile

__version__ = None
__service__ = None
__appname__ = None
__description__ = None



def response(RequestHandler, data):
	if data['status'] != 200:
		data['data'] = None

	html = json.dumps(data)

	RequestHandler.send_response(data['status'])
	RequestHandler.send_header('Content-type', 'application/json')
	RequestHandler.send_header('Content-Length', str(len(html)))
	RequestHandler.end_headers()
	RequestHandler.wfile.write(html)

def do_GET_ico(RequestHandler):
	date = None
	size = 16
	iname = 'empty'
	arr = RequestHandler.path.split('/')

	try:
		date = time.mktime(RequestHandler.headers.getheader('Date'))
	except Exception, e:
		pass

	try:
		size = int(arr[2])
	except Exception, e:
		pass

	try:
		iname = str(arr[3])
	except Exception, e:
		pass

	result = ffile.icon(iname, size)
	if result is None:
		result = ffile.icon('empty', size)

	RequestHandler.send_response(200)
	RequestHandler.send_header('Content-type', 'image/svg+xml')
	RequestHandler.end_headers()
	RequestHandler.wfile.write(result)

def do_POST_status(RequestHandler):
	data = RequestHandler.data()
	if data != {}:
		RequestHandler.send_error(500)
		return

	result = {
		'started': RequestHandler.server.timestamp,
		'listening': str(RequestHandler.server.server_address[0]) + ':' + str(RequestHandler.server.server_address[1]),
		'version': str(__version__),
		'service': __service__,
		'name': __appname__,
		'description': __description__
	}

	response(RequestHandler, result)

def do_POST_login(RequestHandler):
	RequestHandler.session.destroy()
	RequestHandler.session.start()

	data = RequestHandler.data()
	result = {
		'source': None,
		'destination': None,
		'status': 401,
		'message': 'Wrong username/password',
		'data': None
	}

	if not 'username' in data:
		result['message'] = 'Username not provided'
	elif not 'password' in data:
		result['message'] = 'Password not provided'
	else:
		for user in CREDENTIALS:
			if 'username' in user and 'password' in user:
				if user['username'] == data['username'] and user['password'] == data['password']:
					RequestHandler.session.set('username', user['username'])
					RequestHandler.session.set('path', '/')
					if 'path' in user:
						RequestHandler.session.set('path', user['path'])
					RequestHandler.session.set('permission', [])
					if 'permission' in user:
						RequestHandler.session.set('permission', user['permission'])

					result['status'] = 200
					result['message'] = 'OK'
					if 'path' in user:
						result['source'] = user['path']
						result['destination'] = user['path']
					if 'permission' in user:
						result['data'] = {
							'permission': user['permission']
						}

	response(RequestHandler, result)

def do_POST_ls(RequestHandler):
	RequestHandler.session.start()

	data = RequestHandler.data()
	result = {
		'source': None,
		'destination': None,
		'status': 200,
		'message': 'OK',
		'data': None
	}

	if not RequestHandler.session.get('username'):
		result['status'] = 401
		result['message'] = 'Not logged in.'
		response(RequestHandler, result)
		return
	if 'source' in data:
		result['source'] = data['source']
	if not 'source' in data and not RequestHandler.session.get('path') is None:
		result['source'] = RequestHandler.session.get('path')
	if result['source'] is None:
		result['status'] = 500
		result['message'] = 'Source not provided.'
		response(RequestHandler, result)
		return
	if not os.path.isdir(result['source']):
		result['status'] = 500
		result['message'] = 'Source is not directory.'
		response(RequestHandler, result)
		return result

	result['source'] = os.path.realpath(result['source'])

	try:
		if result['source'] == '/proc' or result['source'] == '/proc/' or result['source'][:6] == '/proc/':
			raise exceptions.OSError(13, 'Permission denied', '/proc')

		glob = os.listdir(result['source'])
		glob.insert(0, '..')
		glob.insert(0, '.')
		glob = sorted(glob)

		result['data'] = []
		for f in glob:
			result['data'].append(ffile.properties(result['source'] + '/' + f))
	except Exception, e:
		result['status'] = 500
		result['message'] = str(e)

	response(RequestHandler, result)

def do_POST_cp(RequestHandler):
	RequestHandler.session.start()

	result = {
		'source': None,
		'destination': None,
		'status': 500,
		'message': 'Work in progress',
		'data': None
	}

	if not RequestHandler.session.get('username'):
		result['status'] = 401
		result['message'] = 'Not logged in.'
		response(RequestHandler, result)
		return

	response(RequestHandler, result)

def do_POST_mv(RequestHandler):
	RequestHandler.session.start()

	result = {
		'source': None,
		'destination': None,
		'status': 500,
		'message': 'Work in progress',
		'data': None
	}

	if not RequestHandler.session.get('username'):
		result['status'] = 401
		result['message'] = 'Not logged in.'
		response(RequestHandler, result)
		return

	response(RequestHandler, result)

def do_POST_rm(RequestHandler):
	RequestHandler.session.start()

	result = {
		'source': None,
		'destination': None,
		'status': 500,
		'message': 'Work in progress',
		'data': None
	}

	if not RequestHandler.session.get('username'):
		result['status'] = 401
		result['message'] = 'Not logged in.'
		response(RequestHandler, result)
		return

	response(RequestHandler, result)

def do_POST_nf(RequestHandler):
	RequestHandler.session.start()

	result = {
		'source': None,
		'destination': None,
		'status': 500,
		'message': 'Work in progress',
		'data': None
	}

	if not RequestHandler.session.get('username'):
		result['status'] = 401
		result['message'] = 'Not logged in.'
		response(RequestHandler, result)
		return

	response(RequestHandler, result)

def do_POST_nd(RequestHandler):
	RequestHandler.session.start()

	result = {
		'source': None,
		'destination': None,
		'status': 500,
		'message': 'Work in progress',
		'data': None
	}

	if not RequestHandler.session.get('username'):
		result['status'] = 401
		result['message'] = 'Not logged in.'
		response(RequestHandler, result)
		return

	response(RequestHandler, result)

def do_POST_dl(RequestHandler):
	RequestHandler.session.start()

	result = {
		'source': None,
		'destination': None,
		'status': 500,
		'message': 'Work in progress',
		'data': None
	}

	if not RequestHandler.session.get('username'):
		result['status'] = 401
		result['message'] = 'Not logged in.'
		response(RequestHandler, result)
		return

	response(RequestHandler, result)

def do_POST_pr(RequestHandler):
	RequestHandler.session.start()

	data = RequestHandler.data()
	result = {
		'source': None,
		'destination': None,
		'status': 200,
		'message': 'OK',
		'data': None
	}

	if not RequestHandler.session.get('username'):
		result['status'] = 401
		result['message'] = 'Not logged in.'
		response(RequestHandler, result)
		return
	if not 'source' in data:
		result['status'] = 500
		result['message'] = 'Source not provided.'
		response(RequestHandler, result)
		return
	if not type(data['source'] is list):
		result['status'] = 500
		result['message'] = 'Invalid source.'
		response(RequestHandler, result)
		return

	result['source'] = data['source']
	result['data'] = []

	for f in data['source']:
		result['data'].append(ffile.properties(f))

	response(RequestHandler, result)

def do_POST_st(RequestHandler):
	RequestHandler.session.start()

	result = {
		'source': None,
		'destination': None,
		'status': 500,
		'message': 'Work in progress',
		'data': None
	}

	if not RequestHandler.session.get('username'):
		result['status'] = 401
		result['message'] = 'Not logged in.'
		response(RequestHandler, result)
		return

	response(RequestHandler, result)
