;(function($) {

	window.pywebcmd          = window.pywebcmd          || {};
	window.pywebcmd.callback = window.pywebcmd.callback || {};

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

		window.pywebcmd.methods.log('success', 'Some success message');
	}

})(jQuery);
