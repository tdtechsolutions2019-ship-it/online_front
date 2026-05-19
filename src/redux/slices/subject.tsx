import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Subject = {
  id: string;
  subject_name: string;
  description: string;
  status: string;
};

interface SubjectState {
  list: Subject[];
  loading: boolean;
  error: string | null;
}

const initialState: SubjectState = {
  list: [],
  loading: false,
  error: null,
};

const SubjectSlice = createSlice({
  name: "subject",
  initialState,
  reducers: {
    setSubject: (state, action: PayloadAction<Subject[]>) => {
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
    removeSubject: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(item => item.id !== action.payload);
    },
  },
});

export const { setSubject, setLoading, setError, removeSubject } = SubjectSlice.actions;
export default SubjectSlice.reducer;