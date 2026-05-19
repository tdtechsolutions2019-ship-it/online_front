"use client";
import DatePicker from '@/components/form/date-picker';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import Button from '@/components/ui/button/Button';
import { commonTitle, courseTitle } from '@/helper/commontitle';
import { ChevronDownIcon } from '@/icons';
import { fetchCenterIfNeeded, fetchCourseIfNeeded } from '@/redux/services/commonAPIService';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux';
import SearchIcon from '@mui/icons-material/Search';
import BasicTables from '@/components/tables/BasicTable';
import { toast } from 'react-toastify';
import { createData, readData } from '@/helper/axios';
import { Api } from '@/helper/api';
import Loader from '@/helper/loader';
import { formatMonthYear, formatTime } from '@/components/common/commonFunctions';
const initialValues = {
  exam_date: '',
  center_id: '',
  course_name: "",
  status: '',

}
const ApperanceReportPage = () => {
  const router = useRouter();
  const centerName = useSelector((state: any) => state.centerInfo.list);
  const coursename = useSelector((state: any) => state?.course.list);
  const [rowSelection, setRowSelection] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const dispatch = useDispatch();
  const store = useStore();
  const centerNameOptions = centerName.map((centerName: any) => ({
    value: centerName.id,
    label: centerName.center_name,
  }));
  const courseNameOption = coursename.map((coursename: any) => ({
    value: coursename.id,
    label: coursename.course_name,
  }));

  const { handleChange, values, setFieldValue, handleSubmit, errors, touched, resetForm } =
    useFormik({
      initialValues,
      validationSchema: '',
      onSubmit: async (value) => {
        console.log("111111")
        // Require at least one field
        if (
          !value.exam_date &&
          !value.course_name &&
          !value.center_id &&
          !value.status
        ) {
          toast.warning("Please enter at least one search field");
          return;
        }

        try {
          setLoading(true);

          const res = await readData(Api.appearReports, {
            params: {
              exam_date: value.exam_date || undefined,
              course_id: value.course_name || undefined,
              center_id: value.center_id || undefined,
              status: value.status || undefined
            },
          });

          console.log("resinexamreport", res);
          if (res.status === 200) {
            const formattedData = res.data.map((item: any) => ({
              ...item,
              center_info: item.center_code + ' ' + ' - ' + item.center_name,
              student_info: item.identity_no + ' ' + ' - ' + item.student_name,
              course_info: item.course_code + ' ' + ' - ' + item.course_name,
              examendtime: formatTime(item.Examendtime),
              registration_time: formatMonthYear(item.registration_month, item.registration_year),
            }));

            setTableData(formattedData ?? []);

            if (!res.data?.length) {
              toast.error("No data found! Change the search criteria");
            }
          } else {
            toast.error("Failed to fetch students");
            setTableData([])
          }
        } catch (error) {
          console.log("error", error);
          toast.error("Failed to fetch exam report");
        } finally {
          setLoading(false);
        }
      },
    });
  const statusoption = [
    { label: "Appeared", value: "Appeared" },
    { label: "Not Appeared", value: "Not Appeared" }
  ];
  useEffect(() => {
    const stoerestate = store?.getState;
    if (!centerName?.length) {
      fetchCenterIfNeeded(dispatch, store?.getState);
    }
    if (!coursename?.length) {

      fetchCourseIfNeeded(dispatch, stoerestate);
    }
  }, [centerName, coursename]);


  const columns = useMemo(
    () => [
      { accessorKey: "exam_date", header: "Exam Date" },
      { accessorKey: "exam_time", header: "Exam Time" },
      { accessorKey: "center_info", header: "Center Name & code" },
      { accessorKey: "course_info", header: "Course Name & code" },
      { accessorKey: "student_info", header: "Student Name" },
      { accessorKey: "registration_time", header: "Registration Month & year" },
      {
        accessorKey: "exam_status", header: "exam_status", Cell: ({ cell }) => {
          const value = cell.getValue();

          return (
            <span
              className={`px-3 py-1 rounded-sm text-xs font-semibold ${value === "Appeared"
                ? "bg-green-100 text-green-900"
                : "bg-red-100 text-red-900"
                }`}
            >
              {value}
            </span>
          );
        },
      },
      { accessorKey: "examendtime", header: "Exam End Time" },
    ],
    []
  );

  const releaseStudents = async () => {
    console.log("11111111111111")
    console.log("rowSelection", rowSelection)
    const data = { studentslist: rowSelection };
    const res = await createData(Api.releaseStudent, data);
    console.log("ress", res)
    if (res.status === 200) {
      toast.success(res.message);
      resetForm();
      setTableData([]);


    } else if (res.status === 400) {
      toast.error(res.data.message);
    } else if (res.status === 500) {
      toast.error(res.statusText);
    }
  }
  return (
    <div>
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-white/70 dark:bg-black/50 z-50">
          <Loader />
        </div>
      )}
      <div className=''>
        <form onSubmit={handleSubmit}
          className=" bg-white shadow-lg rounded-xl p-6 space-y-5"
        >
          <h2 className="text-2xl font-semibold text-gray-700 py-3">
            Appearance Report
          </h2>
          <div className='grid grid-cols-2 gap-5 items-center'>
            <div className='grid grid-cols-[20%_70%] items-center'>
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
                />

              </div>
            </div>

            <div className='grid grid-cols-[20%_70%] items-center'>

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


              </div>
            </div>
            <div className='grid grid-cols-[20%_70%] items-center '>

              <Label className=''>{courseTitle.course_name} <span className="text-red-500">*</span></Label>

              <div className="relative">
                <Select
                  options={courseNameOption}
                  value={values.course_name}
                  onChange={(value) =>
                    setFieldValue(`course_name`, value)
                  }
                  placeholder="Select"
                  className="dark:bg-dark-900 "
                />

                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>
            <div className='grid grid-cols-[20%_70%] items-center'>
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

          <div>
            <Button size="sm" type="submit" variant="outline">
              <SearchIcon className='text-brand-500' /> Search
            </Button>
          </div>
        </form>

      </div>
      {tableData.length ?
        <div className='mt-3'>

          <BasicTables reports={true} appearreport={true} data={tableData} setRowSelection={setRowSelection} rowSelection={rowSelection} columns={columns} editPath="/master/course/courseForm" importbtn={false} isstudent={false} path="/master/course/courseForm" releaseStudents={releaseStudents} />
        </div> : ""}
    </div>
  )
}

export default ApperanceReportPage
