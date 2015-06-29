;(function($) {

	/**
	 * Python web commander
	 * @type {Object}
	 */
	window.pywebcmd = window.pywebcmd || {};

	/**
	 * Frontend column list
	 * @type {Object}
	 */
	window.pywebcmd.columns = {
		list: [],
		properties: {}
	};

	// bind events on document ready
	$(document).ready(function(event) {
		$(false)
			.add(window.pywebcmd.ui.lhead)
			.add(window.pywebcmd.ui.rhead)
				.find('td,th')
					.each(function(key, value) {
						var column = _columns(value);

						if (window.pywebcmd.columns.properties[column.name] === undefined) {
							window.pywebcmd.columns.properties[column.name] = column;
							window.pywebcmd.columns.list.push(column.name);
						}
					});
	});


	/**
	 * Get column definition (name/type/display/visible object)
	 * @param  {Object} obj HTML or jQuery object
	 * @return {Object}
	 */
	var _columns = function(obj) {
		var result = {
			name    : undefined,
			type    : undefined,
			display : undefined,
			visible : undefined
		}

		if ($(obj).hasClass('icon'))       { result.name = 'icon';       result.type = 'string';  };
		if ($(obj).hasClass('basename'))   { result.name = 'basename';   result.type = 'string';  };
		if ($(obj).hasClass('dirname'))    { result.name = 'dirname';    result.type = 'string';  };
		if ($(obj).hasClass('isdir'))      { result.name = 'isdir';      result.type = 'boolean'; };
		if ($(obj).hasClass('isfile'))     { result.name = 'isfile';     result.type = 'boolean'; };
		if ($(obj).hasClass('islink'))     { result.name = 'islink';     result.type = 'boolean'; };
		if ($(obj).hasClass('type'))       { result.name = 'type';       result.type = 'string';  };
		if ($(obj).hasClass('mime'))       { result.name = 'mime';       result.type = 'string';  };
		if ($(obj).hasClass('encoding'))   { result.name = 'encoding';   result.type = 'string';  };
		if ($(obj).hasClass('owner'))      { result.name = 'owner';      result.type = 'string';  };
		if ($(obj).hasClass('group'))      { result.name = 'group';      result.type = 'string';  };
		if ($(obj).hasClass('permission')) { result.name = 'permission'; result.type = 'string';  };
		if ($(obj).hasClass('size'))       { result.name = 'size';       result.type = 'numeric'; };
		if ($(obj).hasClass('ctime'))      { result.name = 'ctime';      result.type = 'time';    };
		if ($(obj).hasClass('mtime'))      { result.name = 'mtime';      result.type = 'time';    };
		if ($(obj).hasClass('atime'))      { result.name = 'atime';      result.type = 'time';    };

		result.display = $(obj).is(':visible');
		result.visible = $(obj).css('visibility') != 'hidden';

		return result;
	}

})(jQuery);
