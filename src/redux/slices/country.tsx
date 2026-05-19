import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Country = {
  id: string;
  country_name: string;
  country_code: string;
  currency_code: string;
  status: string;
};

interface CountryState {
  list: Country[];
  loading: boolean;
  error: string | null;
}

const initialState: CountryState = {
  list: [],
  loading: false,
  error: null,
};

const CountrySlice = createSlice({
  name: "country",
  initialState,
  reducers: {
    setCountry: (state, action: PayloadAction<Country[]>) => {
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
    removeCountry: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(item => item.id !== action.payload);
    },
  },
});

export const { setCountry, setLoading, setError, removeCountry } = CountrySlice.actions;
export default CountrySlice.reducer;