import axios from 'axios';

import {
	IConnectionPayload,
	ICreatePayload,
	IGameIdResponse,
	IRandomFieldResponse,
} from './services.interface';

export const URL =
	window.location.hostname === 'localhost'
		? 'http://localhost:8080'
		: 'https://064e-176-52-103-149.ngrok-free.app/';

axios.defaults.baseURL = URL;
// axios.defaults.withCredentials = true;
axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
// axios.defaults.headers.common['Cache-Control'] = 'no-store,no-cache,must-revalidate';
// axios.defaults.headers.common['Vary'] = 'Origin';

export const gameService = {
	createGame: async (data: ICreatePayload) => {
		const res = await axios.post<IGameIdResponse>('game', data);

		return res.data;
	},
	connectGame: async (data: IConnectionPayload) => {
		const { gameId, player } = data;
		const res = await axios.put<IGameIdResponse>(`game/${gameId}`, { player });

		return res.data;
	},
	getRandomField: async () => {
		const res = await axios.get<IRandomFieldResponse>('random_field');

		return res.data.field;
	},
};
