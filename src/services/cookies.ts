export const cookies = {
	get: (name: string) => {
		let matches = document.cookie.match(
			new RegExp(
				'(?:^|; )' +
					// eslint-disable-next-line no-useless-escape
					name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
					'=([^;]*)'
			)
		);
		return matches ? decodeURIComponent(matches[1]) : null;
	},

	set: (name: string, value: string, delay = 3600): void => {
		const options: { [key: string]: string } = {
			path: '/',
			'max-age': delay.toString(),
		};

		let cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);

		for (let optionKey in options) {
			cookie += '; ' + optionKey + '=' + options[optionKey];
		}

		document.cookie = cookie;
	},

	delete: (name: string): void => {
		cookies.set(name, '', -1);
	},
};
