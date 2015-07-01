;(function($) {

	/**
	 * Python web commander
	 * @type {Object}
	 */
	window.pywebcmd = window.pywebcmd || {};

	/**
	 * Number of log messages to keep
	 * @type {Number}
	 */
	var _cacheSize = 10;

	/**
	 * Append log
	 * @param  {String} type
	 * @param  {String} text
	 * @return {Void}
	 */
	window.pywebcmd.log = function(type, text) {
		var html = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
		html += (new Array(10 - html.length).join('&nbsp;'));
		html += window.pywebcmd.file.time(new Date().getTime() / 1000);
		html += '&nbsp;&nbsp;';

		$('<p />')
			.attr('class', type)
			.attr('title', text)
			.html(html)
			.append(text)
			.appendTo(window.pywebcmd.ui.log);

		var log = $(window.pywebcmd.ui.log).children('p');
		var len = log.length;
		if (len > _cacheSize) {
			$(log).filter(':lt(' + (len - _cacheSize) + ')').remove();
		}

		var scroll = $(window.pywebcmd.ui.log).prop('scrollHeight');
		$(window.pywebcmd.ui.log).scrollTop(scroll);
	}

})(jQuery);
