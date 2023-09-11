import { configureStore } from '@reduxjs/toolkit';

import { gameReducer } from './reducers/gameSlice';
import { appReducer } from './reducers/appSlice';

export const store = configureStore({
	reducer: {
		app: appReducer,
		game: gameReducer,
	},
	devTools: process.env.NODE_ENV !== 'production',
});

export type RootStateType = ReturnType<typeof store.getState>;
export type AppDispatchType = typeof store.dispatch;
