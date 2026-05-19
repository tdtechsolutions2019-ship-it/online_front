"use client";
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import Button from '@/components/ui/button/Button';
import { studentTitle } from '@/helper/commontitle';
import Loader from '@/helper/loader';
import { coursePageSchema, studentPageSchema } from '@/helper/yupvalidation';
import { ChevronDownIcon } from '@/icons';
import { useFormik } from 'formik';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { join } from 'path';
import React, { useEffect, useRef, useState } from 'react'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { createData } from '@/helper/axios';
import { Api } from '@/helper/api';
import { toast } from 'react-toastify';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { fetchCenterIfNeeded, fetchCourseIfNeeded } from '@/redux/services/commonAPIService';
import { setStudent } from '@/redux/slices/student';
import MonthYearPicker from '@/components/calendar/Month_YearPicker';
const initialValues = {
  identity_no: '',
  center_code: '',
  student_name: '',
  course_code: '',
  joining_time: '',
  registration_time: '',
  registration_year: '',
  parents_email: '',
  parents_contact: '',
  profile_photo: null,
  status: ''
}

const StudentAddForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const imgRef = useRef(null);
  const centerCode = useSelector((state: any) => state.centerInfo.list);
  const dispatch = useDispatch();
  const store = useStore();
  const centerCodeOptions = centerCode.map((centerCode: any) => ({
    value: centerCode.id,
    label: centerCode.center_code,
  }));

  const courseCode = useSelector((state: any) => state.course.list);
  const courseOptions = courseCode.map((courseCode: any) => ({
    value: courseCode.id,
    label: courseCode.course_code,
  }));

  const { handleChange, values, setFieldValue, handleSubmit, errors, touched } =
    useFormik({
      initialValues,
      validationSchema: studentPageSchema,
      onSubmit: async (value, action) => {


        try {
          setLoading(true);
          const formData = new FormData();
          formData.append('identity_no', values.identity_no);
          formData.append('center_code', values.center_code);
          formData.append('student_name', values.student_name);
          formData.append('course_code', values.course_code);
          formData.append('joining_time', values.joining_time);
          // formData.append('joining_year', values.joining_year);
          formData.append('registration_time', values.registration_time);
          // formData.append('registration_year', values.registration_year);
          formData.append('parents_email', values.parents_email);
          formData.append('parents_contact', values.parents_contact);
          formData.append('profile_photo', values.profile_photo);
          formData.append('status', values.status);


          const res = await createData(Api.addStudent, formData,
          );

          if (res.status === 200) {
            dispatch(setStudent())
            toast.success("Student Added successfully");

            action.resetForm();

            router.push("/master/student");
          }
        } catch (error) {
          toast.error("Failed to add Student");
          console.log("API Error", error);
        }
        finally {
          setLoading(false);
        }
      },
    });

  useEffect(() => {
    if (!centerCode?.length) {
      fetchCenterIfNeeded(dispatch, store?.getState);
    }
  }, [centerCode]);

  useEffect(() => {
    if (!courseCode?.length) {
      fetchCourseIfNeeded(dispatch, store?.getState);
    }
  }, [courseCode]);
  const statusoption = [
    { label: "Active", value: "1" },
    { label: "Inactive", value: "0" }
  ];




  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    label: `${i + 1}`,
    value: `${i + 1}`,
  }));

  const currentYear = new Date().getFullYear();

  const yearOptions = Array.from(
    { length: currentYear - 2012 + 1 },
    (_, i) => {
      const year = 2012 + i;
      return {
        label: `${year}`,
        value: `${year}`,
      };
    }
  );

  return (
    <div>
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-white/70 dark:bg-black/50 z-50">
          <Loader />
        </div>
      )}
      <form onSubmit={handleSubmit} className=" bg-white shadow-lg rounded-xl p-6 space-y-5">
        <h2 className="text-2xl font-semibold text-gray-700 py-3">
          Add Student
        </h2>
        <div className='grid grid-cols-2 gap-10'>
        <div className='space-y-5'>
          <div className='grid grid-cols-[30%_1fr]' >
            <div>

              <Label className='w-30'>{studentTitle.id_no}  <span className="text-red-500">*</span></Label>
            </div>
            <div>

              <Input type="text" name="identity_no" onChange={handleChange} value={values.identity_no} />
              {errors.identity_no && touched.identity_no && (
                <p className="text-red-500 text-sm mt-1 ms-2">{errors.identity_no}</p>
              )}
            </div>

          </div>

          <div className='grid grid-cols-[30%_1fr]'>
            <div>
              <Label className='w-30' >
                {studentTitle.center_code} <span className="text-red-500">*</span>
              </Label>
            </div>

            <div className="relative">
              <Select
                options={centerCodeOptions}
                value={values.center_code}
                onChange={(value) =>
                  setFieldValue(`center_code`, value)
                }
                placeholder="Select"
                className="dark:bg-dark-900 "
              />

              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <ChevronDownIcon />
              </span>
              {errors.center_code && touched.center_code && (
                <p className="text-red-500 text-sm mt-1 ms-2">{errors.center_code}</p>
              )}
            </div>

          </div>

          <div className='grid grid-cols-[30%_1fr]' >
            <div>
              <Label className='w-30'>{studentTitle.student_name}  <span className="text-red-500">*</span></Label>

            </div>
            <div>
              <Input type="text" name="student_name" onChange={handleChange} value={values.student_name} />
              {errors.student_name && touched.student_name && (
                <p className="text-red-500 text-sm mt-1 ms-2">{errors.student_name}</p>
              )}
            </div>

          </div>

          <div className='grid grid-cols-[30%_1fr]'>
            <div>
              <Label className='w-30' >
                {studentTitle.course_code} <span className="text-red-500">*</span>
              </Label>

            </div>


            <div className="relative">
              <Select
                options={courseOptions}
                value={values.course_code}
                onChange={(value) =>
                  setFieldValue(`course_code`, value)
                }
                placeholder="Select"
                className="dark:bg-dark-900 "
              />

              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <ChevronDownIcon />
              </span>
              {errors.course_code && touched.course_code && (
                <p className="text-red-500 text-sm mt-1 ms-2">{errors.course_code}</p>
              )}
            </div>


          </div>




          <div className='grid grid-cols-[30%_1fr]'>
            <Label className='' >
              {studentTitle.joining_month} <span className="text-red-500">*</span>
            </Label>
            <div >

              <MonthYearPicker
                value={values.joining_time || ""}  // ✅ string only
                onChange={(value) =>
                  setFieldValue(`joining_time`, value)
                }
              />

            </div>

          </div>



          <div className='grid grid-cols-[30%_1fr]'>
            <Label className='' >
              {studentTitle.registration_month} <span className="text-red-500">*</span>
            </Label>

            <div >
              <MonthYearPicker
                value={values.registration_time || ""}  // ✅ string only
                onChange={(value) =>
                  setFieldValue(`registration_time`, value)
                }
              />

            </div>

          </div>




          <div className='grid grid-cols-[30%_1fr]' >
            <div>
              <Label className='w-30'>{studentTitle.parents_email}  </Label>

            </div>
            <div>
              <Input type="email" name="parents_email" onChange={handleChange} value={values.parents_email} />
              {errors.parents_email && touched.parents_email && (
                <p className="text-red-500 text-sm mt-1 ms-2">{errors.parents_email}</p>
              )}

            </div>

          </div>

          <div className='grid grid-cols-[30%_1fr]' >
            <div>
              <Label className='w-30'>{studentTitle.parents_contact}</Label>

            </div>
            <div>

              <Input type="text" name="parents_contact" onChange={handleChange} value={values.parents_contact} />
              {errors.parents_contact && touched.parents_contact && (
                <p className="text-red-500 text-sm mt-1 ms-2">{errors.parents_contact}</p>
              )}
            </div>

          </div>

          <div className='grid grid-cols-[30%_1fr]'>
            <Label className='w-30'>
              {studentTitle.profile_photo}

            </Label>

            <div>
              <Input
                id="profile_photo"
                name="profile_photo"
                className="cursor-pointer"
                type="file"
                accept="image/*"
                ref={imgRef} // use a ref if you want to clear input
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  setFieldValue("profile_photo", file);
                }}
              />

              {/* Show preview / filename with delete */}
              {values.profile_photo && (
                <div className="mt-2 flex items-center">
                  {/* Show file name */}
                  <span className="cursor-pointer text-gray-500">{values.profile_photo.name}</span>

                  {/* Delete button */}
                  <DeleteOutlineOutlinedIcon
                    className="text-red-600 ms-2 cursor-pointer"
                    onClick={() => {
                      setFieldValue("profile_photo", null);       // clear Formik
                      if (imgRef.current) imgRef.current.value = ""; // clear input
                    }}
                  />

                </div>
              )}



            </div>
        
          </div>

          <div className='grid grid-cols-[30%_1fr]'>
            <Label className='w-30' >
              {studentTitle.status}
            </Label>

            <div className="relative">
              <Select
                options={statusoption}
                value={values.status}
                onChange={(value) =>
                  setFieldValue(`status`, value)
                }
                placeholder="Select"
                className="dark:bg-dark-900 "
              />

              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <ChevronDownIcon />
              </span>
            </div>


          </div>
          </div>
           <div>
    {values.profile_photo && (
      <img
        src={URL.createObjectURL(values.profile_photo)}
        alt="Preview"
        className=" object-cover w-52 h-52 rounded border"
      />
    )}
  </div>
        </div>

        <div className='flex gap-5'>
          <Button type='submit' size="sm" variant="primary">
            Save
          </Button>

          <Button size="sm" onClick={() => {
            router.push("/master/student");
          }} variant="outline">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

export default StudentAddForm

