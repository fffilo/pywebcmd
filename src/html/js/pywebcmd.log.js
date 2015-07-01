;(function($) {

	/**
	 * Python web commander
	 * @type {Object}
	 */
	window.pywebcmd = window.pywebcmd || {};

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
			.html(html)
			.append(text)
			.appendTo(window.pywebcmd.ui.log);

		var log = $(window.pywebcmd.ui.log).children('p');
		var len = log.length;
		var max = 10;
		if (len > max) {
			$(log).filter(':lt(' + (len - max) + ')').remove();
		}

		var scroll = $(window.pywebcmd.ui.log).prop('scrollHeight');
		$(window.pywebcmd.ui.log).scrollTop(scroll);
	}

})(jQuery);
