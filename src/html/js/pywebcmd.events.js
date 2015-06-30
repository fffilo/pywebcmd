;(function($) {

	// bind events on document ready
	$(document).ready(function(event) {
		// show directories list
		window.pywebcmd.log('command', 'Initial directory list')
		window.pywebcmd.api.ls('/home/fffilo', _initList);

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

		// document keypress
		$(document).on('keydown', _keydown);
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

			return false;
		}
		else {
			$(this)
				.closest('table')
					.find('tr')
						.removeClass('highlight');
			$(this)
				.addClass('highlight');
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
		if (jqXHR.status != 200) {
			window.pywebcmd.log('error', jqXHR.responseJSON.message);
			return;
		}

		window.pywebcmd.log('success', 'Collected ' + jqXHR.responseJSON.data.length + ' item(s) (' + jqXHR.responseJSON.message + ')');

		$(window.pywebcmd.ui.lpath).val(jqXHR.responseJSON.source);
		$(window.pywebcmd.ui.rpath).val(jqXHR.responseJSON.source);

		$(window.pywebcmd.ui.lbody).empty();
		$(window.pywebcmd.ui.rbody).empty();

		var row = _lsParse(jqXHR.responseJSON.data);
		$(row).appendTo(window.pywebcmd.ui.lbody);
		$(row).clone().appendTo(window.pywebcmd.ui.rbody);
	}

	/**
	 * Table row dblclick event (enter directory, download file)
	 * @param  {Object} event
	 * @return {Void}
	 */
	var _openRow = function(event) {
		if ( ! $(this).hasClass('dir')) {
			return;
		}

		var table    = $(this).closest('table');
		var basename = $(this).find('td.basename').text();
		var input;
		if ($(table).is(window.pywebcmd.ui.lbody)) input = window.pywebcmd.ui.lpath;
		if ($(table).is(window.pywebcmd.ui.rbody)) input = window.pywebcmd.ui.rpath;

		if (input) {
			var path = $(input).val();
			path += path.toString().length >= 1 && path.substr(-1) == '/' ? '' : '/';
			path += basename;

			window.pywebcmd.log('command', 'Directory list ' + path)
			window.pywebcmd.api.ls(path, function(jqXHR, textStatus) {
				if (jqXHR.status != 200) {
					window.pywebcmd.log('error', jqXHR.responseJSON.message);
					return;
				}

				window.pywebcmd.log('success', 'Collected ' + jqXHR.responseJSON.data.length + ' item(s) (' + jqXHR.responseJSON.message + ')');

				$(input).val(jqXHR.responseJSON.source);
				$(table).empty();

				var row = _lsParse(jqXHR.responseJSON.data);
				$(row).appendTo(table);

				// sort
			});
		}
	}

	/**
	 * Document keydown event (select/deselect all, arrow move)
	 * @param  {Object} event
	 * @return {Void}
	 */
	var _keydown = function(event) {
		// to do: move selction with arrows

		if ((event.which == 97 || event.which == 65) && (event.ctrlKey)) {
			var table;
			if ($(window.pywebcmd.ui.lblock).hasClass('selected')) table = window.pywebcmd.ui.lbody;
			if ($(window.pywebcmd.ui.rblock).hasClass('selected')) table = window.pywebcmd.ui.rbody;

			if (table) {
				var row = $(table).find('tr')
					.removeClass('highlight');

				if ( ! event.shiftKey) {
					$(row)
						.addClass('highlight');
				}
			}

			return false;
		}
	}

})(jQuery);
