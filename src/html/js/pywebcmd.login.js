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

		window.pywebcmd.api.login(source, CryptoJS.SHA512(destination).toString(), _callback);

		return false;
	}

	/**
	 * Login request callback
	 * @param  {Object}  jqXHR
	 * @return {Boolean}
	 */
	var _callback = function(jqXHR) {
		if (jqXHR.status == 200) {
			window.pywebcmd.methods.log('success', jqXHR.responseJSON.message);

			$(window.pywebcmd.ui.dialog.parent)
				.removeClass('overlay')
				.removeClass('loading')
				.removeClass('loginerror')
				.removeClass('login');

			window.pywebcmd.methods.lsInit();
		}
		else {
			window.pywebcmd.methods.error(jqXHR);

			$(window.pywebcmd.ui.dialog.parent)
				.addClass('loginerror');
		}
	}

})(jQuery);
