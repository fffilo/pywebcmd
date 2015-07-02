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
		window.pywebcmd.ui.nav        = $('.nav');
		window.pywebcmd.ui.copy       = $(window.pywebcmd.ui.nav).find('.copy').find('a').first();
		window.pywebcmd.ui.move       = $(window.pywebcmd.ui.nav).find('.move').find('a').first();
		window.pywebcmd.ui.rename     = $(window.pywebcmd.ui.nav).find('.rename').find('a').first();
		window.pywebcmd.ui.delete     = $(window.pywebcmd.ui.nav).find('.delete').find('a').first();
		window.pywebcmd.ui.newfile    = $(window.pywebcmd.ui.nav).find('.newfile').find('a').first();
		window.pywebcmd.ui.newdir     = $(window.pywebcmd.ui.nav).find('.newdir').find('a').first();
		window.pywebcmd.ui.download   = $(window.pywebcmd.ui.nav).find('.download').find('a').first();
		window.pywebcmd.ui.properties = $(window.pywebcmd.ui.nav).find('.properties').find('a').first();

		window.pywebcmd.ui.lblock     = $('.lblock');
		window.pywebcmd.ui.lpath      = $('.lpath');
		window.pywebcmd.ui.lhead      = $('.lhead');
		window.pywebcmd.ui.lbody      = $('.lbody');
		window.pywebcmd.ui.rblock     = $('.rblock');
		window.pywebcmd.ui.rpath      = $('.rpath');
		window.pywebcmd.ui.rhead      = $('.rhead');
		window.pywebcmd.ui.rbody      = $('.rbody');

		window.pywebcmd.ui.log        = $('.log');
	});

})(jQuery);
