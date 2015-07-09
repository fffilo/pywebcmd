;(function($) {

	// bind events on document ready
	$(document).ready(function(event) {
		$(false)
			.add(window.pywebcmd.ui.lblock)
			.add(window.pywebcmd.ui.rblock)
				.on('click', _bclick)
				.filter(window.pywebcmd.ui.lblock)
					.click();

		$(false)
			.add(window.pywebcmd.ui.lbody)
			.add(window.pywebcmd.ui.rbody)
				.on('click', 'tr', _tclick);

		$(document)
			.on('keydown', _keydown);
	});

	var _count = function() {
		var rows = $(false);
		if ($(window.pywebcmd.ui.lblock).hasClass('selected')) rows = $(window.pywebcmd.ui.lbody).find('tr.highlight');
		if ($(window.pywebcmd.ui.rblock).hasClass('selected')) rows = $(window.pywebcmd.ui.rbody).find('tr.highlight');

		$(window.pywebcmd.ui.dialog.parent)
			.removeClass('select-none')
			.removeClass('select-file')
			.removeClass('select-dir')
			.removeClass('select-link')
			.removeClass('select-multiple');

		if (rows.length == 0) {
			$(window.pywebcmd.ui.dialog.parent).addClass('select-none');
		}
		else if (rows.length == 1) {
			if ($(rows).hasClass('file')) $(window.pywebcmd.ui.dialog.parent).addClass('select-file');
			if ($(rows).hasClass('dir'))  $(window.pywebcmd.ui.dialog.parent).addClass('select-dir');
			if ($(rows).hasClass('link')) $(window.pywebcmd.ui.dialog.parent).addClass('select-link');
		}
		else {
			$(window.pywebcmd.ui.dialog.parent).addClass('select-multiple');
		}
	}

	/**
	 * Block click event
	 * @param  {Object} event
	 * @return {Void}
	 */
	var _bclick = function(event) {
		window.pywebcmd.methods.selection(this);
		_count();
	}

	/**
	 * Table row click event (highlight row)
	 * @param  {Object} event
	 * @return {Void}
	 */
	var _tclick = function(event) {
		if (event.ctrlKey) {
			window.pywebcmd.methods.selection(this);

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

		_count();

		window.pywebcmd.methods.nav();
	}

	/**
	 * Document keydown event (select/deselect all, arrow move)
	 * @param  {Object} event
	 * @return {Void}
	 */
	var _keydown = function(event) {
		if ($(':focus').length != 0) {
			return;
		}
		if ($(window.pywebcmd.ui.dialog.parent).hasClass('overlay')) {
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
						.not(':lt(2)')
						.addClass('highlight');
				}

				_count();

				window.pywebcmd.methods.nav();
			}

			return false;
		}
	}

})(jQuery);
