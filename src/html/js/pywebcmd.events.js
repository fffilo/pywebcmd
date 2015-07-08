;(function($) {

	// bind events on document ready
	$(document).ready(function(event) {
		// show directories list
		_preloader(window.pywebcmd.ui.lblock, true);
		_preloader(window.pywebcmd.ui.rblock, true);
		window.pywebcmd.log('command', 'Initial directory list')
		window.pywebcmd.api.ls(undefined, _initList);

		// sort table
		$(false)
			.add(window.pywebcmd.ui.lhead)
			.add(window.pywebcmd.ui.rhead)
				.on('click', 'th,td', _sortTable)
					.find('th,td')
						.filter('.basename')
							.click();

		// select block
		$(false)
			.add(window.pywebcmd.ui.lblock)
			.add(window.pywebcmd.ui.rblock)
				.on('click', _selectBlock)
				.filter(window.pywebcmd.ui.lblock)
					.click();

		// select/deselect row
		$(false)
			.add(window.pywebcmd.ui.lbody)
			.add(window.pywebcmd.ui.rbody)
				.on('click', 'tr', _selectRow);

		// open row (file/directory)
		$(false)
			.add(window.pywebcmd.ui.lbody)
			.add(window.pywebcmd.ui.rbody)
				.on('dblclick', 'tr', _openRow);

		// change path
		$(false)
			.add(window.pywebcmd.ui.lpath)
			.add(window.pywebcmd.ui.rpath)
				.on('keydown', _pathKeydown)
				.on('blur', _pathBlur);

		// navigation
		$(window.pywebcmd.ui.nav.parent)
			.on('click', 'a', _navclick);

		// dialog
		$(false)
			.add(window.pywebcmd.ui.dialog.login.ok)
			.add(window.pywebcmd.ui.dialog.login.cancel)
				.on('click', function() {
					window.pywebcmd.log('command', 'Login request');

					$(window.pywebcmd.ui.dialog.parent)
						.removeClass('loading')
						.removeClass('loginerror')
						.removeClass('fileinfo')
						.removeClass('progress')
						.removeClass('error')
						.addClass('loading');

					window.pywebcmd.api.login($(window.pywebcmd.ui.dialog.login.username).val(), CryptoJS.SHA512($(window.pywebcmd.ui.dialog.login.password).val().toString()).toString(), function(jqXHR) {
						if (jqXHR.status == 200) {
							window.pywebcmd.log('success', jqXHR.responseJSON.message);

							$(window.pywebcmd.ui.dialog.parent)
								.removeClass('overlay')
								.removeClass('loading')
								.removeClass('loginerror')
								.removeClass('login');

							_preloader(window.pywebcmd.ui.lblock, true);
							_preloader(window.pywebcmd.ui.rblock, true);
							window.pywebcmd.log('command', 'Initial directory list')
							window.pywebcmd.api.ls(undefined, _initList);
						}
						else {
							var message = 'Unknown error';
							if (jqXHR && jqXHR.responseJSON && jqXHR.responseJSON.message) {
								message = jqXHR.responseJSON.message;
							}
							else if (jqXHR.status == 0) {
								message = 'Server not responding';
							}

							window.pywebcmd.log('error', message);

							$(window.pywebcmd.ui.dialog.parent)
								.removeClass('loading')
								.addClass('loginerror');
						}
					});

					return false;
				});

		// document keypress
		$(document)
			.on('keydown', _documentKeydown);
	});

	/**
	 * Set selected side
	 * @param  {Object} obj block to select or it's child
	 * @return {Void}
	 */
	var _setSelection = function(obj) {
		$(false)
			.add(window.pywebcmd.ui.lblock)
			.add(window.pywebcmd.ui.rblock)
				.removeClass('selected');

		$(obj)
			.closest('.lblock,.rblock')
				.addClass('selected');

		_navenable();
	}

	/**
	 * Block click event
	 * @param  {Object} event
	 * @return {Void}
	 */
	var _selectBlock = function(event) {
		_setSelection(this);
	}

	/**
	 * JS sort compare function
	 * @param  {Numeric}  table
	 * @param  {String}   column
	 * @return {function}
	 */
	var _compareTableRows = function(table, column) {
		var cols  = $(table).find('td')
		var index = $(cols).index($(cols).filter('.' + column));

		return function(a, b) {
			var objA  = $(a).children('td').eq(index);
			var objB  = $(b).children('td').eq(index);
			var valA  = $(objA).attr('data-value');
			var valB  = $(objB).attr('data-value');
			if (valA === undefined) valA = $(objA).text();
			if (valB === undefined) valB = $(objB).text();

			var type = 'string';
			if (window.pywebcmd.columns.properties[column] !== undefined) {
				type = window.pywebcmd.columns.properties[column].type;
			}

			if (valA == valB) {
				var newColumnIndex = $(cols).index($(cols).filter('.basename'));

				if (newColumnIndex !== -1) {
					type = window.pywebcmd.columns.properties.basename.type;
					objA = $(a).children('td').eq(newColumnIndex);
					objB = $(b).children('td').eq(newColumnIndex);
					valA = $(objA).attr('data-value');
					valB = $(objB).attr('data-value');
					if (valA === undefined) valA = $(objA).text();
					if (valB === undefined) valB = $(objB).text();
				}
			}

			return (type == 'numeric' || type == 'time') && $.isNumeric(valA) && $.isNumeric(valB) ? valA * 1 - valB * 1 : valA.localeCompare(valB);
		}
	}

	/**
	 * Table head click even (sort table)
	 * @param  {Object} event
	 * @return {Void}
	 */
	var _sortTable = function(event) {
		_setSelection(this);

		if ($(this).hasClass('icon')) {
			return;
		}

		var head = $(this).closest('table');
		var body = $(false);
		var asc  = ! $(this).hasClass('asc');

		$(head)
			.find('td,th')
				.removeClass('asc')
				.removeClass('desc');

		if ($(head).is(window.pywebcmd.ui.lhead)) body = window.pywebcmd.ui.lbody;
		if ($(head).is(window.pywebcmd.ui.rhead)) body = window.pywebcmd.ui.rbody;

		if ($(body).length !== 0) {
			var column = $(this).attr('class');
			var rows   = $(body).find('tr:gt(1)').toArray().sort(_compareTableRows(body, column));

			$(this)
				.addClass(asc ? 'asc' : 'desc')
			if ( ! asc) {
				rows = rows.reverse();
			}

			for (var i = 0; i < rows.length; i++) {
				$(body).append(rows[i]);
			}
		}
	}

	/**
	 * Table row click event (highlight row)
	 * @param  {Object} event
	 * @return {Void}
	 */
	var _selectRow = function(event) {
		if (event.ctrlKey) {
			_setSelection(this);

			$(this)
				.toggleClass('highlight');

		}
		else {
			$(this)
				.closest('table')
					.find('tr')
						.removeClass('highlight');
			$(this)
				.addClass('highlight');
		}

		_navenable();
	}

	/**
	 * Show/hide preloader gif on block
	 * @param  {Object}  block
	 * @param  {Boolean} status
	 * @return {Void}
	 */
	var _preloader = function(block, status) {
		var input;
		if ($(block).is(window.pywebcmd.ui.lblock)) input = window.pywebcmd.ui.lpath;
		if ($(block).is(window.pywebcmd.ui.rblock)) input = window.pywebcmd.ui.rpath;

		$(block)
			.removeClass('loading')
			.addClass(status ? 'loading' : 'temp')
			.removeClass('temp');

		$(input)
			.prop('readonly', status);

		_navenable();
	}

	/**
	 * Append error message to log
	 * @param  {Object} jqXHR
	 * @return {Void}
	 */
	var _error = function(jqXHR) {
		var message = 'Unknown error';
		if (jqXHR && jqXHR.responseJSON && jqXHR.responseJSON.message) {
			message = jqXHR.responseJSON.message;
		}
		else if (jqXHR.status == 0) {
			message = 'Server not responding';
		}

		window.pywebcmd.log('error', message);

		if ($(window.pywebcmd.ui.dialog.error.title).data('pywebcmd-html')) $(window.pywebcmd.ui.dialog.error.title).text($(window.pywebcmd.ui.dialog.error.title).data('pywebcmd-html').replace('{message}', message));
		if ($(window.pywebcmd.ui.dialog.error.title).data('pywebcmd-title')) $(window.pywebcmd.ui.dialog.error.title).attr('title', $(window.pywebcmd.ui.dialog.error.title).data('pywebcmd-html').replace('{message}', message));
		if ($(window.pywebcmd.ui.dialog.error.message).data('pywebcmd-html')) $(window.pywebcmd.ui.dialog.error.message).text($(window.pywebcmd.ui.dialog.error.message).data('pywebcmd-html').replace('{message}', message));
		if ($(window.pywebcmd.ui.dialog.error.message).data('pywebcmd-title')) $(window.pywebcmd.ui.dialog.error.message).attr('title', $(window.pywebcmd.ui.dialog.error.title).data('pywebcmd-message').replace('{message}', message));

		$(window.pywebcmd.ui.dialog.parent)
			.removeClass('loading')
			.removeClass('login')
			.removeClass('fileinfo')
			.removeClass('progress')
			.removeClass('error')

		if (jqXHR.status == 401) {
			$(window.pywebcmd.ui.dialog.parent)
				.addClass('overlay')
				.addClass('login');
		}
		else {
			$(window.pywebcmd.ui.dialog.parent)
				.addClass('overlay')
				.addClass('error');
		}
	}

	/**
	 * Parse data from jqXHR and convert it to row (tr tag)
	 * @param  {Object} data
	 * @return {Object}
	 */
	var _lsParse = function(data) {
		var result = $(false);

		$.each(data, function(key, value) {
			var row = $('<tr />');
			if (value.isdir)  $(row).addClass('dir');
			if (value.isfile) $(row).addClass('file');
			if (value.islink) $(row).addClass('link');

			$.each(window.pywebcmd.columns.list, function(i, column) {
				var col = $('<td />')
					.attr('class', column)
					.appendTo(row);
				if (column == 'icon') {
					$(col)
						.html('<img src="/ico/16/' + value[column] + '" alt="' + value[column] + '" />');
				}
				else if (column == 'size') {
					$(col)
						.attr('data-value', value.isdir ? '-1' : value[column])
						.attr('title', window.pywebcmd.file.size(value[column]))
						.text(value.isdir ? '' : window.pywebcmd.file.size(value[column]));
				}
				else if (window.pywebcmd.columns.properties[column] && window.pywebcmd.columns.properties[column].type && window.pywebcmd.columns.properties[column].type == 'time') {
					$(col)
						.attr('data-value', value[column])
						.attr('title', window.pywebcmd.file.time(value[column]))
						.text(window.pywebcmd.file.time(value[column]).slice(0, -3));
				}
				else if (window.pywebcmd.columns.properties[column] && window.pywebcmd.columns.properties[column].type && window.pywebcmd.columns.properties[column].type == 'boolean') {
					$(col)
						.html('<input type="checkbox" value="" readonly="readonly"' + (value[column] ? ' checked="checked"' : '') + ' />');
				}
				else {
					$(col)
						.attr('title', value[column])
						.text(value[column]);
				}
			});

			result = $(result).add(row);
		});

		return result;
	}

	/**
	 * Append initial directory list to table(s)
	 * @param  {Object} jqXHR
	 * @param  {Object} textStatus
	 * @return {Void}
	 */
	var _initList = function(jqXHR, textStatus) {
		_preloader(window.pywebcmd.ui.lblock, false);
		_preloader(window.pywebcmd.ui.rblock, false);

		if (jqXHR.status != 200) {
			return _error(jqXHR);
		}

		window.pywebcmd.log('success', 'Collected ' + jqXHR.responseJSON.data.length + ' item(s) in \'' + jqXHR.responseJSON.source + '\' directory');

		$(window.pywebcmd.ui.lpath).attr('placeholder', jqXHR.responseJSON.source).val(jqXHR.responseJSON.source);
		$(window.pywebcmd.ui.rpath).attr('placeholder', jqXHR.responseJSON.source).val(jqXHR.responseJSON.source);

		$(window.pywebcmd.ui.lbody).empty();
		$(window.pywebcmd.ui.rbody).empty();

		var row = _lsParse(jqXHR.responseJSON.data);
		$(row).appendTo(window.pywebcmd.ui.lbody);
		$(row).clone().appendTo(window.pywebcmd.ui.rbody);
	}

	/**
	 * Table row dblclick event
	 * @param  {Object} event
	 * @return {Void}
	 */
	var _openRow = function(event) {
		if ( ! $(this).hasClass('dir')) {
			return;
		}

		var basename = $(this).find('td.basename').text();
		var block    = $(this).closest('.lblock,.rblock');
		var input    = $(block).find('.lpath,.rpath');
		var dirname  = $(input).attr('placeholder');

		_ls(dirname.replace(/\/+$/, '') + '/' + basename);
	}

	/**
	 * Document keydown event (select/deselect all, arrow move)
	 * @param  {Object} event
	 * @return {Void}
	 */
	var _documentKeydown = function(event) {
		if ($(':focus').length != 0) {
			return;
		}

		// to do: move selction with arrows

		if (((event.which == 97 || event.which == 65) && (event.ctrlKey)) || (event.which == 27)) {
			var table;
			if ($(window.pywebcmd.ui.lblock).hasClass('selected')) table = window.pywebcmd.ui.lbody;
			if ($(window.pywebcmd.ui.rblock).hasClass('selected')) table = window.pywebcmd.ui.rbody;

			if (table) {
				var row = $(table).find('tr')
					.removeClass('highlight');

				if (event.which != 27 && ! event.shiftKey) {
					$(row)
						.addClass('highlight');
				}

				_navenable();
			}

			return false;
		}
	}

	/**
	 * Path keydown event (open/cancel)
	 * @param  {Object} event
	 * @return {Void}
	 */
	var _pathKeydown = function(event) {
		if (event.which == 27) {
			if ($(this).get(0).selectionStart == 0 && $(this).get(0).selectionEnd == $(this).val().length) {
				$(this)
					.blur();
			}
			else {
				$(this)
					.blur()
					.focus()
					.select();
			}
		}
		else if (event.which == 13) {
			_ls($(this).val());
		}
	}

	/**
	 * Path blur event (cancel)
	 * @param  {Object} event
	 * @return {Void}
	 */
	var _pathBlur = function(event) {
		$(this).val($(this).attr('placeholder'));
	}

	/**
	 * Navigation buttons click
	 * @param  {Object} event
	 * @return {Void}
	 */
	var _navclick = function(event) {
		if ( ! $(this).parent().hasClass('disabled')) {
			if ($(this).is(window.pywebcmd.ui.nav.copy))       _cp('', '');
			if ($(this).is(window.pywebcmd.ui.nav.move))       _mv('', '');
			if ($(this).is(window.pywebcmd.ui.nav.rename))     _mv('', '');
			if ($(this).is(window.pywebcmd.ui.nav.delete))     _rm('');
			if ($(this).is(window.pywebcmd.ui.nav.newfile))    _nf('', '');
			if ($(this).is(window.pywebcmd.ui.nav.newdir))     _nd('', '');
			if ($(this).is(window.pywebcmd.ui.nav.download))   _dl('');
			if ($(this).is(window.pywebcmd.ui.nav.properties)) _pr('');
		}

		return false;
	}

	var _navenable = function() {
		var block = $(false)
			.add(window.pywebcmd.ui.lblock)
			.add(window.pywebcmd.ui.rblock);
		var block1 = $(block).filter('.selected').first();
		var block2 = $(block).not(block1).first();
		var rows   = $(block1).find('tr.highlight');

		var path1, path2;
		if ($(block1).is(window.pywebcmd.ui.lblock)) { path1 = window.pywebcmd.ui.lpath; path2 = window.pywebcmd.ui.rpath; }
		if ($(block1).is(window.pywebcmd.ui.rblock)) { path1 = window.pywebcmd.ui.rpath; path2 = window.pywebcmd.ui.lpath; }

		var cancopy = true
			&& ($(rows).length > 0)
			&& ($(rows).first().find('td.basename').text() != '.')
			&& ($(rows).first().find('td.basename').text() != '..')
			&& ($(path1).val() != $(path2).val());
		var canmove = cancopy
			&& ($(path2).val().toString().indexOf($(path1).val().toString()) != 0);
		var canrename = true
			&& $(rows).length == 1
			&& ($(rows).first().find('td.basename').text() != '.')
			&& ($(rows).first().find('td.basename').text() != '..');
		var candelete = true
			&& ($(rows).length > 0)
			&& ($(rows).first().find('td.basename').text() != '.')
			&& ($(rows).first().find('td.basename').text() != '..');
		var cannewfile = true;
		var cannewdir = true;
		var candownload = candelete
			|| ($(rows).length == 1 && $(rows).first().find('td.basename').text() == '.');
		var canproperties = candownload
			|| ($(rows).length == 1 && $(rows).first().find('td.basename').text() == '..');

		$(window.pywebcmd.ui.nav.copy).parent().removeClass('disabled').addClass(cancopy ? 'temp' : 'disabled').removeClass('temp');
		$(window.pywebcmd.ui.nav.move).parent().removeClass('disabled').addClass(canmove ? 'temp' : 'disabled').removeClass('temp');
		$(window.pywebcmd.ui.nav.rename).parent().removeClass('disabled').addClass(canrename ? 'temp' : 'disabled').removeClass('temp');
		$(window.pywebcmd.ui.nav.delete).parent().removeClass('disabled').addClass(candelete ? 'temp' : 'disabled').removeClass('temp');
		$(window.pywebcmd.ui.nav.newfile).parent().removeClass('disabled').addClass(cannewfile ? 'temp' : 'disabled').removeClass('temp');
		$(window.pywebcmd.ui.nav.newdir).parent().removeClass('disabled').addClass(cannewdir ? 'temp' : 'disabled').removeClass('temp');
		$(window.pywebcmd.ui.nav.download).parent().removeClass('disabled').addClass(candownload ? 'temp' : 'disabled').removeClass('temp');
		$(window.pywebcmd.ui.nav.properties).parent().removeClass('disabled').addClass(canproperties ? 'temp' : 'disabled').removeClass('temp');
	}

	/**
	 * LS request - append new directory list
	 * @param  {Object} block
	 * @param  {String} source
	 * @return {Void}
	 */
	var _ls = function(source) {
		var block = $(false);
		if ($(window.pywebcmd.ui.lblock).hasClass('selected')) block = window.pywebcmd.ui.lblock;
		if ($(window.pywebcmd.ui.rblock).hasClass('selected')) block = window.pywebcmd.ui.rblock;

		_preloader(block, true);

		var head, body, input;
		if ($(block).is(window.pywebcmd.ui.lblock)) head  = window.pywebcmd.ui.lhead;
		if ($(block).is(window.pywebcmd.ui.rblock)) head  = window.pywebcmd.ui.rhead;
		if ($(block).is(window.pywebcmd.ui.lblock)) body  = window.pywebcmd.ui.lbody;
		if ($(block).is(window.pywebcmd.ui.rblock)) body  = window.pywebcmd.ui.rbody;
		if ($(block).is(window.pywebcmd.ui.lblock)) input = window.pywebcmd.ui.lpath;
		if ($(block).is(window.pywebcmd.ui.rblock)) input = window.pywebcmd.ui.rpath;

		window.pywebcmd.log('command', 'Directory list \'' + source + '\'');
		window.pywebcmd.api.ls(source, function(jqXHR, textStatus) {
			_preloader(block, false);

			if (jqXHR.status != 200) {
				$(input)
					.val($(input).attr('placeholder'));

				return _error(jqXHR);
			}

			window.pywebcmd.log('success', 'Collected ' + jqXHR.responseJSON.data.length + ' item(s) in \'' + jqXHR.responseJSON.source + '\' directory');

			$(input)
				.attr('placeholder', jqXHR.responseJSON.source)
				.val(jqXHR.responseJSON.source);
			$(body)
				.empty();

			var row = _lsParse(jqXHR.responseJSON.data);
			$(row).appendTo(body);

			var sort = $(head).find('td,th').filter('.asc,.desc').first();
			var asc  = !! $(sort).hasClass('asc');
			$(sort)
				.removeClass('asc')
				.removeClass('desc')
				.addClass(asc ? 'desc' : 'asc')
				.click();
		});
	}

	/**
	 * CP request - copy source to destination
	 * @param  {String} source
	 * @param  {String} destination
	 * @return {Void}
	 */
	var _cp = function(source, destination) {
		var block = $(false)
			.add(window.pywebcmd.ui.lblock)
			.add(window.pywebcmd.ui.rblock);

		_preloader(block, true);
		window.pywebcmd.log('command', 'Copying \'' + source + '\' to \'' + destination + '\'');
		window.pywebcmd.api.cp('', '', function(jqXHR, textStatus) {
			_preloader(block, false);

			if (jqXHR.status != 200) {
				return _error(jqXHR);
			}

			window.pywebcmd.log('success', 'Some success message');
			// ls?
		});
	}

	/**
	 * MV request - move source to destination
	 * @param  {String} source
	 * @param  {String} destination
	 * @return {Void}
	 */
	var _mv = function(source, destination) {
		var block = $(false)
			.add(window.pywebcmd.ui.lblock)
			.add(window.pywebcmd.ui.rblock);
		var input = $(false)
			.add(window.pywebcmd.ui.lpath)
			.add(window.pywebcmd.ui.rpath);

		_preloader(block, true);
		window.pywebcmd.log('command', 'Moving \'' + source + '\' to \'' + destination + '\'');
		window.pywebcmd.api.mv('', '', function(jqXHR, textStatus) {
			_preloader(block, false);

			if (jqXHR.status != 200) {
				$(input)
					.val($(input).attr('placeholder'));

				return _error(jqXHR);
			}

			window.pywebcmd.log('success', 'Some success message');
			// ls?
		});
	}

	/**
	 * RM request - remove source
	 * @param  {String} source
	 * @return {Void}
	 */
	var _rm = function(source) {
		var block = $(false);
		if ($(window.pywebcmd.ui.lblock).hasClass('selected')) block = window.pywebcmd.ui.lblock;
		if ($(window.pywebcmd.ui.rblock).hasClass('selected')) block = window.pywebcmd.ui.rblock;

		_preloader(block, true);

		window.pywebcmd.log('command', 'Removing \'' + source + '\'');
		window.pywebcmd.api.rm('', function(jqXHR, textStatus) {
			_preloader(block, false);

			if (jqXHR.status != 200) {
				return _error(jqXHR);
			}

			window.pywebcmd.log('success', 'Some success message');
			// ls?
		});
	}

	/**
	 * NF request - create new file in source directory
	 * @param  {String} source
	 * @param  {String} filename
	 * @return {Void}
	 */
	var _nf = function(source, filename) {
		var block = $(false);
		if ($(window.pywebcmd.ui.lblock).hasClass('selected')) block = window.pywebcmd.ui.lblock;
		if ($(window.pywebcmd.ui.rblock).hasClass('selected')) block = window.pywebcmd.ui.rblock;

		_preloader(block, true);

		window.pywebcmd.log('command', 'Creating file \'' + source + '/' + filename + '\'');
		window.pywebcmd.api.nf('', function(jqXHR, textStatus) {
			_preloader(block, false);

			if (jqXHR.status != 200) {
				return _error(jqXHR);
			}

			window.pywebcmd.log('success', 'Some success message');
			// ls?
		});
	}

	/**
	 * ND request - create new directory in source directory
	 * @param  {String} source
	 * @param  {String} dirname
	 * @return {Void}
	 */
	var _nd = function(source, dirname) {
		var block = $(false);
		if ($(window.pywebcmd.ui.lblock).hasClass('selected')) block = window.pywebcmd.ui.lblock;
		if ($(window.pywebcmd.ui.rblock).hasClass('selected')) block = window.pywebcmd.ui.rblock;

		_preloader(block, true);

		window.pywebcmd.log('command', 'Creating directory \'' + source + '/' + dirname + '\'');
		window.pywebcmd.api.nd('', function(jqXHR, textStatus) {
			_preloader(block, false);

			if (jqXHR.status != 200) {
				return _error(jqXHR);
			}

			window.pywebcmd.log('success', 'Some success message');
			// ls?
		});
	}

	/**
	 * DL request - download source
	 * @param  {String} source
	 * @return {Void}
	 */
	var _dl = function(source) {
		var block = $(false);
		if ($(window.pywebcmd.ui.lblock).hasClass('selected')) block = window.pywebcmd.ui.lblock;
		if ($(window.pywebcmd.ui.rblock).hasClass('selected')) block = window.pywebcmd.ui.rblock;

		_preloader(block, true);

		window.pywebcmd.log('command', 'Downloading \'' + source + '\'');
		window.pywebcmd.api.dl('', function(jqXHR, textStatus) {
			_preloader(block, false);

			if (jqXHR.status != 200) {
				return _error(jqXHR);
			}

			window.pywebcmd.log('success', 'Some success message');
			// ls?
		});
	}

	/**
	 * PR request - properties/info
	 * @param  {String} source
	 * @return {Void}
	 */
	var _pr = function(source) {
		$(window.pywebcmd.ui.dialog.parent)
			.removeClass('loading')
			.removeClass('fileinfo')
			.removeClass('progress')
			.removeClass('error')
			.addClass('loading')
			.addClass('fileinfo');

		var block = $(false);
		if ($(window.pywebcmd.ui.lblock).hasClass('selected')) block = window.pywebcmd.ui.lblock;
		if ($(window.pywebcmd.ui.rblock).hasClass('selected')) block = window.pywebcmd.ui.rblock;

		_preloader(block, true);

		window.pywebcmd.log('command', 'Properties of \'' + source + '\'');
		window.pywebcmd.api.pr('', function(jqXHR, textStatus) {
			_preloader(block, false);

			if (jqXHR.status != 200) {
				return _error(jqXHR);
			}

			window.pywebcmd.log('success', 'Some success message');
			// ls?
		});
	}

})(jQuery);
