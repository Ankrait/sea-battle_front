import { io } from 'socket.io-client';

const WS_URL =
	window.location.hostname === 'localhost'
		? 'http://localhost:8080'
		: 'wss://b704-176-52-103-149.ngrok-free.app/';

export const socket = io(WS_URL, {
	autoConnect: false,
});
