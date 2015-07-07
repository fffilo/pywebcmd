;(function($) {

	window.pywebcmd     = window.pywebcmd     || {};
	window.pywebcmd.api = window.pywebcmd.api || {};

	var _ajax = function(url, data, callback) {
		$.ajax({
			url: url,
			method: 'post',
			contentType: 'application/json',
			dataType: 'json',
			data: JSON.stringify(data),
			complete: function(jqXHR, textStatus) {
				if (typeof(callback) === 'function') {
					callback.call(this, jqXHR, textStatus);
				}
			}
		});
	}

	window.pywebcmd.api.login = function(username, password, callback) {
		var data = {
			username : username,
			password : password
		}

		_ajax('/login', data, callback);
	}

	window.pywebcmd.api.ls = function(source, callback) {
		var data = {
			source      : source || undefined,
			destination : undefined,
			properties  : '' //[ icon, basename, dirname, type, mime, owner, group, permission, size, ctime, mtime, atime ]
		}

		_ajax('/ls', data, callback);

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

	window.pywebcmd.api.cp = function(source, destination, callback) {
		var data = {
			source      : source      || undefined,
			destination : destination || undefined
		}

		_ajax('/cp', data, callback);

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

	window.pywebcmd.api.mv = function(source, destination, callback) {
		var data = {
			source      : source      || undefined,
			destination : destination || undefined
		}

		_ajax('/mv', data, callback);

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

	window.pywebcmd.api.rm = function(source, callback) {
		var data = {
			source      : source || undefined,
			destination : undefined
		}

		_ajax('/rm', data, callback);

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

	window.pywebcmd.api.nf = function(source, callback) {
		var data = {
			source      : source || undefined,
			destination : undefined
		}

		_ajax('/nf', data, callback);
	}

	window.pywebcmd.api.nd = function(source, callback) {
		var data = {
			source      : source || undefined,
			destination : undefined
		}

		_ajax('/nd', data, callback);
	}

	window.pywebcmd.api.dl = function(source, callback) {
		var data = {
			source      : source || undefined,
			destination : undefined
		}

		_ajax('/dl', data, callback);
	}

	window.pywebcmd.api.pr = function(source, callback) {
		var data = {
			source      : source || undefined,
			destination : undefined
		}

		_ajax('/pr', data, callback);

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
