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

	/**
	 * Block click event
	 * @param  {Object} event
	 * @return {Void}
	 */
	var _bclick = function(event) {
		window.pywebcmd.methods.selection(this);
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

				window.pywebcmd.methods.nav();
			}

			return false;
		}
	}

})(jQuery);
