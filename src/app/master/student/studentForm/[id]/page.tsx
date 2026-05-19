"use client"
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import Button from '@/components/ui/button/Button';
import { Api } from '@/helper/api';
import { readData, updateData } from '@/helper/axios';
import { studentTitle } from '@/helper/commontitle';
import { studentPageSchema } from '@/helper/yupvalidation';
import { ChevronDownIcon } from '@/icons';
import { fetchCenterIfNeeded } from '@/redux/services/commonAPIService';
import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux';
import { toast } from 'react-toastify';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Loader from '@/helper/loader';
import Input from '@/components/form/input/InputField';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { error, log } from 'console';
import { setStudent } from '@/redux/slices/student';
import MonthYearPicker from '@/components/calendar/Month_YearPicker';
const initialValues = {
  identity_no: '',
  center_code: '',
  student_name: '',
  course_code: '',
  registration_time: '',
  joining_time: '',
  parents_email: '',
  parents_contact: '',
  profile_photo: null,
  status: ''
}
const StudentEditForm = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { id } = params;
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const isViewMode = mode === "view";
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


  const { handleChange, values, setFieldValue, setValues, handleSubmit, errors, touched } =
    useFormik({
      initialValues,
      validationSchema: studentPageSchema,
      onSubmit: async (value, action) => {
        console.log("form values student Data", value);

        try {
          setLoading(true);
          const formData = new FormData();
          formData.append('identity_no', values.identity_no);
          formData.append('center_code', values.center_code);
          formData.append('student_name', values.student_name);
          formData.append('course_code', values.course_code);
          formData.append('joining_time', values.joining_time);
          formData.append('registration_time', values.registration_time);
          formData.append('parents_email', values.parents_email);
          formData.append('parents_contact', values.parents_contact);
          formData.append('profile_photo', values.profile_photo);
          formData.append('status', values.status);

          const res = await updateData(`${Api.updateStudent}/${id}`, formData,
          );
          console.log("ress", res)
          if (res.status === 200) {
            dispatch(setStudent())
            toast.success("Student Update successfully");

            action.resetForm();

            router.push("/master/student");
          }
        } catch (error) {
          toast.error("Failed to Update Student");
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

  const getStudent = async () => {
    try {
      setLoading(true);

      const res = await readData(`${Api.getStudentById}/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = res.data || {};

      // ✅ Convert to yyyy-MM
      const joining_time = data.joining_year && data.joining_month
        ? `${data.joining_year}-${String(data.joining_month).padStart(2, "0")}`
        : "";

      const registration_time = data.registration_year && data.registration_month
        ? `${data.registration_year}-${String(data.registration_month).padStart(2, "0")}`
        : "";

      setValues({
        identity_no: data.identity_no || "",
        center_code: data.center_code || "",
        student_name: data.student_name || "",
        course_code: data.course_code || "",

        // ✅ USE THIS for your picker
        joining_time,
        registration_time,

        parents_email: data.parents_email || "",
        parents_contact: data.parents_contact || "",

        profile_photo: data.profile_photo || null,
        status: data.status ? String(data.status) : "1",
      });

    } catch (error) {
      console.log("Fetch Error", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (id) {
      getStudent();
    }
  }, [id]);
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
  console.log("Error In yoy", errors);
  console.log("student data", values);
  return (
    <div>
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-white/70 dark:bg-black/50 z-50">
          <Loader />
        </div>
      )}
      <form onSubmit={handleSubmit} className=" bg-white shadow-lg rounded-xl p-6 space-y-5">
        <h2 className="text-2xl font-semibold text-gray-700 py-3">
          {isViewMode ? "View" : "Update"} Student
        </h2>
        <div className='grid grid-cols-2 gap-10'>
        <div className='space-y-5'>
          <div className='grid grid-cols-[30%_1fr]' >
            <Label className='w-30'>{studentTitle.id_no}  <span className="text-red-500">*</span></Label>
            <Input type="text" name="identity_no" disabled={isViewMode} onChange={handleChange} value={values.identity_no} />

          </div>
          <div className='grid grid-cols-[30%_1fr]'>
            <Label className='w-30' >
              {studentTitle.center_code} <span className="text-red-500">*</span>
            </Label>

            <div className="relative">
              <Select
                options={centerCodeOptions}
                value={values.center_code}
                onChange={(value) =>
                  setFieldValue(`center_code`, value)
                }
                placeholder="Select"
                className="dark:bg-dark-900 "
                disable
              />

              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <ChevronDownIcon />
              </span>
            </div>


          </div>
          <div className='grid grid-cols-[30%_1fr]' >
            <Label className='w-30'>{studentTitle.student_name}  <span className="text-red-500">*</span></Label>
            <Input type="text" name="student_name" disabled={isViewMode} onChange={handleChange} value={values.student_name} />

          </div>
          <div className='grid grid-cols-[30%_1fr]'>
            <Label className='w-30' >
              {studentTitle.course_code} <span className="text-red-500">*</span>
            </Label>

            <div className="relative">
              <Select
                options={courseOptions}
                value={values.course_code}
                onChange={(value) =>
                  setFieldValue(`course_code`, value)
                }
                placeholder="Select"

                className="dark:bg-dark-900 "
                disable={isViewMode}
              />

              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <ChevronDownIcon />
              </span>
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
            <Label className='w-30'>{studentTitle.parents_email} </Label>
            <Input type="email" name="parents_email" onChange={handleChange} disabled={isViewMode} value={values.parents_email} />

          </div>
          <div className='grid grid-cols-[30%_1fr]' >
            <Label className='w-30'>{studentTitle.parents_contact} </Label>
            <Input type="text" name="parents_contact" disabled={isViewMode} onChange={handleChange} value={values.parents_contact} />

          </div>
          <div className='grid grid-cols-[30%_1fr]'>
            <Label className='w-30'>
              {studentTitle.profile_photo}
              
            </Label>

            <div>
        {/* INPUT (only hidden in view mode) */}
{!isViewMode && (
  <Input
    id="profile_photo"
    name="profile_photo"
    className="cursor-pointer"
    ref={imgRef}
    type="file"
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files?.[0];
      setFieldValue("profile_photo", file);
    }}
  />
)}


       
            {!isViewMode &&
              values.profile_photo && (
                <div className="mt-2 flex">
                  <>
                    {mode === 'edit' && <a target='_blank' href={values.profile_photo.url} className='cursor-pointer text-gray-500 ms-5'>{values.profile_photo?.name}</a>}
                    <DeleteOutlineOutlinedIcon className="text-red-600 ms-2 cursor-pointer"
                      onClick={() => {
                        setFieldValue("profile_photo", null);   // clear Formik
                        if (imgRef.current) imgRef.current.value = ""; // clear input
                      }} />
                  </>
                </div>
              )}
            </div>
          </div>
            <div className='grid grid-cols-[30%_1fr]'>
            <Label className='w-30' >
              {studentTitle.status} <span className="text-red-500">*</span>
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
                disable={isViewMode}
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
    src={
      typeof values.profile_photo === "string"
        ? values.profile_photo
        : values.profile_photo.url
        ? values.profile_photo.url
        : URL.createObjectURL(values.profile_photo)
    }
    alt="profile"
    className="object-cover w-52 h-52 rounded border"
  />
)}
            </div>
            </div>

        <div className='flex gap-5'>
          {
            !isViewMode && <Button size="sm" type="submit" variant="primary">
              Save
            </Button>
          }

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

export default StudentEditForm
