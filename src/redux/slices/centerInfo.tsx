import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type CenterInfo = {
    id: string;
    center_code: string,
    center_name: string,
    contact_person1: string,
    status: string;
};

interface CenterInfoState {
    list: CenterInfo[];
    loading: boolean;
    error: string | null;
}

const initialState: CenterInfoState = {
    list: [],
    loading: false,
    error: null,
};

const CenterInfoSlice = createSlice({
    name: "centerInfo",
    initialState,
    reducers: {
        setCenterInfo: (state, action: PayloadAction<CenterInfo[]>) => {
            state.list = action.payload;
            state.loading = false;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.loading = false;
        },
        removeCenterInfo: (state, action: PayloadAction<string>) => {
            state.list = state.list.filter(item => item.id !== action.payload);
        },
    },
});

export const { setCenterInfo, setLoading, setError, removeCenterInfo } = CenterInfoSlice.actions;
export default CenterInfoSlice.reducer;