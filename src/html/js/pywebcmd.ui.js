;(function($) {

	/**
	 * Python web commander
	 * @type {Object}
	 */
	window.pywebcmd = window.pywebcmd || {};

	/**
	 * UI elements
	 * @type {Object}
	 */
	window.pywebcmd.ui = {}

	// init all UI elements
	$(document).ready(function(event) {
		_block();
		_nav();
		_dialog();
		_log();
	});

	var _block = function() {
		window.pywebcmd.ui.lblock     = $('.lblock');
		window.pywebcmd.ui.lpath      = $('.lpath');
		window.pywebcmd.ui.lhead      = $('.lhead');
		window.pywebcmd.ui.lbody      = $('.lbody');
		window.pywebcmd.ui.rblock     = $('.rblock');
		window.pywebcmd.ui.rpath      = $('.rpath');
		window.pywebcmd.ui.rhead      = $('.rhead');
		window.pywebcmd.ui.rbody      = $('.rbody');
	}

	var _nav = function() {
		window.pywebcmd.ui.nav        = {};
		window.pywebcmd.ui.nav.parent = $('.nav');
		$.each(['copy', 'move', 'rename', 'delete', 'newfile', 'newdir', 'download', 'properties'], function(key, value) {
			window.pywebcmd.ui.nav[value] = $(window.pywebcmd.ui.nav.parent).find('.' + value).find('a').first();
		});
	}

	var _dialog = function() {
		window.pywebcmd.ui.dialog = {};
		window.pywebcmd.ui.dialog.parent = $('.dialog');

		window.pywebcmd.ui.dialog.login = {};
		window.pywebcmd.ui.dialog.login.parent = $(window.pywebcmd.ui.dialog.parent).find('.login');
		window.pywebcmd.ui.dialog.login.username = $(window.pywebcmd.ui.dialog.login.parent).find('#username');
		window.pywebcmd.ui.dialog.login.password = $(window.pywebcmd.ui.dialog.login.parent).find('#password');
		window.pywebcmd.ui.dialog.login.ok = $(window.pywebcmd.ui.dialog.login.parent).find('.ok').first();
		window.pywebcmd.ui.dialog.login.cancel = $(window.pywebcmd.ui.dialog.login.parent).find('.cancel').first();

		window.pywebcmd.ui.dialog.fileinfo = {};
		window.pywebcmd.ui.dialog.fileinfo.parent = $(window.pywebcmd.ui.dialog.parent).find('.fileinfo');
		window.pywebcmd.ui.dialog.fileinfo.title = $(window.pywebcmd.ui.dialog.fileinfo.parent).find('.title').first();
		window.pywebcmd.ui.dialog.fileinfo.title.data('pywebcmd-html', $(window.pywebcmd.ui.dialog.fileinfo.title).text());
		window.pywebcmd.ui.dialog.fileinfo.title.data('pywebcmd-title', $(window.pywebcmd.ui.dialog.fileinfo.title).attr('title'));
		window.pywebcmd.ui.dialog.fileinfo.icon = $(window.pywebcmd.ui.dialog.fileinfo.parent).find('.icon').first();
		window.pywebcmd.ui.dialog.fileinfo.icon.data('pywebcmd-size', 32);
		$.each(['realpath', 'dirname', 'basename', 'isdir', 'isfile', 'islink', 'type', 'mime', 'encoding', 'owner', 'group', 'permission', 'size', 'ctime', 'mtime', 'atime'], function(key, value) {
			window.pywebcmd.ui.dialog.fileinfo[value]        = {};
			window.pywebcmd.ui.dialog.fileinfo[value].parent = $(window.pywebcmd.ui.dialog.fileinfo.parent).find('.' + value);
			window.pywebcmd.ui.dialog.fileinfo[value].key    = $(window.pywebcmd.ui.dialog.fileinfo[value].parent).find('.key');
			window.pywebcmd.ui.dialog.fileinfo[value].value  = $(window.pywebcmd.ui.dialog.fileinfo[value].parent).find('.value');

			$(window.pywebcmd.ui.dialog.fileinfo[value].key).data('pywebcmd-html', $(window.pywebcmd.ui.dialog.fileinfo[value].key).text());
			$(window.pywebcmd.ui.dialog.fileinfo[value].key).data('pywebcmd-title', $(window.pywebcmd.ui.dialog.fileinfo[value].key).attr('title'));
			$(window.pywebcmd.ui.dialog.fileinfo[value].value).data('pywebcmd-html', $(window.pywebcmd.ui.dialog.fileinfo[value].value).text());
			$(window.pywebcmd.ui.dialog.fileinfo[value].value).data('pywebcmd-title', $(window.pywebcmd.ui.dialog.fileinfo[value].value).attr('title'));
		});
		window.pywebcmd.ui.dialog.fileinfo.ok = $(window.pywebcmd.ui.dialog.fileinfo.parent).find('.ok').first();
		window.pywebcmd.ui.dialog.fileinfo.cancel = $(window.pywebcmd.ui.dialog.fileinfo.parent).find('.cancel').first();

		window.pywebcmd.ui.dialog.progress = {};
		window.pywebcmd.ui.dialog.progress.parent = $(window.pywebcmd.ui.dialog.parent).find('.progress');
		window.pywebcmd.ui.dialog.progress.title = $(window.pywebcmd.ui.dialog.progress.parent).find('.title').first();
		$(window.pywebcmd.ui.dialog.progress.title).data('pywebcmd-html', $(window.pywebcmd.ui.dialog.progress.title).text());
		$(window.pywebcmd.ui.dialog.progress.title).data('pywebcmd-title', $(window.pywebcmd.ui.dialog.progress.title).attr('title'));
		window.pywebcmd.ui.dialog.progress.label = $(window.pywebcmd.ui.dialog.progress.parent).find('.label').first();
		$(window.pywebcmd.ui.dialog.progress.label).data('pywebcmd-html', $(window.pywebcmd.ui.dialog.progress.label).text());
		$(window.pywebcmd.ui.dialog.progress.label).data('pywebcmd-title', $(window.pywebcmd.ui.dialog.progress.label).attr('title'));
		window.pywebcmd.ui.dialog.progress.meter = $(window.pywebcmd.ui.dialog.progress.parent).find('.meter').first();
		window.pywebcmd.ui.dialog.progress.ok = $(window.pywebcmd.ui.dialog.progress.parent).find('.ok').first();
		window.pywebcmd.ui.dialog.progress.cancel = $(window.pywebcmd.ui.dialog.progress.parent).find('.cancel').first();

		window.pywebcmd.ui.dialog.error = {};
		window.pywebcmd.ui.dialog.error.parent = $(window.pywebcmd.ui.dialog.parent).find('.error');
		window.pywebcmd.ui.dialog.error.title = $(window.pywebcmd.ui.dialog.error.parent).find('.title').first();
		window.pywebcmd.ui.dialog.error.title.data('pywebcmd-html', $(window.pywebcmd.ui.dialog.error.title).text());
		window.pywebcmd.ui.dialog.error.title.data('pywebcmd-title', $(window.pywebcmd.ui.dialog.error.title).attr('title'));
		window.pywebcmd.ui.dialog.error.message = $(window.pywebcmd.ui.dialog.error.parent).find('.message').first();
		window.pywebcmd.ui.dialog.error.message.data('pywebcmd-html', $(window.pywebcmd.ui.dialog.error.message).text());
		window.pywebcmd.ui.dialog.error.message.data('pywebcmd-title', $(window.pywebcmd.ui.dialog.error.message).attr('title'));
		window.pywebcmd.ui.dialog.error.ok = $(window.pywebcmd.ui.dialog.error.parent).find('.ok').first();
		window.pywebcmd.ui.dialog.error.cancel = $(window.pywebcmd.ui.dialog.error.parent).find('.cancel').first();

		var match = $(window.pywebcmd.ui.dialog.fileinfo.icon).attr('class').toString().match(/(^|\s)size\-([0-9]+)(\s|$)/);
		if (match && ! isNaN(match[2] * 1)) {
			window.pywebcmd.ui.dialog.fileinfo.icon.data('pywebcmd-size', match[2] * 1);
		}
	}

	var _log = function() {
		window.pywebcmd.ui.log = $('.log');
	}

})(jQuery);
