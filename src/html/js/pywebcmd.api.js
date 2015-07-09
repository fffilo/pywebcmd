;(function($) {

	window.pywebcmd     = window.pywebcmd     || {};
	window.pywebcmd.api = window.pywebcmd.api || {};

	var _ajax = function(method, data) {
		$.ajax({
			url: '/' + method,
			method: 'post',
			contentType: 'application/json',
			dataType: 'json',
			data: JSON.stringify(data),
			complete: function(jqXHR, textStatus) {
				if (window.pywebcmd.callback && typeof(window.pywebcmd.callback[method]) == 'function') {
					window.pywebcmd.callback[method].call(this, jqXHR, textStatus);
				}
			}
		});
	}

	window.pywebcmd.api.login = function(username, password) {
		var data = {
			username : username,
			password : password
		}

		_ajax('login', data);
	}

	window.pywebcmd.api.ls = function(source) {
		var data = {
			source      : source || undefined,
			destination : undefined,
			properties  : '' //[ icon, basename, dirname, type, mime, owner, group, permission, size, ctime, mtime, atime ]
		}

		_ajax('ls', data);
	}

	window.pywebcmd.api.cp = function(source, destination) {
		var data = {
			source      : source      || undefined,
			destination : destination || undefined
		}

		_ajax('cp', data);
	}

	window.pywebcmd.api.mv = function(source, destination) {
		var data = {
			source      : source      || undefined,
			destination : destination || undefined
		}

		_ajax('mv', data);
	}

	window.pywebcmd.api.rm = function(source) {
		var data = {
			source      : source || undefined,
			destination : undefined
		}

		_ajax('rm', data);
	}

	window.pywebcmd.api.nf = function(source) {
		var data = {
			source      : source || undefined,
			destination : undefined
		}

		_ajax('nf', data);
	}

	window.pywebcmd.api.nd = function(source) {
		var data = {
			source      : source || undefined,
			destination : undefined
		}

		_ajax('nd', data);
	}

	window.pywebcmd.api.dl = function(source) {
		var data = {
			source      : source || undefined,
			destination : undefined
		}

		_ajax('dl', data);
	}

	window.pywebcmd.api.pr = function(source) {
		var data = {
			source      : source || undefined,
			destination : undefined
		}

		_ajax('pr', data);
	}

	window.pywebcmd.api.st = function() {
		// status (ping pid)
	}

})(jQuery);
