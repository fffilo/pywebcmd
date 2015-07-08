;(function($) {

	// bind events on document ready
	$(document).ready(function(event) {
		$(false)
			.add(window.pywebcmd.ui.dialog.fileinfo.ok)
			.add(window.pywebcmd.ui.dialog.fileinfo.cancel)
			.add(window.pywebcmd.ui.dialog.progress.ok)
			.add(window.pywebcmd.ui.dialog.progress.cancel)
			.add(window.pywebcmd.ui.dialog.error.ok)
			.add(window.pywebcmd.ui.dialog.error.cancel)
				.on('click', _click);
	});

	/**
	 * Login button click
	 * @param  {Object}  event
	 * @return {Boolean}
	 */
	var _click = function(event) {
		$(window.pywebcmd.ui.dialog.parent)
			.removeClass('overlay')
			.removeClass('loading')
			.removeClass('loginerror')
			.removeClass('login')
			.removeClass('fileinfo')
			.removeClass('progress')
			.removeClass('error');

		return false;
	}

})(jQuery);
