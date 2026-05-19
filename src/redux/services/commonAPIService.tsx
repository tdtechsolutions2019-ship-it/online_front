import { Api } from '@/helper/api';
import { readData } from '@/helper/axios';
import { setCountry } from '@/redux/slices/country';
import { setGroupedState } from '../slices/state';
import { setCenterInfo } from '../slices/centerInfo';
import { setRole } from '../slices/role';
import { setSubject } from '../slices/subject';
import { setCourse } from '../slices/course';
import { setStudent } from '../slices/student';


export const fetchCountriesIfNeeded = async (dispatch: any, getState: any) => {
  const { country } = getState();

  if (country?.list?.length > 0) return; // ✅ already in Redux

  try {
    const res = await readData(Api.getCountry, {
      header: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 200) {
      const formattedData = res.data.map((item: any) => ({
        ...item,
        status: item.status === "1" ? "Active" : "Inactive",
      }));

      dispatch(setCountry(formattedData));
    }
  } catch (error) {
    console.log(error);
  }
};

export const fetchStatesIfNeeded = async (dispatch: any, getState: any) => {
  const { state } = getState();

  if (state?.list?.length > 0) return;
  try {
    const res = await readData(Api.getState, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    console.log("state Resss",res)
    if (res.status === 200) {

      dispatch(setGroupedState(res.data));

    }
  } catch (error) {
    console.log("error", error)
  }
}


export const fetchCenterIfNeeded = async (dispatch: any, getState: any) => {
  const { centerInfo } = getState();
  console.log("center111111111", centerInfo)
  if (centerInfo?.list?.length > 0) return;
  try {

    const res = await readData(Api.getCenterInfo, {
      header: {
        "Content-Type": "application/json",
      },
    })
    console.log("Center Info", res)
    if (res.status === 200) {
      const formattedData = res.data.map((item: any) => ({
        ...item,
        status: item.status === "1" ? "Active" : "Inactive",
      }));

      dispatch(setCenterInfo(formattedData));
    }
  } catch (error) {
    console.log("error", error)
  }
  finally {

  }
}


  export const fetchRolesIfNeeded = async (dispatch: any, getState: any) => {
     const { role } = getState();
      if (role?.list?.length > 0) return;
        try {
          
            const res = await readData(Api.getroles, {
                header: {
                    "Content-Type": "application/json",
                },
            })
            console.log("res", res)
            if (res.status === 200) {

                const formattedData = res.data.map((item: any) => ({
                    ...item,
                    status: item.status === "1" ? "Active" : "Inactive",
                }));
                 dispatch(setRole(formattedData));
            }
        } catch (error) {
            console.log("error", error)
        }
       
    }

export const fetchSubjectIfNeeded = async (dispatch: any, getState: any) => {
  const { subject } = getState();
  console.log("subject in fatchapi", subject)
  if (subject?.list?.length > 0) return; 

  try {
    const res = await readData(Api.getSubject, {
      header: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 200) {
      const formattedData = res.data.map((item: any) => ({
        ...item,
        status: item.status === "1" ? "Active" : "Inactive",
      }));

      dispatch(setSubject(formattedData));
    }
  } catch (error) {
    console.log(error);
  }
};


export const fetchCourseIfNeeded = async (dispatch: any, getState: any) => {
  const { course } = getState();

  if (course?.list?.length > 0) return; // ✅ already in Redux

  try {
    const res = await readData(Api.getCourse, {
      header: {
        "Content-Type": "application/json",
      },
    });
    console.log("res sub", res);
    if (res.status === 200) {
      const formattedData = res.data.map((item: any) => ({
        ...item,
        status: item.status === "1" ? "Active" : "Inactive",
      }));

      dispatch(setCourse(formattedData));
    }
  } catch (error) {
    console.log(error);
  }
};

export const fetchStudentIfNeeded = async (dispatch: any, getState: any) => {
  const { student } = getState();

  if (student?.list?.length > 0) return; // ✅ already in Redux

  try {
    const res = await readData(Api.getStudent, {
      header: {
        "Content-Type": "application/json",
      },
    });
    console.log("res sub", res);
    if (res.status === 200) {
      const formattedData = res.data.map((item: any) => ({
        ...item,
        status: item.status === "1" ? "Active" : "Inactive",
      }));

      dispatch(setStudent(formattedData));
    }
  } catch (error) {
    console.log(error);
  }
};