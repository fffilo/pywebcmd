;(function($) {

	// bind events on document ready
	$(document).ready(function(event) {
		$(window.pywebcmd.ui.nav.parent)
			.on('click', 'a', _click);
	});

	/**
	 * Navigation buttons click
	 * @param  {Object} event
	 * @return {Void}
	 */
	var _click = function(event) {
		if ( ! $(this).parent().hasClass('disabled')) {
			if ($(this).is(window.pywebcmd.ui.nav.copy))       window.pywebcmd.methods.cp('', '');
			if ($(this).is(window.pywebcmd.ui.nav.move))       window.pywebcmd.methods.mv('', '');
			if ($(this).is(window.pywebcmd.ui.nav.rename))     window.pywebcmd.methods.mv('', '');
			if ($(this).is(window.pywebcmd.ui.nav.delete))     window.pywebcmd.methods.rm('');
			if ($(this).is(window.pywebcmd.ui.nav.newfile))    window.pywebcmd.methods.nf('', '');
			if ($(this).is(window.pywebcmd.ui.nav.newdir))     window.pywebcmd.methods.nd('', '');
			if ($(this).is(window.pywebcmd.ui.nav.download))   window.pywebcmd.methods.dl('');
			if ($(this).is(window.pywebcmd.ui.nav.properties)) _pr.call(this, event);
		}

		return false;
	}

	/**
	 * PR api request
	 * @param  {Object} event
	 * @return {Void}
	 */
	var _pr = function(event) {
		var block = $(false);
		if ($(window.pywebcmd.ui.lblock).hasClass('selected')) block = window.pywebcmd.ui.lblock;
		if ($(window.pywebcmd.ui.rblock).hasClass('selected')) block = window.pywebcmd.ui.rblock;

		var input, rows;
		if ($(block).is(window.pywebcmd.ui.lblock)) input = $(input).add(window.pywebcmd.ui.lpath);
		if ($(block).is(window.pywebcmd.ui.rblock)) input = $(input).add(window.pywebcmd.ui.rpath);
		if ($(block).is(window.pywebcmd.ui.lblock)) rows  = $(window.pywebcmd.ui.lbody).find('tr.highlight');
		if ($(block).is(window.pywebcmd.ui.rblock)) rows  = $(window.pywebcmd.ui.rbody).find('tr.highlight');

		var dir = $(input).val().toString();
		if (dir == '/') {
			dir = '';
		}

		var source = [];
		$(rows).each(function(key, value) {
			source.push(dir + '/' + $(this).find('td.basename').text());
		});

		window.pywebcmd.methods.pr(source);
	}

})(jQuery);
