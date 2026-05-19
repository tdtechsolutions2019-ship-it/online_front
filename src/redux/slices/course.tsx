import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Course = {
  id: string;
  course_name: string;
  course_code: string;
  course_duration_in_months: string;
  total_questions: string;
  total_marks: string;
  exam_duration_in_hours: string;
  subjects: string;
  status: string;
};

interface CourseState {
  list: Course[];
  loading: boolean;
  error: string | null;
}

const initialState: CourseState = {
  list: [],
  loading: false,
  error: null,
};

const CourseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setCourse: (state, action: PayloadAction<Course[]>) => {
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
    removeCourse: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(item => item.id !== action.payload);
    },
  },
});

export const { setCourse, setLoading, setError, removeCourse } = CourseSlice.actions;
export default CourseSlice.reducer;