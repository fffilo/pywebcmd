;(function($) {

	/**
	 * Python web commander
	 * @type {Object}
	 */
	window.pywebcmd = window.pywebcmd || {};

	/**
	 * UI elements
	 * @type {Object}
	 */
	window.pywebcmd.ui = {}

	// init all UI elements
	$(document).ready(function(event) {
		window.pywebcmd.ui.log    = $('.log');
		window.pywebcmd.ui.nav    = $('.nav');
		window.pywebcmd.ui.lblock = $('.lblock');
		window.pywebcmd.ui.lpath  = $('.lpath');
		window.pywebcmd.ui.lhead  = $('.lhead');
		window.pywebcmd.ui.lbody  = $('.lbody');
		window.pywebcmd.ui.rblock = $('.rblock');
		window.pywebcmd.ui.rpath  = $('.rpath');
		window.pywebcmd.ui.rhead  = $('.rhead');
		window.pywebcmd.ui.rbody  = $('.rbody');
	});

})(jQuery);
