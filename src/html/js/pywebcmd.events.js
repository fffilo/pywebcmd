;(function($) {

	// bind events on document ready
	$(document).ready(function(event) {
		// select block
		$(false)
			.add(window.pywebcmd.ui.lblock)
			.add(window.pywebcmd.ui.rblock)
				.on('click', _selectBlock);

		// sort table
		$(false)
			.add(window.pywebcmd.ui.lhead)
			.add(window.pywebcmd.ui.rhead)
				.on('click', 'th,td', _sortTable)
					.find('th,td')
						.filter('.basename')
							.click();
		$(window.pywebcmd.ui.lblock)
			.click();

		// select/deselect row
		$(false)
			.add(window.pywebcmd.ui.lbody)
			.add(window.pywebcmd.ui.rbody)
				.on('click', 'tr', _selectRow);

		// open row (file/directory)
		$(window.pywebcmd.ui.tbody).on('click', 'tr', _openRow);

		// document keypress
		$(document).on('keypress', _keypress);
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
		var type = 'string';
		if (window.pywebcmd.columns[column] !== undefined) {
			window.pywebcmd.columns[column].type;
		}

		var cols  = $(table).find('td')
		var index = $(cols).index($(cols).filter('.' + column));

		return function(a, b) {
			var objA  = $(a).children('td').eq(index);
			var objB  = $(b).children('td').eq(index);
			var valA  = $(objA).attr('data-value');
			var valB  = $(objB).attr('data-value');
			if (valA === undefined) valA = $(objA).text();
			if (valB === undefined) valB = $(objB).text();

			if (valA == valB) {
				var newColumnIndex = $(cols).index($(cols).filter('.basename'));

				if (newColumnIndex !== -1) {
					type = window.pywebcmd.columns.basename.type;
					objA = $(a).children('td').eq(newColumnIndex);
					objB = $(b).children('td').eq(newColumnIndex);
					valA = $(objA).attr('data-value');
					valB = $(objB).attr('data-value');
					if (valA === undefined) valA = $(objA).text();
					if (valB === undefined) valB = $(objB).text();
				}
			}

			return type == 'numeric' && $.isNumeric(valA) && $.isNumeric(valB) ? valA * 1 - valB * 1 : valA.localeCompare(valB);
		}
	}

	/**
	 * Table head click even (sort table)
	 * @param  {Object} event
	 * @return {Void}
	 */
	var _sortTable = function(event) {
		$(this).blur();

		_setSelection(this);

		var head   = $(this).closest('table');
		var body   = $(false);
		var asc    = ! $(this).hasClass('asc');

		$(head)
			.find('td,th')
				.removeClass('asc')
				.removeClass('desc');

		if ($(head).is(window.pywebcmd.ui.lhead)) body = window.pywebcmd.ui.lbody;
		if ($(head).is(window.pywebcmd.ui.rhead)) body = window.pywebcmd.ui.rbody;

		if ($(body).length !== 0) {
			var column = $(this).attr('class');
			var rows   = $(body).find('tr:gt(0)').toArray().sort(_compareTableRows(body, column));

			$(this)
				.addClass(asc ? 'asc' : 'desc')
			if ( ! asc) {
				rows = rows.reverse();
			}

			for (var i = 0; i < rows.length; i++) {
				$(body).append(rows[i]);
			}
		}

		return false;
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
	 * Table row dblclick event (enter directory, download file)
	 * @param  {Object} event
	 * @return {Void}
	 */
	var _openRow = function(event) {

	}

	/**
	 * Document keypress event (select/deselect all, arrow move)
	 * @param  {Object} event
	 * @return {Void}
	 */
	var _keypress = function(event) {
		// to do: move selction with arrows

		if (event.key.toLowerCase() == 'a' && event.ctrlKey) {
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
