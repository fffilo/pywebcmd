(function($) {

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

	window.pywebcmd.api.cp = function() {
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

	window.pywebcmd.api.mv = function() {
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

	window.pywebcmd.api.rm = function() {
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

	window.pywebcmd.api.pr = function() {
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

	window.pywebcmd.api.sr = function() {
		/*
			// server properties
			send = {}
			receive = {
				source      : undefined,
				destination : undefined,
				data        : {
					init: %timestamp,
					timestamp: %timestamp,
					name: 'pywebcmd',
					fullname: 'pywebcmd/0.1 SimpleHTTP/0.6 Python/2.7.6',
					desc: 'created by fffilo',
				}
			}
		*/
	}

})(jQuery);
