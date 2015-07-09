;(function($) {

	window.pywebcmd          = window.pywebcmd          || {};
	window.pywebcmd.callback = window.pywebcmd.callback || {};

	/**
	 * LOGIN request callback
	 * @param  {Object} jqXHR
	 * @param  {String} textStatus
	 * @return {Void}
	 */
	window.pywebcmd.callback.login = function(jqXHR, textStatus) {
		if (jqXHR.status == 200) {
			window.pywebcmd.methods.log('success', jqXHR.responseJSON.message);

			$(window.pywebcmd.ui.dialog.parent)
				.removeClass('overlay')
				.removeClass('loading')
				.removeClass('loginerror')
				.removeClass('login');

			window.pywebcmd.methods.ls();
		}
		else {
			window.pywebcmd.methods.error(jqXHR);

			$(window.pywebcmd.ui.dialog.parent)
				.addClass('loginerror');
		}
	}

	/**
	 * LS request callback
	 * @param  {Object} jqXHR
	 * @param  {String} textStatus
	 * @return {Void}
	 */
	window.pywebcmd.callback.ls = function(jqXHR, textStatus) {
		var data = JSON.parse(this.data);

		var block = $(false);
		if ($(window.pywebcmd.ui.lblock).hasClass('selected')) block = window.pywebcmd.ui.lblock;
		if ($(window.pywebcmd.ui.rblock).hasClass('selected')) block = window.pywebcmd.ui.rblock;
		if (data.source === undefined) {
			block = $(block)
				.add(window.pywebcmd.ui.lblock)
				.add(window.pywebcmd.ui.rblock);
		}

		var head, body, input;
		if ($(block).is(window.pywebcmd.ui.lblock)) head  = $(head).add(window.pywebcmd.ui.lhead);
		if ($(block).is(window.pywebcmd.ui.rblock)) head  = $(head).add(window.pywebcmd.ui.rhead);
		if ($(block).is(window.pywebcmd.ui.lblock)) body  = $(body).add(window.pywebcmd.ui.lbody);
		if ($(block).is(window.pywebcmd.ui.rblock)) body  = $(body).add(window.pywebcmd.ui.rbody);
		if ($(block).is(window.pywebcmd.ui.lblock)) input = $(input).add(window.pywebcmd.ui.lpath);
		if ($(block).is(window.pywebcmd.ui.rblock)) input = $(input).add(window.pywebcmd.ui.rpath);

		window.pywebcmd.methods.preloader(block, false);

		if (jqXHR.status != 200) {
			$(input)
				.val($(input).attr('placeholder'));

			return window.pywebcmd.methods.error(jqXHR);
		}

		window.pywebcmd.methods.log('success', 'Collected ' + jqXHR.responseJSON.data.length + ' item(s) in \'' + jqXHR.responseJSON.source + '\' directory');

		$(input)
			.attr('placeholder', jqXHR.responseJSON.source)
			.val(jqXHR.responseJSON.source);

		var row = window.pywebcmd.methods.parse(jqXHR.responseJSON.data);
		$(body)
			.empty()
			.append(row);

		$(head).each(function(key, value) {
			var sort = $(value).find('td,th').filter('.asc,.desc').first();
			var asc  = !! $(sort).hasClass('asc');
			$(sort)
				.removeClass('asc')
				.removeClass('desc')
				.addClass(asc ? 'desc' : 'asc')
				.click();
		});
	}

	/**
	 * CP request callback
	 * @param  {Object} jqXHR
	 * @param  {String} textStatus
	 * @return {Void}
	 */
	window.pywebcmd.callback.cp = function(jqXHR, textStatus) {
		var block = $(false)
			.add(window.pywebcmd.ui.lblock)
			.add(window.pywebcmd.ui.rblock);

		window.pywebcmd.methods.preloader(block, false);

		if (jqXHR.status != 200) {
			return window.pywebcmd.methods.error(jqXHR);
		}

		window.pywebcmd.methods.log('success', 'Some success message');

		// ls?
	}

	/**
	 * MV request callback
	 * @param  {Object} jqXHR
	 * @param  {String} textStatus
	 * @return {Void}
	 */
	window.pywebcmd.callback.mv = function(jqXHR, textStatus) {
		var block = $(false)
			.add(window.pywebcmd.ui.lblock)
			.add(window.pywebcmd.ui.rblock);

		window.pywebcmd.methods.preloader(block, false);

		if (jqXHR.status != 200) {
			return window.pywebcmd.methods.error(jqXHR);
		}

		window.pywebcmd.methods.log('success', 'Some success message');

		// ls?
	}

	/**
	 * RM request callback
	 * @param  {Object} jqXHR
	 * @param  {String} textStatus
	 * @return {Void}
	 */
	window.pywebcmd.callback.rm = function(jqXHR, textStatus) {
		var block = $(false);
		if ($(window.pywebcmd.ui.lblock).hasClass('selected')) block = window.pywebcmd.ui.lblock;
		if ($(window.pywebcmd.ui.rblock).hasClass('selected')) block = window.pywebcmd.ui.rblock;

		window.pywebcmd.methods.preloader(block, false);

		if (jqXHR.status != 200) {
			return window.pywebcmd.methods.error(jqXHR);
		}

		window.pywebcmd.methods.log('success', 'Some success message');

		// ls?
	}

	/**
	 * NF request callback
	 * @param  {Object} jqXHR
	 * @param  {String} textStatus
	 * @return {Void}
	 */
	window.pywebcmd.callback.nf = function(jqXHR, textStatus) {
		var block = $(false);
		if ($(window.pywebcmd.ui.lblock).hasClass('selected')) block = window.pywebcmd.ui.lblock;
		if ($(window.pywebcmd.ui.rblock).hasClass('selected')) block = window.pywebcmd.ui.rblock;

		window.pywebcmd.methods.preloader(block, false);

		if (jqXHR.status != 200) {
			return window.pywebcmd.methods.error(jqXHR);
		}

		window.pywebcmd.methods.log('success', 'Some success message');
	}

	/**
	 * ND request callback
	 * @param  {Object} jqXHR
	 * @param  {String} textStatus
	 * @return {Void}
	 */
	window.pywebcmd.callback.nd = function(jqXHR, textStatus) {
		var block = $(false);
		if ($(window.pywebcmd.ui.lblock).hasClass('selected')) block = window.pywebcmd.ui.lblock;
		if ($(window.pywebcmd.ui.rblock).hasClass('selected')) block = window.pywebcmd.ui.rblock;

		window.pywebcmd.methods.preloader(block, false);

		if (jqXHR.status != 200) {
			return window.pywebcmd.methods.error(jqXHR);
		}

		window.pywebcmd.methods.log('success', 'Some success message');
	}

	/**
	 * DL request callback
	 * @param  {Object} jqXHR
	 * @param  {String} textStatus
	 * @return {Void}
	 */
	window.pywebcmd.callback.dl = function(jqXHR, textStatus) {
		var block = $(false);
		if ($(window.pywebcmd.ui.lblock).hasClass('selected')) block = window.pywebcmd.ui.lblock;
		if ($(window.pywebcmd.ui.rblock).hasClass('selected')) block = window.pywebcmd.ui.rblock;

		window.pywebcmd.methods.preloader(block, false);

		if (jqXHR.status != 200) {
			return window.pywebcmd.methods.error(jqXHR);
		}

		window.pywebcmd.methods.log('success', 'Some success message');
	}

	/**
	 * PR request callback
	 * @param  {Object} jqXHR
	 * @param  {String} textStatus
	 * @return {Void}
	 */
	window.pywebcmd.callback.pr = function(jqXHR, textStatus) {
		var block = $(false);
		if ($(window.pywebcmd.ui.lblock).hasClass('selected')) block = window.pywebcmd.ui.lblock;
		if ($(window.pywebcmd.ui.rblock).hasClass('selected')) block = window.pywebcmd.ui.rblock;

		window.pywebcmd.methods.preloader(block, false);

		if (jqXHR.status != 200) {
			return window.pywebcmd.methods.error(jqXHR);
		}

		var data = $.extend({}, jqXHR.responseJSON.data, { count: jqXHR.responseJSON.source.length });
		data.size  = window.pywebcmd.methods.size(data.size);
		data.atime = window.pywebcmd.methods.time(data.atime);
		data.ctime = window.pywebcmd.methods.time(data.ctime);
		data.mtime = window.pywebcmd.methods.time(data.mtime);

		window.pywebcmd.methods.log('success', jqXHR.responseJSON.message);
		window.pywebcmd.methods.html(window.pywebcmd.ui.dialog.fileinfo, data);

		$(window.pywebcmd.ui.dialog.parent)
			.removeClass('loading');
	}

})(jQuery);
