#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os, stat, pwd, grp, magic, gtk, gio

_theme = gtk.icon_theme_get_default()

def properties(path):
	stats = None
	lstats = None

	try:
		stats = os.stat(path)
	except Exception, e:
		pass
	try:
		lstats = os.lstat(path)
	except Exception, e:
		pass

	result = {}

	# broken symlink
	if stats is None and not lstats is None:
		stats = lstats
		result['type'] = 'broken symbolic link'
		result['mime'] = 'inode/symlink'
		result['encoding'] = ''
	else:
		result['type'] = magic.from_file(path)
		result['mime'] = magic.from_file(path, mime=True)
		result['encoding'] = magic.Magic(mime_encoding=True).from_file(path)

	# broken owner
	result['owner'] = stats.st_uid
	try:
		result['owner'] = pwd.getpwuid(result['owner'])[0]
	except Exception, e:
		pass

	# broken group
	result['group'] = stats.st_gid
	try:
		result['group'] = grp.getgrgid(result['group'])[0]
	except Exception, e:
		pass

	result['realpath'] = os.path.realpath(path)
	result['dirname'] = os.path.dirname(path)
	result['basename'] = os.path.basename(path)
	result['isdir'] = os.path.isdir(path)
	result['isfile'] = os.path.isfile(path)
	result['islink'] = os.path.islink(path)
	result['size'] = stats.st_size
	result['ctime'] = stats.st_ctime
	result['mtime'] = stats.st_mtime
	result['atime'] = stats.st_atime
	result['permission'] = oct(stat.S_IMODE(lstats.st_mode)) if result['islink'] else oct(stat.S_IMODE(stats.st_mode))
	result['icon'] = gio.File(path).query_info('standard::icon').get_icon().get_names()[0]

	return result

'''
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
'''

def icon(name, size=32):
	# to do: fallback
	#	file:      <?xml version="1.0" encoding="UTF-8" standalone="no"?><svg id="svg3428" xmlns="http://www.w3.org/2000/svg" height="{size}" width="{size}" viewBox="0 0 64 64" version="1.0" xmlns:xlink="http://www.w3.org/1999/xlink"><defs id="defs3430"><linearGradient id="linearGradient3246" y2="609.51" gradientUnits="userSpaceOnUse" x2="302.86" gradientTransform="matrix(.091538 0 0 .020588 -1.0846 49.451)" y1="366.65" x1="302.86"><stop id="stop5050" style="stop-opacity:0" offset="0"/><stop id="stop5056" offset=".5"/><stop id="stop5052" style="stop-opacity:0" offset="1"/></linearGradient><radialGradient id="radialGradient3243" xlink:href="#linearGradient5060" gradientUnits="userSpaceOnUse" cy="486.65" cx="605.71" gradientTransform="matrix(-.031326 0 0 .020588 28.779 49.451)" r="117.14"/><linearGradient id="linearGradient5060"><stop id="stop5062" offset="0"/><stop id="stop5064" style="stop-opacity:0" offset="1"/></linearGradient><radialGradient id="radialGradient3240" xlink:href="#linearGradient5060" gradientUnits="userSpaceOnUse" cy="486.65" cx="605.71" gradientTransform="matrix(.031326 0 0 .020588 35.221 49.451)" r="117.14"/><linearGradient id="linearGradient3237" y2="2.9062" gradientUnits="userSpaceOnUse" x2="-51.786" gradientTransform="matrix(1.0844 0 0 1.1997 79.551 -4.1628)" y1="50.786" x1="-51.786"><stop id="stop3106" style="stop-color:#aaa" offset="0"/><stop id="stop3108" style="stop-color:#c8c8c8" offset="1"/></linearGradient><linearGradient id="linearGradient3235" y2="47.013" gradientUnits="userSpaceOnUse" x2="25.132" gradientTransform="matrix(1.3429 0 0 1.282 -.22855 -2.7341)" y1=".98521" x1="25.132"><stop id="stop3602" style="stop-color:#f4f4f4" offset="0"/><stop id="stop3604" style="stop-color:#dbdbdb" offset="1"/></linearGradient><radialGradient id="radialGradient3232" gradientUnits="userSpaceOnUse" cy="112.3" cx="102" gradientTransform="matrix(.48571 0 0 -.52393 .91430 63.541)" r="139.56"><stop id="stop41" style="stop-color:#b7b8b9" offset="0"/><stop id="stop47" style="stop-color:#ececec" offset=".18851"/><stop id="stop49" style="stop-color:#fafafa;stop-opacity:0" offset=".25718"/><stop id="stop51" style="stop-color:#fff;stop-opacity:0" offset=".30111"/><stop id="stop53" style="stop-color:#fafafa;stop-opacity:0" offset=".53130"/><stop id="stop55" style="stop-color:#ebecec;stop-opacity:0" offset=".84490"/><stop id="stop57" style="stop-color:#e1e2e3;stop-opacity:0" offset="1"/></radialGradient><linearGradient id="linearGradient3229" y2="46.017" gradientUnits="userSpaceOnUse" x2="24" gradientTransform="matrix(1.3636 0 0 1.3256 -.72725 -1.8139)" y1="2" x1="24"><stop id="stop3213" style="stop-color:#fff" offset="0"/><stop id="stop3215" style="stop-color:#fff;stop-opacity:0" offset="1"/></linearGradient><linearGradient id="linearGradient3225" y2="5.4565" gradientUnits="userSpaceOnUse" x2="36.358" gradientTransform="matrix(1.3539 0 0 1.3812 -.61194 -1.6903)" y1="8.059" x1="32.892"><stop id="stop8591" style="stop-color:#fefefe" offset="0"/><stop id="stop8593" style="stop-color:#cbcbcb" offset="1"/></linearGradient></defs><g id="layer1"><rect id="rect2879" style="opacity:.3;fill:url(#linearGradient3246)" height="5" width="44.2" y="57" x="9.9"/><path id="path2881" style="opacity:.3;fill:url(#radialGradient3243)" d="m9.9 57v5c-1.6132 0.009-3.9-1.12-3.9-2.5s1.8002-2.5 3.9-2.5z"/><path id="path2883" style="opacity:.3;fill:url(#radialGradient3240)" d="m54.1 57v5c1.613 0.009 3.9-1.12 3.9-2.5s-1.8-2.5-3.9-2.5z"/><path id="path4160" style="stroke-linejoin:round;stroke:url(#linearGradient3237);stroke-width:.99992;fill:url(#linearGradient3235)" d="m8.5 0.49996h32.31c1.89 0.63634 12.04 7.8865 14.69 12.906v46.094h-47v-59z"/><path id="path4191" style="fill:url(#radialGradient3232)" d="m9.6572 58.826c-0.2677 0-0.4858-0.235-0.4858-0.524v-56.585c0-0.2889 0.2181-0.5236 0.4858-0.5236 10.049 0.1448 21.185-0.21665 31.221 0.036l13.808 11.887 0.143 45.186c0 0.289-0.218 0.524-0.486 0.524h-44.686z"/><path id="path2435" style="opacity:.6;stroke-linejoin:round;stroke:url(#linearGradient3229);stroke-width:.99992;fill:none" d="m54.5 13.405v45.095h-45v-57h31.181"/><g id="g3423" transform="translate(-31.058)"><path id="path3232" style="opacity:.05;fill-rule:evenodd" d="m66.793 0.98785c6.565 0 3.301 13.004 3.301 13.004s15.878-3.623 15.878 2.803l0.036-3.053c-3.392-3.392-10.579-10.027-15.205-12.553 0-0.0004-4.01-0.20115-4.01-0.20115z"/><path id="path3230" style="opacity:.1;fill-rule:evenodd" d="m68.039 0.98785c6.139 0 3.087 12.159 3.087 12.159s14.846-2.842 14.846 3.094c0.786-5.065-13.095-16.829-17.933-15.253v-0.00015z"/><path id="path3382" style="opacity:.15;fill-rule:evenodd" d="m72.054 12.387s13.918-2.4221 13.918 3.787c0-3.506-7.836-13.315-16.811-15.186 4.363 1.67 3.77 7.2653 2.893 11.399z"/></g><path id="path4474" style="fill:url(#linearGradient3225);fill-rule:evenodd" d="m38 1c4.324 0 3.17 10.169 3.17 10.169s13.808-1.3022 13.808 4.831c0-1.494 0.116-2.564-0.182-3.031-2.142-3.3499-11.393-10.868-14.734-11.853-0.25-0.0736-0.804-0.116-2.062-0.116z"/></g></svg>
	#	directory: <?xml version="1.0" encoding="UTF-8" standalone="no"?><svg id="svg2906" xmlns="http://www.w3.org/2000/svg" height="{size}" width="{size}" viewBox="0 0 64 64" version="1.0" xmlns:xlink="http://www.w3.org/1999/xlink"><defs id="defs2908"><radialGradient id="radialGradient2904" gradientUnits="userSpaceOnUse" cy="5.0172" cx="3" gradientTransform="matrix(-1.7093e-8 2.28 -2.8952 -1.9417e-8 16.801 2.2898)" r="21"><stop id="stop3486" style="stop-color:#bdbdbd" offset="0"/><stop id="stop3488" style="stop-color:#d0d0d0" offset="1"/></radialGradient><linearGradient id="linearGradient2902" y2="16.19" gradientUnits="userSpaceOnUse" x2="62.989" gradientTransform="matrix(1.3408 0 0 1.33 -68.673 -1.51)" y1="13.183" x1="62.989"><stop id="stop6406" style="stop-color:#f9f9f9" offset="0"/><stop id="stop6408" style="stop-color:#c9c9c9" offset="1"/></linearGradient><radialGradient id="radialGradient2880" gradientUnits="userSpaceOnUse" cy="486.65" cx="605.71" gradientTransform="matrix(-.032130 0 0 .037059 23.363 25.412)" r="117.14"><stop id="stop2681" offset="0"/><stop id="stop2683" style="stop-opacity:0" offset="1"/></radialGradient><radialGradient id="radialGradient2878" gradientUnits="userSpaceOnUse" cy="486.65" cx="605.71" gradientTransform="matrix(.032130 0 0 .037059 24.637 25.412)" r="117.14"><stop id="stop2675" offset="0"/><stop id="stop2677" style="stop-opacity:0" offset="1"/></radialGradient><linearGradient id="linearGradient2876" y2="609.51" gradientUnits="userSpaceOnUse" x2="302.86" gradientTransform="matrix(.082840 0 0 .037059 -5.9408 25.412)" y1="366.65" x1="302.86"><stop id="stop2667" style="stop-opacity:0" offset="0"/><stop id="stop2669" offset=".5"/><stop id="stop2671" style="stop-opacity:0" offset="1"/></linearGradient><linearGradient id="linearGradient2895" y2="15.944" gradientUnits="userSpaceOnUse" x2="65.34" gradientTransform="matrix(1.3408 0 0 1.3265 -72.463 -1.6032)" y1="45.114" x1="82.453"><stop id="stop3624-5" style="stop-color:#bb2b12" offset="0"/><stop id="stop3626-7" style="stop-color:#cd7233" offset="1"/></linearGradient><radialGradient id="radialGradient2893" gradientUnits="userSpaceOnUse" cy="14.113" cx="63.969" gradientTransform="matrix(2.0979 -1.262e-7 8.2824e-8 1.3475 -115.97 9.3537)" r="23.097"><stop id="stop3618-2" style="stop-color:#edb763" offset="0"/><stop id="stop2559" style="stop-color:#de7f32" offset=".5"/><stop id="stop3620-1" style="stop-color:#d24413" offset="1"/></radialGradient><linearGradient id="linearGradient2890" y2="36.658" gradientUnits="userSpaceOnUse" x2="22.809" gradientTransform="matrix(1.5348 0 0 1.327 -5.0206 -.048542)" y1="49.629" x1="22.935"><stop id="stop2661" style="stop-color:#0a0a0a;stop-opacity:.498" offset="0"/><stop id="stop2663" style="stop-color:#0a0a0a;stop-opacity:0" offset="1"/></linearGradient><radialGradient id="radialGradient2887" gradientUnits="userSpaceOnUse" cy="8.3021" cx="7.2647" gradientTransform="matrix(0 1.6066 -2.1817 0 34.686 9.2848)" r="20.98"><stop id="stop2693" style="stop-color:#fff;stop-opacity:0.4" offset="0"/><stop id="stop2695" style="stop-color:#fff;stop-opacity:0" offset="1"/></radialGradient><linearGradient id="linearGradient2884" y2="33.955" gradientUnits="userSpaceOnUse" x2="15.215" gradientTransform="matrix(1.3408 0 0 1.33 -.37331 -1.31)" y1="22.292" x1="11.566"><stop id="stop2687" style="stop-color:#fff;stop-opacity:.27451" offset="0"/><stop id="stop2689" style="stop-color:#fff;stop-opacity:.078431" offset="1"/></linearGradient></defs><g id="layer1"><path id="path2856" style="stroke-linejoin:round;stroke:url(#radialGradient2904);stroke-linecap:round;fill:url(#linearGradient2902)" d="m5.2811 9.6095c-0.9255 0.0102-1.6447 0.6555-1.6447 1.5305 0 7.334 0.043 12.953 0 19.618 1.9246 0 56.896-4.936 56.896-7.054v-8.58c0-0.875-0.643-1.54-1.569-1.53h-27.158c-2.745 0-4.691-3.999-6.704-3.999l-19.82 0.0145z"/><g id="g2858" style="opacity:.4" transform="matrix(1.2849 0 0 .88667 .96746 18.44)"><rect id="rect2860" style="fill:url(#linearGradient2876)" height="9" width="40.7" y="39" x="4"/><path id="path2862" style="fill:url(#radialGradient2878)" d="m44.7 39v9c1.655 0.017 4-2.017 4-4.501s-1.846-4.499-4-4.499z"/><path id="path2864" style="fill:url(#radialGradient2880)" d="m4 39v9c-1.6546 0.017-4-2.017-4-4.501s1.8464-4.499 4-4.499z"/></g><path id="path2866" style="stroke-linejoin:round;stroke:url(#linearGradient2895);stroke-linecap:round;stroke-width:.99868;fill:url(#radialGradient2893)" d="m2.5259 20.468c-1.4382 0.164-0.8699 1.86-0.9846 2.814 0.5263 11.235 1.2577 22.244 1.7807 33.479 0.4584 1.281 2.1379 0.625 3.202 0.788h53.07c1.46-0.142 0.853-1.868 1.059-2.855 0.526-11.236 1.258-22.244 1.781-33.48-0.337-1.265-2.238-0.562-3.235-0.746h-56.673-0.0001z"/><path id="path2868" style="opacity:.4;fill:url(#linearGradient2890)" d="m2.3863 19.857h58.855c0.851 0 1.402 0.592 1.402 1.327l-1.668 35.829c0 0.735-0.685 1.327-1.535 1.327h-55.252c-0.8503 0-1.5348-0.592-1.5348-1.327l-1.6682-35.829c0.00001-0.736 0.5511-1.327 1.4013-1.327z"/><path id="path2870" style="stroke-linejoin:round;stroke:url(#radialGradient2887);stroke-linecap:round;fill:none" d="m61.673 21.565h-58.994c0.321 10.435 1.0335 21.751 1.5503 32.627"/><path id="path2872" style="fill:url(#linearGradient2884)" d="m60.967 19.97c-19.508 0.098-39.023-0.028-58.533 0-2.4225 0.547-1.1188 3.281-1.3039 5.016 0.2977 5.537 0.4332 11.099 0.8319 16.621 20.112-3.143 40.125-6.128 59.885-9.376 1.047-3.44 1.056-7.542 0.881-11.211-0.307-0.671-1.055-1.065-1.761-1.05z"/><rect id="rect2874" style="display:block;fill:#eda374" rx="1.3408" ry=".99632" height="2.1212" width="19" y="12" x="6"/></g></svg>

	try:
		path = os.path.realpath(_theme.lookup_icon(name, size, 0).get_filename())
		icon = open(path, 'r')
		result = icon.read()
		icon.close();

		return result
	except Exception, e:
		return None
