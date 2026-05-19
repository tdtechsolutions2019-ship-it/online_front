import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// ✅ State type (single state)
type State = {
  id: number;
  state_name: string;
  gst_code: string;
  status: string;
};

// ✅ Grouped response type (as backend sends)
type CountryGroup = {
  country_id: number;
  country_name: string;
  states: State[];
};

// ✅ Redux state
interface StateState {
  groups: CountryGroup[];
  loading: boolean;
  error: string | null;
}

// ✅ Initial state
const initialState: StateState = {
  groups: [],
  loading: false,
  error: null,
};

// ✅ Slice
const StateSlice = createSlice({
  name: "state",
  initialState,
  reducers: {
    // 🔥 Set full grouped data
    setGroupedState: (state, action: PayloadAction<CountryGroup[]>) => {
      state.groups = action.payload;
      state.loading = false;
      state.error = null;
    },

    // 🔥 If API returns single country group
    setSingleGroup: (state, action: PayloadAction<CountryGroup>) => {
      state.groups = [action.payload];
      state.loading = false;
      state.error = null;
    },

    // 🔥 Loading
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // 🔥 Error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },

    // 🔥 Remove a state by ID (from all groups)
    removeState: (state, action: PayloadAction<number>) => {
      state.groups = state.groups.map(group => ({
        ...group, 
        states: group.states.filter(s => s.id !== action.payload),
      }));
    },

    // 🔥 Optional: Add new state into a country
  },
});

// ✅ Exports
export const {
  setGroupedState,
  setSingleGroup,
  setLoading,
  setError,
  removeState,
} = StateSlice.actions;

export default StateSlice.reducer;