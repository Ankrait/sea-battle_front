import axios from 'axios';
import { FieldType, IRandomFieldResponse } from './services.interface';
import {
	IConnectionPayload,
	ICreatePayload,
	IGameIdResponse,
} from './services.interface';

// axios.defaults.baseURL = 'http://localhost:8080/';
axios.defaults.baseURL = 'https://a1ca-176-52-103-149.ngrok-free.app/';

axios.defaults.headers['Access-Control-Allow-Origin'] = '*';
axios.defaults.withCredentials = true;
// axios.defaults.headers.post['Acc'] = true;

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
