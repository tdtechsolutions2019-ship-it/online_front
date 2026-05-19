"use client";
import DatePicker from '@/components/form/date-picker';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import Button from '@/components/ui/button/Button';
import { commonTitle } from '@/helper/commontitle';
import Loader from '@/helper/loader';
import { examScheduleSchema } from '@/helper/yupvalidation';
import { ChevronDownIcon } from '@/icons';
import { fetchCenterIfNeeded } from '@/redux/services/commonAPIService';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux';
import StudentList from './studentlist/page';
import SelectedStudent from './selectedstudents/page';
import { createData, readData } from '@/helper/axios';
import { Api } from '@/helper/api';
import { toast } from 'react-toastify';

const initialValues = {
  exam_date: '',
  exam_time: '',
  center_id: '',
}
const ExamAddForm = () => {
  const [loading, setLoading] = useState(false);
  const [showtable, setShowtbl] = useState(false)
  const [rowSelection, setRowSelection] = useState([]);
  const [studentList, setStudentList] = useState([])
  const tableRef = useRef(null);
  const router = useRouter();
  const centerName = useSelector((state: any) => state.centerInfo.list);
  const dispatch = useDispatch();
  const store = useStore();
  const centerNameOptions = centerName.map((centerName: any) => ({
    value: centerName.id,
    label: centerName.center_name,
  }));

  console.log("centerName", centerNameOptions)

  const { handleChange, values, setFieldValue, handleSubmit, errors, touched } =
    useFormik({
      initialValues,
      validationSchema: examScheduleSchema,
      onSubmit: async (value, action) => {
        console.log(value)

        if (rowSelection.length > 0) {

          try {

            const payload = {
              ...value,
              student_list: rowSelection

            };

            const res = await createData(Api.addexamschedule, payload)
            console.log("res121212121", res)
            if (res.status === 200) {

              toast.success("Schedule added successfully");
              setShowtbl(false)
              action.resetForm();

              router.push("/examDetails/examSchedule");

            } else if (res.status === 400) {
              toast.error(res.data.message);
            } else if (res.status === 500) {
              toast.error(res.data.data.message);
            }
          } catch (error) {
            console.log("API Error", error);
          }
          finally {

          }
        } else {
          toast.error("Please select atleast one student")
        }
      },
    });
  const statusoption = [
    { label: "Active", value: "1" },
    { label: "Inactive", value: "0" }
  ];
  const timeOptions = Array.from({ length: 29 }, (_, i) => {
    const start = 7 * 60; // 7:00 AM in minutes
    const minutes = start + i * 30;

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    const period = hours >= 12 ? "PM" : "AM";
    const formattedHour = hours % 12 === 0 ? 12 : hours % 12;

    const label = `${formattedHour}:${mins === 0 ? "00" : mins} ${period}`;

    return {
      label,
      value: label,
    };
  });
  useEffect(() => {
    if (!centerName?.length) {
      fetchCenterIfNeeded(dispatch, store?.getState);
    }
  }, [centerName]);
  console.log("form exam", values)
  console.log("form errors", errors);

  const GetRole = async (id) => {
    try {
      setLoading(true)
      const res = await readData(`${Api.getStudentList}/${id ? id : values.center_id}`, {
        header: {
          "Content-Type": "application/json",
        },
      })
      console.log("res", res)
      if (res.status === 200) {
        setStudentList(res.data)
        setShowtbl(true)
      }
    } catch (error) {
      console.log("error", error)
    }
    finally {

      setLoading(false)
    }
  }

  console.log("rowSelection", rowSelection)
  return (
    <div>
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-white/70 dark:bg-black/50 z-50">
          <Loader />
        </div>
      )}
      <div className='flex mb-5 gap-5 items-start justify-center'>
        <form
          onSubmit={handleSubmit}
          className=" bg-white shadow-lg rounded-xl p-6 space-y-5 w-full"
        >
          <h2 className="text-2xl font-semibold text-gray-700 py-3">
            Exam Schedule
          </h2>

          <div className='space-y-5'>

            <div className='space-y-5'>
              <div className='grid grid-cols-[20%_70%]'>
                <div>
                  <Label className=''>{commonTitle.ExamDate} <span className="text-red-500">*</span></Label>
                </div>
                <div>
                  <DatePicker
                    id="date-picker"
                    placeholder="Select a date"
                    value={values.exam_date}
                    onChange={(dates, currentDateString) => {
                      setFieldValue(`exam_date`, currentDateString);
                    }}
                   minDate="today" 
                  />

                  {errors.exam_date && touched.exam_date && (
                    <p className="text-red-500 text-sm mt-1 ms-2">{errors.exam_date}</p>
                  )}

                </div>
              </div>
              <div className='grid grid-cols-[20%_70%]'>
                <Label className=''>{commonTitle.ExamTime}</Label>
                <div className="relative">
                  <Select
                    options={timeOptions}
                    value={values.exam_time}
                    onChange={(value) =>
                      setFieldValue(`exam_time`, value)
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

            <div className='space-y-5'>

              <div className='grid grid-cols-[20%_70%]'>

                <Label className=''>{commonTitle.CenterName} <span className="text-red-500">*</span></Label>

                <div className="relative">
                  <Select
                    options={centerNameOptions}
                    value={values.center_id}
                    onChange={(value) =>
                      setFieldValue(`center_id`, value)
                    }
                    placeholder="Select"
                    className="dark:bg-dark-900 "
                  />

                  <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    <ChevronDownIcon />
                  </span>

                  {errors.center_id && touched.center_id && (
                    <p className="text-red-500 text-sm mt-1 ms-2">{errors.center_id}</p>
                  )}
                </div>
              </div>

              <div className='grid grid-cols-[20%_70%]'>
                <Label className=''>{commonTitle.Students}</Label>
                <div>
                  <Button className='w-full text-start'
                    onClick={() => GetRole(values.center_id)} size="sm" variant="outline">
                    Selected Student
                  </Button>
                </div>
              </div>
            </div>

          </div>

          <div className='flex  gap-5'>
            <Button
              type='submit' size="sm" variant="primary">
              Save
            </Button>

            <Button size="sm" onClick={() => {
              router.push("/examDetails/examSchedule");
            }} variant="outline">
              Cancel
            </Button>
          </div>
        </form>
        <div className='bg-white shadow-lg rounded-xl h-[400px] overflow-auto p-6 space-y-5 w-full'>
          <h2 className="text-xl font-semibold border-b text-gray-700 py-3">
            Selected Student
          </h2>
          <SelectedStudent scedualdata={rowSelection} />


        </div>
      </div>
      {showtable ?
        <StudentList studentlist={studentList} setRowSelection={setRowSelection} rowSelection={rowSelection} tableRef={tableRef} /> : ''}
    </div>
  )
}

export default ExamAddForm
