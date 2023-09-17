import { io } from 'socket.io-client';
import { URL } from './services';

export const socket = io(URL, {
	autoConnect: false,
	reconnectionDelay: 500,
	reconnectionDelayMax: 1500,
	extraHeaders: {
		'ngrok-skip-browser-warning': 'true',
	},
});
