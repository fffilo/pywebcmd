#!/usr/bin/env python
# -*- coding: utf-8 -*-

__version__ = 0.1
__service__ = 'pywebcmd'
__title__ = 'Python web file manager'
__keywords__ = 'python, web file manager, web commander'
__description__ = 'Python web file manager'
__server__ = 'pywebcmd/0.0 SimpleHTTP/0.0 Python/0.0.0'
__website__ = 'https://github.com/fffilo/pywebcmd'
__author__ = 'fffilo'
__email__ = 'fffilo666@gmail.com'

### import python modules
import sys, os, json

### import application modules
import App

### metadata
__server__ = __service__ + '/' + str(__version__) + ' ' + App.Http.NAME
App.Api.__version__ = __version__
App.Api.__service__ = __service__
App.Api.__title__ = __title__
App.Api.__keywords__ = __keywords__
App.Api.__description__ = __description__
App.Api.__server__ = __server__
App.Api.__website__ = __website__
App.Api.__author__ = __author__
App.Api.__email__ = __email__



def start():
	response = App.status()
	if response is None:
		pass
	elif response == False:
		print 'Unable to start service on ' + App.Http.ADDRESS + ':' + str(App.Http.PORT) + ' (address in use?).'
		return
	else:
		print 'Service ' + __service__ + ' already running.'
		return

	try:
		print 'Starting ' + __service__ + ' service (' + App.Http.NAME + ' on ' + str(App.Http.ADDRESS) + ':' + str(App.Http.PORT) + ')...'
		App.start()
		print 'Signal SHUTDOWN received, shutting down ' + __service__ + ' service.'
		App.stop()
	except KeyboardInterrupt, SystemExit:
		print 'Signal SIGINT received, shutting down ' + __service__ + ' service.'
		App.stop()
	except Exception, e:
		print 'E:', str(e)
		App.stop()
		exit(1)

def stop():
	response = App.status()
	if not response:
		print 'Service ' + __service__ + ' not running.'
		return

	status = App.shutdown()
	if status is None or status != 200:
		print 'E: unable to stop ' + __service__ + ' server (unknown error).'
		exit(1)

	print 'Service ' + __service__ + ' stopped.'

def status():
	response = App.status()
	if response is None:
		print 'Service ' + __service__ + ' stopped.'
		return

	if 'name' in response and response['name'] == __service__:
		print 'Service ' + __service__ + ' running on port ' + str(App.Http.PORT) + '.'
	else:
		print 'Another service running on port ' + str(App.Http.PORT) + '.'

def help():
	#exe = os.path.realpath(sys.argv[0])
	exe = os.path.normpath(os.path.join(os.getcwd(), sys.argv[0]))
	if not os.access(exe, os.X_OK):
		exe = 'python ' + exe

	print 'Usage: ' + exe + ' start|stop|status'



### cli
if __name__ == '__main__':

	# arguments (default)
	App.Api.ICONSIZE = 16
	App.Http.ADDRESS = '0.0.0.0'
	App.Http.PORT = 8008
	App.CREDENTIALS = None

	# config
	try:
		config = json.load(open('config.json'))
		if 'credentials' in config: App.CREDENTIALS = config['credentials']
		if 'listen' in config and 'address' in config['listen']: App.Http.ADDRESS = str(config['listen']['address'])
		if 'listen' in config and 'port' in config['listen']: App.Http.PORT = int(config['listen']['port'])
		if 'icon' in config and 'size' in config['icon']: App.Api.ICONSIZE = int(config['icon']['size'])
	except Exception, e:
		pass

	# check credentials
	if App.CREDENTIALS is None or not type(App.CREDENTIALS) is list or len(App.CREDENTIALS) == 0:
		print 'E:', 'Credentials not defined. Check config file.'
		exit(1)

	# go, go, go...
	if len(sys.argv) != 2:
		help()
	elif sys.argv[1] == 'start':
		start()
	elif sys.argv[1] == 'stop':
		stop()
	elif sys.argv[1] == 'status':
		status()
	else:
		help()
