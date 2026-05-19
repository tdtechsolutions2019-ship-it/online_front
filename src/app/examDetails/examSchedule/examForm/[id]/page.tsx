"use client";

import DatePicker from '@/components/form/date-picker';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import Button from '@/components/ui/button/Button';
import { Api } from '@/helper/api';
import { createData, readData } from '@/helper/axios';
import { commonTitle } from '@/helper/commontitle';
import Loader from '@/helper/loader';
import { examScheduleSchema } from '@/helper/yupvalidation';
import { ChevronDownIcon } from '@/icons';
import { useFormik } from 'formik';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux';
import { toast } from 'react-toastify';
import SelectedStudent from '../selectedstudents/page';
import StudentList from '../studentlist/page';
import { fetchCenterIfNeeded } from '@/redux/services/commonAPIService';

const initialValues = {
  exam_date: '',
  exam_time: '',
  center_id: '',
}
const ExamEditForm = () => {
  const [loading, setLoading] = useState(false);
  const params = useParams<{ id: string }>();
  const { id } = params;
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const isViewMode = mode === "view";
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

  const { handleChange, values, setFieldValue, setValues, handleSubmit, errors, touched } =
    useFormik({
      initialValues,
      validationSchema: examScheduleSchema,
      onSubmit: async (value, action) => {
       

        if (rowSelection.length > 0) {

          try {

            const payload = {
              ...value,
              student_list: rowSelection

            };

            const res = await createData(Api.addexamschedule, payload)

            if (res.status === 200) {

              toast.success("Schedule added successfully");
              setShowtbl(false)
              action.resetForm();

              router.push("/examDetails/examSchedule");
            }
           
            if (res.status === 500) {
              toast.error(res.data.data.message);
            }
          } catch (error) {
            toast.error("Failed to add country");
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


  const getExamScheduale = async () => {
    try {
      setLoading(true);
      const res = await readData(`${Api.getExamschedualById}/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (res.status === 200) {

        const data = res.data || {};
      
        setValues({
          exam_date: data.exam_date || "",
          exam_time: data.exam_time || "",
          center_id: data.center_id || "",
        });
        setRowSelection(data.students)
      }
    } catch (error) {
      console.log("Fetch Error", error);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getExamScheduale();
  }, []);

  useEffect(() => {
    if (!centerName?.length) {
      fetchCenterIfNeeded(dispatch, store?.getState);
    }
  }, [centerName]);


  const GetRole = async (id) => {
    try {
      setLoading(true)
      const res = await readData(`${Api.getStudentList}/${id ? id : values.center_id}`, {
        header: {
          "Content-Type": "application/json",
        },
      })
   
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
            View  Exam Schedule
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
                    disabled={true}
                    value={values.exam_date}
                    onChange={(dates, currentDateString) => {
                      setFieldValue(`exam_date`, currentDateString);
                    }}
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
                    disable={true}
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
                    disable={true}
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

              {/* <div className='grid grid-cols-[20%_70%]'>
                <Label className=''>{commonTitle.Students}</Label>
                <div>
                  <Button className='w-full text-start'
                    onClick={() => GetRole(values.center_id)} size="sm" variant="outline">
                    Selected Student
                  </Button>
                </div>
              </div> */}
            </div>

          </div>

          <div className='flex  gap-5'>


            <Button size="sm" onClick={() => {
              router.push("/examDetails/examSchedule");
            }} variant="outline">
              Cancel
            </Button>
          </div>
        </form>
        <div className='bg-white shadow-lg rounded-xl h-[350px] overflow-auto p-6 space-y-5 w-full'>
          <h2 className="text-xl font-semibold border-b text-gray-700 py-3">
            Selected Student
          </h2>
          <SelectedStudent scedualdata={rowSelection} isViewMode={isViewMode} />
        </div>
      </div>

    </div>
  )
}


export default ExamEditForm
