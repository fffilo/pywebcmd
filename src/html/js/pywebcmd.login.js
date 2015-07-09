;(function($) {

	// bind events on document ready
	$(document).ready(function(event) {
		$(false)
			.add(window.pywebcmd.ui.dialog.login.username)
			.add(window.pywebcmd.ui.dialog.login.password)
				.on('keypress', _keypress);

		$(false)
			.add(window.pywebcmd.ui.dialog.login.ok)
			.add(window.pywebcmd.ui.dialog.login.cancel)
				.on('click', _click);
	});

	/**
	 * Login keypress event
	 * @param  {Object}  event
	 * @return {Boolean}
	 */
	var _keypress = function(event) {
		if (event.which == 13) {
			$(window.pywebcmd.ui.dialog.login.ok).click();
		}
	}

	/**
	 * Login button click
	 * @param  {Object}  event
	 * @return {Boolean}
	 */
	var _click = function(event) {
		window.pywebcmd.methods.log('command', 'Login request');

		$(window.pywebcmd.ui.dialog.parent)
			.removeClass('loading')
			.removeClass('loginerror')
			.removeClass('fileinfo')
			.removeClass('progress')
			.removeClass('error')
			.addClass('loading');

		var source = $(window.pywebcmd.ui.dialog.login.username).val().toString();
		var destination = $(window.pywebcmd.ui.dialog.login.password).val().toString();
		destination = CryptoJS.SHA512(destination).toString();

		window.pywebcmd.api.login(source, destination);

		return false;
	}

})(jQuery);
