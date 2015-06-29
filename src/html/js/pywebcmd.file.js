;(function($) {

	/**
	 * Python web commander
	 * @type {Object}
	 */
	window.pywebcmd = window.pywebcmd || {};

	/**
	 * File functions
	 * @type {Object}
	 */
	window.pywebcmd.file = {

		time: function(value) {
			value = new Date(value * 1000);

			return ''
				+ ''  + ('00' + (value.getFullYear() + 0)).substr(-4)
				+ '-' + ('00' + (value.getMonth()    + 1)).substr(-2)
				+ '-' + ('00' + (value.getDate()     + 0)).substr(-2)
				+ ' ' + ('00' + (value.getHours()    + 0)).substr(-2)
				+ ':' + ('00' + (value.getMinutes()  + 0)).substr(-2)
				+ ':' + ('00' + (value.getSeconds()  + 0)).substr(-2);
		},

		size: function(value) {
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

	}

})(jQuery);
