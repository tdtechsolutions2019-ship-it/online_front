import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// ✅ User type (optional, expand as needed)
type User = {
    name: string,
    id: number,
    email: string,
    role_id: number,
    role_name: string,
    permissions?: any[]      
};

// ✅ Auth state
interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

const getToken = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("token");
    }
    return null;
};
const getUser = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("user");
    }
    return null;
}

// ✅ Initial state
const initialState: AuthState = {
    user: getUser() ? JSON.parse(getUser() as string) : null,
    token: getToken(), // 🔥 persist token
    loading: false,
    error: null,
};

// ✅ Slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // 🔥 Start loading
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },

        // 🔥 Login success
        loginSuccess: (
            state,
            action: PayloadAction<{ user: User; token: string }>
        ) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.loading = false;
            state.error = null;

            // ✅ Save token
            if (typeof window !== "undefined") {
                document.cookie = `token=${action.payload.token}; path=/; max-age=${60 * 60 * 24
                    }; samesite=strict`;
                localStorage.setItem("token", action.payload.token);
                localStorage.setItem("user", JSON.stringify(action.payload.user));   

            }
        },

        // 🔥 Login failure
        loginFailure: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;
        },

        // 🔥 Logout
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.error = null;

            // ✅ Remove token
            if (typeof window !== "undefined") {

                localStorage.removeItem("token");
                localStorage.removeItem("user");

                document.cookie = "token=; path=/; max-age=0;";
            }
        },
    },
});

// ✅ Exports
export const { setLoading, loginSuccess, loginFailure, logout } =
    authSlice.actions;

export default authSlice.reducer;