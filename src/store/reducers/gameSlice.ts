import { createAsyncThunk, createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import {
	AsyncThunkConfig,
	IGameResponse,
	IGameIdResponse,
	GameRequestType,
	IBasePayload,
	IErrorResponse,
} from 'services/services.interface';
import { ICreatePayload, IConnectionPayload } from 'services/services.interface';
import { gameService } from 'services/services';
import { socket } from 'services/ws';
import { setErrorMes, setLoading } from './appSlice';

interface IGameInitialState extends IGameResponse {}

const initialState: IGameInitialState = {
	gameId: '',
	userNumber: 1,
	user: '',
	enemy: null,
	userField: [[]],
	enemyField: [[]],
	status: 'INIT',
	isReady: false,
	enemyIsReady: false,
};

export const gameSlice = createSlice({
	name: 'game',
	initialState,
	reducers: {
		setGameData: (state, action: PayloadAction<Partial<IGameResponse>>) => {
			return { ...state, ...action.payload };
		},
		clearGameData: (state) => {
			return { ...state, ...initialState };
		},
	},
	extraReducers: (builder) => {
		builder.addMatcher(
			isAnyOf(createGame.fulfilled, connectGame.fulfilled),
			(state, action) => {
				state.gameId = action.payload.gameId;
				state.user = action.payload.user;
			}
		);
	},
});

export const gameReducer = gameSlice.reducer;
export const { setGameData, clearGameData } = gameSlice.actions;

export const createGame = createAsyncThunk<
	IGameIdResponse,
	ICreatePayload,
	AsyncThunkConfig
>('game/createGame', async (data, { dispatch, rejectWithValue }) => {
	dispatch(setLoading(true));
	try {
		const res = await gameService.createGame(data);
		return res;
	} catch (error) {
		if (error instanceof AxiosError) {
			error.response && dispatch(setErrorMes(error.response.data.message));
		}

		return rejectWithValue('[createGame]: Error');
	} finally {
		dispatch(setLoading(false));
	}
});

export const connectGame = createAsyncThunk<
	IGameIdResponse,
	IConnectionPayload,
	AsyncThunkConfig
>('game/connectGame', async (data, { dispatch, rejectWithValue }) => {
	dispatch(setLoading(true));
	try {
		const res = await gameService.connectGame(data);
		return res;
	} catch (error) {
		if (error instanceof AxiosError) {
			error.response && dispatch(setErrorMes(error.response.data.message));
		}

		return rejectWithValue('[connectGame]: Error');
	} finally {
		dispatch(setLoading(false));
	}
});

export const socketConnect = createAsyncThunk<void, IBasePayload, AsyncThunkConfig>(
	'game/socketConnect',
	(payload, { dispatch, rejectWithValue }) => {
		try {
			socket.connect();

			const onConnect = () => {
				console.log('ws open');

				const request: GameRequestType = {
					event: 'CONNECTION',
					payload,
				};

				socket.emit('message', request);
			};
			const onMessage = (response: IGameResponse | IErrorResponse) => {
				console.log(response);

				if ('message' in response) {
					dispatch(setErrorMes(response.message));
					return;
				}

				dispatch(setGameData(response));
			};
			const onDisconnect = () => {
				console.log('ws close');

				if (!socket.active) {
					socket.off('connect', onConnect);
					socket.off('message', onMessage);
					socket.off('disconnect', onDisconnect);
				}
			};

			socket.on('connect', onConnect);
			socket.on('message', onMessage);
			socket.on('disconnect', onDisconnect);
		} catch {
			return rejectWithValue('[socketConnect]: Error');
		}
	}
);

export const sendMessage = createAsyncThunk<void, GameRequestType, AsyncThunkConfig>(
	'game/sendMessage',
	(request, { rejectWithValue }) => {
		try {
			socket.emit('message', request);
		} catch {
			return rejectWithValue('[sendMessage]: Error');
		}
	}
);

export const socketDisconnect = createAsyncThunk<void, void, AsyncThunkConfig>(
	'game/socketDisconnect',
	(_, { rejectWithValue }) => {
		try {
			socket.disconnect();
		} catch {
			return rejectWithValue('[socketDisconnect]: Error');
		}
	}
);
