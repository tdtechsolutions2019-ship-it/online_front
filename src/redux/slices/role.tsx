import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Role = {
    id: string;
    role_code: string;
    role_name: string;
    status: string;
};

interface RoleState {
    list: Role[];
    loading: boolean;
    error: string | null;
}

const initialState: RoleState = {
    list: [],
    loading: false,
    error: null,
};

const RoleSlice = createSlice({
    name: "role",
    initialState,
    reducers: {
        setRole: (state, action: PayloadAction<Role[]>) => {
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
        removeRole: (state, action: PayloadAction<string>) => {
            state.list = state.list.filter(item => item.id !== action.payload);
        },
    },
});

export const { setRole, setLoading, setError, removeRole } = RoleSlice.actions;
export default RoleSlice.reducer;