;(function($) {

	// bind events on document ready
	$(document).ready(function(event) {
		$(false)
			.add(window.pywebcmd.ui.lbody)
			.add(window.pywebcmd.ui.rbody)
				.on('dblclick', 'tr', _dblclick);

		// change path
		$(false)
			.add(window.pywebcmd.ui.lpath)
			.add(window.pywebcmd.ui.rpath)
				.on('keydown', _keydown)
				.on('blur', _blur);
	});

	/**
	 * Table row dblclick event
	 * @param  {Object} event
	 * @return {Void}
	 */
	var _dblclick = function(event) {
		if ( ! $(this).hasClass('dir')) {
			return;
		}

		var basename = $(this).find('td.basename').text();
		var block    = $(this).closest('.lblock,.rblock');
		var input    = $(block).find('.lpath,.rpath');
		var dirname  = $(input).attr('placeholder');

		window.pywebcmd.methods.ls(dirname.replace(/\/+$/, '') + '/' + basename);
	}

	/**
	 * Path keydown event (open/cancel)
	 * @param  {Object} event
	 * @return {Void}
	 */
	var _keydown = function(event) {
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
			window.pywebcmd.methods.ls($(this).val());
		}
	}

	/**
	 * Path blur event (cancel)
	 * @param  {Object} event
	 * @return {Void}
	 */
	var _blur = function(event) {
		$(this).val($(this).attr('placeholder'));
	}

})(jQuery);
