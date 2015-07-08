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
				if (window.pywebcmd.callback && typeof(window.pywebcmd.callback[method] == 'function')) {
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

		/*
			// list directory
			send = {
				source      : %dirname%,
				destination : undefined,
				properties  : [ icon, basename, dirname, type, mime, owner, group, permission, size, ctime, mtime, atime ]
			}
			receive = {
				source      : %dirname%,
				destination : undefined,
				data        : {
					icon : [],
					glob : []
				}
			}
		*/
	}

	window.pywebcmd.api.cp = function(source, destination) {
		var data = {
			source      : source      || undefined,
			destination : destination || undefined
		}

		_ajax('cp', data);

		/*
			// copy file/directory
			send = {
				source      : %path%,
				destination : %path%
			}
			receive = {
				???
			}
		*/
	}

	window.pywebcmd.api.mv = function(source, destination) {
		var data = {
			source      : source      || undefined,
			destination : destination || undefined
		}

		_ajax('mv', data);

		/*
			// move/rename file/directory
			send = {
				source      : %path%,
				destination : %path%
			}
			receive = {
				???
			}
		*/
	}

	window.pywebcmd.api.rm = function(source) {
		var data = {
			source      : source || undefined,
			destination : undefined
		}

		_ajax('rm', data);

		/*
			// delete file/directory
			send = {
				source      : %path%,
				destination : %path%
			}
			receive = {
				???
			}
		*/
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

		/*
			send = {
				source      : %path%,
				destination : undefined
			}
			// file/directory properties
			receive = {
				source      : %filepath%,
				destination : undefined,
				data        : {
					icon: '',
					basename: '',
					dirname: '',
					type: '',
					mime: '',
					owner: '',
					group: '',
					permission: '',
					size: '',
					ctime: '',
					mtime: '',
					atime: ''
				}
			}
		*/
	}

	window.pywebcmd.api.st = function() {
		/*
			// copy/move/delete status
			send = {
				source      : %path%,
				destination : undefined
			}
			receive = {
				???
			}
		*/
	}

})(jQuery);
