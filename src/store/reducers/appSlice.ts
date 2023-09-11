import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface IAppInitialState {
	loading: boolean;
	errorMes: string;
}

const initialState: IAppInitialState = {
	loading: false,
	errorMes: ''
};

export const appSlice = createSlice({
	name: 'app',
	initialState,
	reducers: {
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload;
		},
		setErrorMes: (state, action: PayloadAction<string>) => {
			state.errorMes = action.payload;
		},
	},
	extraReducers: (builder) => {},
});

export const appReducer = appSlice.reducer;
export const { setLoading, setErrorMes } = appSlice.actions;
