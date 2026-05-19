"use client";
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import Button from '@/components/ui/button/Button';
import { Api } from '@/helper/api';
import { createData } from '@/helper/axios';
import { commonTitle, courseTitle } from '@/helper/commontitle';
import Loader from '@/helper/loader';
import { coursePageSchema } from '@/helper/yupvalidation';
import { ChevronDownIcon } from '@/icons';
import { fetchSubjectIfNeeded } from '@/redux/services/commonAPIService';
import { setCourse, setLoading } from '@/redux/slices/course';
import { useFormik } from 'formik';
import { stat } from 'fs';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux';
import { toast } from 'react-toastify';
import SubjectWeighttable from './subjecttable/page';
const initialValues = {
  course_name: '',
  course_code: '',
  course_duration_in_months: '',
  total_questions: '',
  total_marks: '',
  exam_duration_in_hours: '',
  status: '',
  subjects: [{ subject: "", weight: "" }]
}
const CourseAddForm = () => {
  const router = useRouter();
  const subject = useSelector((state: any) => state.subject.list);
  const dispatch = useDispatch();
  const store = useStore();
  const loading = useSelector((state: any) => state.course.loading);

  const courseList = useSelector((state: any) => state.course.list);
  const { handleChange, values, setFieldValue, handleSubmit, errors, touched } =
    useFormik({
      initialValues,
      validationSchema: coursePageSchema,
      onSubmit: async (value, action) => {
        console.log("form values", value);
        try {
          const totalWeight = (value.subjects || []).reduce(
            (sum, item) => sum + Number(item.weight || 0),
            0
          );
          console.log("totalWeight11111", totalWeight)
          // ✅ Validation
          if (totalWeight > Number(value.total_marks)) {
            toast.error(" Total weight should not be greater than total marks");
            return;
          } else {
            dispatch(setLoading(true));
            const payload = {
              ...value
            };

            const res = await createData(Api.addCourse, payload,
            );
            console.log("res course", res)
            // if (!values.subjects || values.subjects.length === 0) {
            //   toast.error("Please select Atleast One subject");
            // }
            if (res.status === 200) {
              dispatch(setCourse())
              toast.success("Course added successfully");
              action.resetForm();
              router.push("/master/course");
            } else if (res.status === 400) {
              toast.error(res.data.message);
            } else if (res.status === 500) {
              toast.error(res.statusText);
            }
          }

        } catch (error) {
          toast.error("Failed to add course");
          console.log("API Error", error);
        }
        finally {
          dispatch(setLoading(false));
        }
      },
    });
  const statusoption = [
    { label: "Active", value: "1" },
    { label: "Inactive", value: "0" }
  ];
  const subjectOption = subject.map((subject: any) => ({
    value: subject.id.toString(),
    label: subject.subject_name,
  }));

  const monthOptions = [
    { label: "1 Month", value: "1" },
    { label: "1.5 Months", value: "1.5" },
    { label: "2 Months", value: "2" },
    { label: "2.5 Months", value: "2.5" },
    { label: "3 Months", value: "3" },
    { label: "4 Months", value: "4" },
    { label: "6 Months", value: "6" },
    { label: "8 Months", value: "8" },
    { label: "12 Months", value: "12" },
  ];


  const durationOptions = Array.from({ length: 10 }, (_, i) => {
    const value = (0.5 * (i + 1)).toFixed(2);
    return {
      label: value,
      value: (0.5 * (i + 1)).toString(),
    };
  });
  console.log("values", values);
  console.log("errors", errors);
  useEffect(() => {
    if (!subject?.length) {
      fetchSubjectIfNeeded(dispatch, store?.getState);
    }
  }, []);

  console.log("formikkkk", values)

  return (
    <div>
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-white/70 dark:bg-black/50 z-50">
          <Loader />
        </div>
      )}
      <form onSubmit={handleSubmit} className=" bg-white shadow-lg rounded-xl p-6 space-y-5">
        <h2 className="text-2xl font-semibold text-gray-700 py-3">
          Add Course
        </h2>
        <div className='grid grid-cols-2 gap-5'>
          <div>
            <Label className='w-30'>{courseTitle.course_name}  <span className="text-red-500">*</span></Label>
            <Input type="text" name="course_name" onChange={handleChange} value={values.course_name} />
            {errors.course_name && touched.course_name && (
              <p className="text-red-500 text-sm mt-1 ms-2">{errors.course_name}</p>
            )}

          </div>
          <div>
            <Label className='w-30'>{courseTitle.course_code}  <span className="text-red-500">*</span></Label>
            <Input type="text" name="course_code" onChange={handleChange} value={values.course_code} />
            {errors.course_code && touched.course_code && (
              <p className="text-red-500 text-sm mt-1 ms-2">{errors.course_code}</p>
            )}
          </div>
          <div>
            <Label>
              {courseTitle.course_duration}
            </Label>

            <div className="relative">
              <Select
                options={monthOptions}
                value={values.course_duration_in_months}
                onChange={(value) =>
                  setFieldValue(`course_duration_in_months`, value)
                }
                placeholder="Select"
                className="dark:bg-dark-900 "
              />

              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <ChevronDownIcon />
              </span>
            </div>


          </div>
          <div>
            <Label className='w-30'>{courseTitle.total_question} </Label>
            <Input type="text" name="total_questions" onChange={handleChange} value={values.total_questions} />

          </div>
          <div>
            <Label className='w-30'>{courseTitle.total_marks} </Label>
            <Input type="text" name="total_marks" onChange={handleChange} value={values.total_marks} />

          </div>

          <div>
            <Label>
              {courseTitle.exam_duration}
            </Label>

            <div className="relative">
              <Select
                options={durationOptions}
                value={values.exam_duration_in_hours}
                onChange={(value) =>
                  setFieldValue(`exam_duration_in_hours`, value)
                }
                placeholder="Select"
                className="dark:bg-dark-900 "
              />

              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <ChevronDownIcon />
              </span>
            </div>


          </div>

          <div>
            <Label>
              {commonTitle.Status}
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
        <h2>
          Select Subject
        </h2>
        {/* <div className='grid grid-cols-3 gap-5'>
          {subjectOption.map((item) => (

            <label key={item.id} style={{ display: "block" }}>
              <input
                type="checkbox"
                name="subjects"
                className='me-5 scale-150'
                value={item.value}
                checked={values.subjects.includes(item.value)}
                onChange={handleChange}
              />
              {item.label}
            </label>

          ))}
        </div> */}

        <SubjectWeighttable values={values} setFieldValue={setFieldValue} subjectOption={subjectOption} handleChange={handleChange} isViewMode={false} />
        <div className='flex gap-5'>
          <Button type='submit' size="sm" variant="primary">
            Save
          </Button>

          <Button size="sm" onClick={() => {
            router.push("/master/course");
          }} variant="outline">
            Cancel
          </Button>
        </div>

      </form>

    </div>
  )
}

export default CourseAddForm
