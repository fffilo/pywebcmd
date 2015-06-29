#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os, stat, pwd, grp, magic, gtk, gio

_theme = gtk.icon_theme_get_default()

def properties(path):
	stats = os.stat(path)
	lstats = os.lstat(path)

	result = {}
	result['basename'] = os.path.basename(path)
	result['dirname'] = os.path.dirname(path)
	result['isdir'] = os.path.isdir(path)
	result['isfile'] = os.path.isfile(path)
	result['islink'] = os.path.islink(path)
	result['type'] = magic.from_file(path)
	result['mime'] = magic.from_file(path, mime=True)
	result['encoding'] = magic.Magic(mime_encoding=True).from_file(path)
	result['size'] = stats.st_size
	result['ctime'] = stats.st_ctime
	result['mtime'] = stats.st_mtime
	result['atime'] = stats.st_atime
	result['owner'] = pwd.getpwuid(stats.st_uid)[0]
	result['group'] = grp.getgrgid(stats.st_gid)[0]
	result['permission'] = oct(stat.S_IMODE(lstats.st_mode)) if result['islink'] else oct(stat.S_IMODE(stats.st_mode))
	result['icon'] = gio.File(path).query_info('standard::icon').get_icon().get_names()[0]

	return result

def icon(name, size=16):
	try:
		fil = os.path.realpath(_theme.lookup_icon(name, size, 0).get_filename())
		mim = magic.from_file(fil, mime=True)
		ico = open(fil, 'r')
		img = ico.read()
		ico.close();

		return 'data:' + mim + ';base64,' + img.encode('base64').strip().replace(chr(10), '').replace(chr(13), '');
	except Exception, e:
		return None
