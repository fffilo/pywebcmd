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

		$(document)
			.on('keydown', _keydown);
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

		$(':focus')
			.blur();

		return false;
	}

	/**
	 * Document keypress event
	 * @param  {Object}  event
	 * @return {Void}
	 */
	var _keydown = function(event) {
		if (event.which != 27) {
			return;
		}

		if ($(window.pywebcmd.ui.dialog.parent).hasClass('error'))    $(window.pywebcmd.ui.dialog.error.cancel).click();
		if ($(window.pywebcmd.ui.dialog.parent).hasClass('fileinfo')) $(window.pywebcmd.ui.dialog.fileinfo.cancel).click();
		if ($(window.pywebcmd.ui.dialog.parent).hasClass('progress')) $(window.pywebcmd.ui.dialog.progress.cancel).click();
	}

})(jQuery);
