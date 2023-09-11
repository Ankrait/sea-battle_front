import axios from 'axios';
import {
	IConnectionPayload,
	ICreatePayload,
	IGameIdResponse,
} from './services.interface';


axios.defaults.baseURL = 'http://localhost:8080/';

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
};
