#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os, json, ffile

__version__ = None
__service__ = None
__appname__ = None
__description__ = None

ICONSIZE = 16


def response(RequestHandler, status, html=None):
	if status != 200:
		RequestHandler.send_error(500)
	else:
		RequestHandler.log_request(status)
		RequestHandler.wfile.write(html)

def do_GET_ico(RequestHandler):
	date = None
	size = ICONSIZE
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

	# import email.utils, time
	# time.mktime(email.utils.parsedate('Mon, 29 Jun 2015 16:52:52 GMT'))

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
		response(RequestHandler, 500)
		return

	result = {
		'started': RequestHandler.server.timestamp,
		'listening': str(RequestHandler.server.server_address[0]) + ':' + str(RequestHandler.server.server_address[1]),
		'version': str(__version__),
		'service': __service__,
		'name': __appname__,
		'description': __description__
	}

	response(RequestHandler, 200, json.dumps(result))

def do_POST_ls(RequestHandler):
	RequestHandler.session.start()
	if not RequestHandler.session.get('username'):
		response(RequestHandler, 500)
		return

	data = RequestHandler.data()
	if not 'source' in data and not RequestHandler.session.get('path') is None:
		data['source'] = RequestHandler.session.get('path')
	elif not 'source' in data:
		response(RequestHandler, 500)
		return

	result = {
		'source': data['source'],
		'destination': None,
		'status': 200,
		'message': 'OK',
		'data': None
	}

	if not os.path.isdir(result['source']):
		result['status'] = 500
		result['message'] = 'Source is not directory.'
		return result

	'''
	result['data'] = {
		'icon': {},
		'glob': []
	}

	for f in glob.glob(result['source'] + '/*'):
		item = ffile.properties(f)
		result['data']['glob'].append(item)

		if ICONSIZE and not item['icon'] in result['data']['icon']:
			result['data']['icon'][item['icon']] = ffile.icon(item['icon'], ICONSIZE)
	'''

	glob = os.listdir(result['source'])
	glob.insert(0, '..')
	glob.insert(0, '.')
	glob = sorted(glob)

	result['data'] = []
	for f in glob:
		result['data'].append(ffile.properties(result['source'] + '/' + f))

	response(RequestHandler, result['status'], json.dumps(result))
