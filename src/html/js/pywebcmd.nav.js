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
			if ($(this).is(window.pywebcmd.ui.nav.properties)) window.pywebcmd.methods.pr('');
		}

		return false;
	}

})(jQuery);
