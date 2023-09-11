import { createAsyncThunk, createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';

import { AxiosError } from 'axios';

import {
	AsyncThunkConfig,
	IGameResponse,
	IGameIdResponse,
} from '../../services/services.interface';
import { setErrorMes, setLoading } from './appSlice';
import { ICreatePayload, IConnectionPayload } from '../../services/services.interface';
import { gameService } from '../../services/services';

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
