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
		var count;
		if ($(window.pywebcmd.ui.lblock).hasClass('selected')) count = $(window.pywebcmd.ui.lbody).find('tr.highlight').length;
		if ($(window.pywebcmd.ui.rblock).hasClass('selected')) count = $(window.pywebcmd.ui.rbody).find('tr.highlight').length;

		$(window.pywebcmd.ui.dialog.parent)
			.removeClass('count-zero')
			.removeClass('count-one')
			.removeClass('count-more');

		if (false) {}
		else if (count === undefined) {}
		else if (count == 0)          { $(window.pywebcmd.ui.dialog.parent).addClass('count-zero'); }
		else if (count == 1)          { $(window.pywebcmd.ui.dialog.parent).addClass('count-one');  }
		else                          { $(window.pywebcmd.ui.dialog.parent).addClass('count-more'); }
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

				_count();

				window.pywebcmd.methods.nav();
			}

			return false;
		}
	}

})(jQuery);
