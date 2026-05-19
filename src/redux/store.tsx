import { configureStore } from "@reduxjs/toolkit";
import countryReducer from './slices/country'
import stateReducer from './slices/state'
import loginReducer from './slices/auth'
import centerInfo from './slices/centerInfo'
import rolereducer from './slices/role'
import SubjectSlice from './slices/subject'
import courseInfo from './slices/course'
import Student from './slices/student'

export const store = configureStore({
    reducer: {
        countries: countryReducer,
        states: stateReducer,
        login: loginReducer,
        centerInfo: centerInfo,
        role: rolereducer,
        subject: SubjectSlice,
        course: courseInfo,
        student: Student
    }
});