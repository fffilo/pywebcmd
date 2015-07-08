;(function($) {

	// bind events on document ready
	$(document).ready(function(event) {
		$(false)
			.add(window.pywebcmd.ui.lhead)
			.add(window.pywebcmd.ui.rhead)
				.on('click', 'th,td', _sortTable)
					.find('th,td')
						.filter('.basename')
							.click();
	});

	/**
	 * Table head click even (sort table)
	 * @param  {Object} event
	 * @return {Void}
	 */
	var _sortTable = function(event) {
		window.pywebcmd.methods.selection(this);

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

})(jQuery);
