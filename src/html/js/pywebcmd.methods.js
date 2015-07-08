;(function($) {

	/**
	 * Python web commander
	 * @type {Object}
	 */
	window.pywebcmd = window.pywebcmd || {};

	/**
	 * Show/hide preloader gif on block
	 * @param  {Object}  block
	 * @param  {Boolean} status
	 * @return {Void}
	 */
	var _preloader = function(block, status) {
		var input;
		if ($(block).is(window.pywebcmd.ui.lblock)) input = window.pywebcmd.ui.lpath;
		if ($(block).is(window.pywebcmd.ui.rblock)) input = window.pywebcmd.ui.rpath;

		$(block)
			.removeClass('loading')
			.addClass(status ? 'loading' : 'temp')
			.removeClass('temp');

		$(input)
			.prop('readonly', status);

		_nav();
	}

	/**
	 * Append error message to log
	 * @param  {Object} jqXHR
	 * @return {Void}
	 */
	var _error = function(jqXHR) {
		var message = 'Unknown error';
		if (jqXHR && jqXHR.responseJSON && jqXHR.responseJSON.message) {
			message = jqXHR.responseJSON.message;
		}
		else if (jqXHR.status == 0) {
			message = 'Server not responding';
		}

		_log('error', message);

		if ($(window.pywebcmd.ui.dialog.error.title).data('pywebcmd-html')) $(window.pywebcmd.ui.dialog.error.title).text($(window.pywebcmd.ui.dialog.error.title).data('pywebcmd-html').replace('{message}', message));
		if ($(window.pywebcmd.ui.dialog.error.title).data('pywebcmd-title')) $(window.pywebcmd.ui.dialog.error.title).attr('title', $(window.pywebcmd.ui.dialog.error.title).data('pywebcmd-html').replace('{message}', message));
		if ($(window.pywebcmd.ui.dialog.error.message).data('pywebcmd-html')) $(window.pywebcmd.ui.dialog.error.message).text($(window.pywebcmd.ui.dialog.error.message).data('pywebcmd-html').replace('{message}', message));
		if ($(window.pywebcmd.ui.dialog.error.message).data('pywebcmd-title')) $(window.pywebcmd.ui.dialog.error.message).attr('title', $(window.pywebcmd.ui.dialog.error.title).data('pywebcmd-message').replace('{message}', message));

		$(window.pywebcmd.ui.dialog.parent)
			.removeClass('loading')
			.removeClass('login')
			.removeClass('loginerror')
			.removeClass('fileinfo')
			.removeClass('progress')
			.removeClass('error')

		if (jqXHR.status == 401) {
			$(window.pywebcmd.ui.dialog.parent)
				.addClass('overlay')
				.addClass('login');
		}
		else {
			$(window.pywebcmd.ui.dialog.parent)
				.addClass('overlay')
				.addClass('error');
		}
	}

	/**
	 * Append log
	 * @param  {String} type
	 * @param  {String} text
	 * @return {Void}
	 */
	var _log = function(type, text) {
		var html = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
		html += (new Array(10 - html.length).join('&nbsp;'));
		html += window.pywebcmd.methods.time(new Date().getTime() / 1000);
		html += '&nbsp;&nbsp;';

		$('<p />')
			.attr('class', type)
			.attr('title', text)
			.html(html)
			.append(text)
			.appendTo(window.pywebcmd.ui.log);

		var log   = $(window.pywebcmd.ui.log).children('p');
		var len   = log.length;
		var cache = 10;

		if (len > cache) {
			$(log).filter(':lt(' + (len - cache) + ')').remove();
		}

		var scroll = $(window.pywebcmd.ui.log).prop('scrollHeight');
		$(window.pywebcmd.ui.log).scrollTop(scroll);
	}

	/**
	 * Set selected side
	 * @param  {Object} obj block to select or it's child
	 * @return {Void}
	 */
	var _selection = function(obj) {
		$(false)
			.add(window.pywebcmd.ui.lblock)
			.add(window.pywebcmd.ui.rblock)
				.removeClass('selected');

		$(obj)
			.closest('.lblock,.rblock')
				.addClass('selected');

		_nav();
	}

	var _time = function(value) {
		value = new Date(value * 1000);

		return ''
			+ ''  + ('00' + (value.getFullYear() + 0)).substr(-4)
			+ '-' + ('00' + (value.getMonth()    + 1)).substr(-2)
			+ '-' + ('00' + (value.getDate()     + 0)).substr(-2)
			+ ' ' + ('00' + (value.getHours()    + 0)).substr(-2)
			+ ':' + ('00' + (value.getMinutes()  + 0)).substr(-2)
			+ ':' + ('00' + (value.getSeconds()  + 0)).substr(-2);
	}

	var _size = function(value) {
		if (value * 1 < 1024) return value * 1 + 'B';
		else if(value * 1 < 1024 * 1024) return (value * 1 / 1024).toFixed(2) + 'K';
		else if(value * 1 < 1024 * 1024 * 1024) return (value * 1 / (1024 * 1024)).toFixed(2) + 'M';
		else if(value * 1 < 1024 * 1024 * 1024 * 1024) return (value * 1 / (1024 * 1024 * 1024)).toFixed(2) + 'G';
		else if(value * 1 < 1024 * 1024 * 1024 * 1024 * 1024) return (value * 1 / (1024 * 1024 * 1024 * 1024)).toFixed(2) + 'T';
		else if(value * 1 < 1024 * 1024 * 1024 * 1024 * 1024 * 1024) return (value * 1 / (1024 * 1024 * 1024 * 1024 * 1024)).toFixed(2) + 'P';
		else if(value * 1 < 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024) return (value * 1 / (1024 * 1024 * 1024 * 1024 * 1024 * 1024)).toFixed(2) + 'E';
		else if(value * 1 < 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024) return (value * 1 / (1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024)).toFixed(2) + 'Z';
		else return (value * 1 / (1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024)).toFixed(2) + 'Y';
	}

	/**
	 * Enable/disable elements in nav
	 * @return {Void}
	 */
	var _nav = function() {
		var block = $(false)
			.add(window.pywebcmd.ui.lblock)
			.add(window.pywebcmd.ui.rblock);
		var block1 = $(block).filter('.selected').first();
		var block2 = $(block).not(block1).first();
		var rows   = $(block1).find('tr.highlight');

		var path1, path2;
		if ($(block1).is(window.pywebcmd.ui.lblock)) { path1 = window.pywebcmd.ui.lpath; path2 = window.pywebcmd.ui.rpath; }
		if ($(block1).is(window.pywebcmd.ui.rblock)) { path1 = window.pywebcmd.ui.rpath; path2 = window.pywebcmd.ui.lpath; }

		var cancopy = true
			&& ($(rows).length > 0)
			&& ($(rows).first().find('td.basename').text() != '.')
			&& ($(rows).first().find('td.basename').text() != '..')
			&& ($(path1).val() != $(path2).val());
		var canmove = cancopy
			&& ($(path2).val().toString().indexOf($(path1).val().toString()) != 0);
		var canrename = true
			&& $(rows).length == 1
			&& ($(rows).first().find('td.basename').text() != '.')
			&& ($(rows).first().find('td.basename').text() != '..');
		var candelete = true
			&& ($(rows).length > 0)
			&& ($(rows).first().find('td.basename').text() != '.')
			&& ($(rows).first().find('td.basename').text() != '..');
		var cannewfile = true;
		var cannewdir = true;
		var candownload = candelete
			|| ($(rows).length == 1 && $(rows).first().find('td.basename').text() == '.');
		var canproperties = candownload
			|| ($(rows).length == 1 && $(rows).first().find('td.basename').text() == '..');

		$(window.pywebcmd.ui.nav.copy).parent().removeClass('disabled').addClass(cancopy ? 'temp' : 'disabled').removeClass('temp');
		$(window.pywebcmd.ui.nav.move).parent().removeClass('disabled').addClass(canmove ? 'temp' : 'disabled').removeClass('temp');
		$(window.pywebcmd.ui.nav.rename).parent().removeClass('disabled').addClass(canrename ? 'temp' : 'disabled').removeClass('temp');
		$(window.pywebcmd.ui.nav.delete).parent().removeClass('disabled').addClass(candelete ? 'temp' : 'disabled').removeClass('temp');
		$(window.pywebcmd.ui.nav.newfile).parent().removeClass('disabled').addClass(cannewfile ? 'temp' : 'disabled').removeClass('temp');
		$(window.pywebcmd.ui.nav.newdir).parent().removeClass('disabled').addClass(cannewdir ? 'temp' : 'disabled').removeClass('temp');
		$(window.pywebcmd.ui.nav.download).parent().removeClass('disabled').addClass(candownload ? 'temp' : 'disabled').removeClass('temp');
		$(window.pywebcmd.ui.nav.properties).parent().removeClass('disabled').addClass(canproperties ? 'temp' : 'disabled').removeClass('temp');
	}

	/**
	 * Parse data from jqXHR and convert it to row (tr tag)
	 * @param  {Object} data
	 * @return {Object}
	 */
	var _parse = function(data) {
		var result = $(false);

		$.each(data, function(key, value) {
			var row = $('<tr />');
			if (value.isdir)  $(row).addClass('dir');
			if (value.isfile) $(row).addClass('file');
			if (value.islink) $(row).addClass('link');

			$.each(window.pywebcmd.columns.list, function(i, column) {
				var col = $('<td />')
					.attr('class', column)
					.appendTo(row);
				if (column == 'icon') {
					$(col)
						.html('<img src="/ico/16/' + value[column] + '" alt="' + value[column] + '" />');
				}
				else if (column == 'size') {
					$(col)
						.attr('data-value', value.isdir ? '-1' : value[column])
						.attr('title', window.pywebcmd.methods.size(value[column]))
						.text(value.isdir ? '' : window.pywebcmd.methods.size(value[column]));
				}
				else if (window.pywebcmd.columns.properties[column] && window.pywebcmd.columns.properties[column].type && window.pywebcmd.columns.properties[column].type == 'time') {
					$(col)
						.attr('data-value', value[column])
						.attr('title', window.pywebcmd.methods.time(value[column]))
						.text(window.pywebcmd.methods.time(value[column]).slice(0, -3));
				}
				else if (window.pywebcmd.columns.properties[column] && window.pywebcmd.columns.properties[column].type && window.pywebcmd.columns.properties[column].type == 'boolean') {
					$(col)
						.html('<input type="checkbox" value="" readonly="readonly"' + (value[column] ? ' checked="checked"' : '') + ' />');
				}
				else {
					$(col)
						.attr('title', value[column])
						.text(value[column]);
				}
			});

			result = $(result).add(row);
		});

		return result;
	}

	/**
	 * LS request - append new directory list
	 * @param  {Mixed} source
	 * @return {Void}
	 */
	var _ls = function(source) {
		var block = $(false);
		if (source) {
			if ($(window.pywebcmd.ui.lblock).hasClass('selected')) block = window.pywebcmd.ui.lblock;
			if ($(window.pywebcmd.ui.rblock).hasClass('selected')) block = window.pywebcmd.ui.rblock;
		}
		else {
			block = $(block)
				.add(window.pywebcmd.ui.lblock)
				.add(window.pywebcmd.ui.rblock);
		}

		window.pywebcmd.methods.preloader(block, true);
		window.pywebcmd.methods.log('command', source ? 'Directory list \'' + source + '\'' : 'Initial directory list');
		window.pywebcmd.api.ls(source);
	}

	/**
	 * CP request - copy source to destination
	 * @param  {String} source
	 * @param  {String} destination
	 * @return {Void}
	 */
	var _cp = function(source, destination) {
		var block = $(false)
			.add(window.pywebcmd.ui.lblock)
			.add(window.pywebcmd.ui.rblock);

		window.pywebcmd.methods.preloader(block, true);
		window.pywebcmd.methods.log('command', 'Copying \'' + source + '\' to \'' + destination + '\'');
		window.pywebcmd.api.cp(source, destination);
	}

	/**
	 * MV request - move source to destination
	 * @param  {String} source
	 * @param  {String} destination
	 * @return {Void}
	 */
	var _mv = function(source, destination) {
		var block = $(false)
			.add(window.pywebcmd.ui.lblock)
			.add(window.pywebcmd.ui.rblock);

		window.pywebcmd.methods.preloader(block, true);
		window.pywebcmd.methods.log('command', 'Moving \'' + source + '\' to \'' + destination + '\'');
		window.pywebcmd.api.mv(source, destination);
	}

	/**
	 * RM request - remove source
	 * @param  {String} source
	 * @return {Void}
	 */
	var _rm = function(source) {
		var block = $(false);
		if ($(window.pywebcmd.ui.lblock).hasClass('selected')) block = window.pywebcmd.ui.lblock;
		if ($(window.pywebcmd.ui.rblock).hasClass('selected')) block = window.pywebcmd.ui.rblock;

		window.pywebcmd.methods.preloader(block, true);
		window.pywebcmd.methods.log('command', 'Removing \'' + source + '\'');
		window.pywebcmd.api.rm(source);
	}

	/**
	 * NF request - create new file in source directory
	 * @param  {String} source
	 * @param  {String} filename
	 * @return {Void}
	 */
	var _nf = function(source, filename) {
		var block = $(false);
		if ($(window.pywebcmd.ui.lblock).hasClass('selected')) block = window.pywebcmd.ui.lblock;
		if ($(window.pywebcmd.ui.rblock).hasClass('selected')) block = window.pywebcmd.ui.rblock;

		window.pywebcmd.methods.preloader(block, true);
		window.pywebcmd.methods.log('command', 'Creating file \'' + source + '/' + filename + '\'');
		window.pywebcmd.api.nf(source + '/' + filename);
	}

	/**
	 * ND request - create new directory in source directory
	 * @param  {String} source
	 * @param  {String} dirname
	 * @return {Void}
	 */
	var _nd = function(source, dirname) {
		var block = $(false);
		if ($(window.pywebcmd.ui.lblock).hasClass('selected')) block = window.pywebcmd.ui.lblock;
		if ($(window.pywebcmd.ui.rblock).hasClass('selected')) block = window.pywebcmd.ui.rblock;

		window.pywebcmd.methods.preloader(block, true);
		window.pywebcmd.methods.log('command', 'Creating directory \'' + source + '/' + dirname + '\'');
		window.pywebcmd.api.nd(source + '/' + dirname);
	}

	/**
	 * DL request - download source
	 * @param  {String} source
	 * @return {Void}
	 */
	var _dl = function(source) {
		var block = $(false);
		if ($(window.pywebcmd.ui.lblock).hasClass('selected')) block = window.pywebcmd.ui.lblock;
		if ($(window.pywebcmd.ui.rblock).hasClass('selected')) block = window.pywebcmd.ui.rblock;

		window.pywebcmd.methods.preloader(block, true);
		window.pywebcmd.methods.log('command', 'Downloading \'' + source + '\'');
		window.pywebcmd.api.dl(source);
	}

	/**
	 * PR request - properties/info
	 * @param  {String} source
	 * @return {Void}
	 */
	var _pr = function(source) {
		$(window.pywebcmd.ui.dialog.parent)
			.removeClass('loading')
			.removeClass('fileinfo')
			.removeClass('progress')
			.removeClass('error')
			.addClass('loading')
			.addClass('fileinfo');

		var block = $(false);
		if ($(window.pywebcmd.ui.lblock).hasClass('selected')) block = window.pywebcmd.ui.lblock;
		if ($(window.pywebcmd.ui.rblock).hasClass('selected')) block = window.pywebcmd.ui.rblock;

		window.pywebcmd.methods.preloader(block, true);
		window.pywebcmd.methods.log('command', 'Properties of \'' + source + '\'');
		window.pywebcmd.api.pr(source);
	}

	/**
	 * Methods object
	 * @type {Object}
	 */
	window.pywebcmd.methods = {
		preloader : _preloader,
		error     : _error,
		log       : _log,
		selection : _selection,
		nav       : _nav,
		time      : _time,
		size      : _size,
		parse     : _parse,
		ls        : _ls,
		cp        : _cp,
		mv        : _mv,
		mv        : _mv,
		rm        : _rm,
		nf        : _nf,
		nd        : _nd,
		dl        : _dl,
		pr        : _pr
	}

})(jQuery);
