import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Student = {
  id: string;
    identity_no: string,
  center_code: string,
  student_name: string,
  course_code: string,
  joining_month: string,
  joining_year: string,
  registration_month:string,
  registration_year: string,
  parents_email: string,
  parents_contact: string,
  profile_photo: null,
  status: string
};

interface StudentState {
  list: Student[];
  loading: boolean;
  error: string | null;
}

const initialState: StudentState = {
  list: [],
  loading: false,
  error: null,
};

const StudentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    setStudent: (state, action: PayloadAction<Student[]>) => {
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
    removeStudent: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(item => item.id !== action.payload);
    },
  },
});

export const { setStudent, setLoading, setError, removeStudent } = StudentSlice.actions;
export default StudentSlice.reducer;