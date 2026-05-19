"use client";
import { fetchCenterIfNeeded } from '@/redux/services/commonAPIService';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@/components/ui/button/Button';
import { commonTitle } from '@/helper/commontitle';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import { ChevronDownIcon } from '@/icons';
import BasicTables from '@/components/tables/BasicTable';
import { formatDate, formatMonthYear, formatTime } from '@/components/common/commonFunctions';
import { toast } from 'react-toastify';
import { readData } from '@/helper/axios';
import { Api } from '@/helper/api';

const initialValues = {
  center_id: ''
}
const RescheduleReport = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const centerName = useSelector((state: any) => state.centerInfo.list);
  const [tableData, setTableData] = useState([]);
  const dispatch = useDispatch();
  const store = useStore();
  const centerNameOptions = centerName.map((centerName: any) => ({
    value: centerName.id,
    label: centerName.center_name,
  }));
  const { handleChange, values, setFieldValue, handleSubmit, errors, touched } =
    useFormik({
      initialValues,
      // validationSchema: examScheduleSchema,
      onSubmit: async (value) => {
       
        // Require at least one field
        if (

          !value.center_id
        ) {
          toast.warning("Please Select the center");
          return;
        }

        try {
          setLoading(true);

          const res = await readData(`${Api.reschedualStudent}/${value.center_id}`);

       
          if (res.status === 200) {
            const formattedData = res.data.map((item: any) => ({
              ...item,
              center_info: item.center_name,
              student_info: item.identity_no + ' ' + ' - ' + item.student_name,
              course_info: item.course_code + ' ' + ' - ' + item.course_name,
              exam_date: formatDate(item.new_exam_date),
              examendtime: formatTime(item.new_exam_time),
              registration_time: formatMonthYear(item.registration_month, item.registration_year),
              releaseDate: formatDate(item.releaseDate),
            }));

            setTableData(formattedData ?? []);
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
  useEffect(() => {
    if (!centerName?.length) {
      fetchCenterIfNeeded(dispatch, store?.getState);
    }

  }, [centerName]);

  const columns = useMemo(
    () => [
      { accessorKey: "student_info", header: "Student Name" },
      { accessorKey: "exam_date", header: "Exam Date" },
      { accessorKey: "examendtime", header: "Exam Time" },
      { accessorKey: "center_info", header: "Center Name & code" },
      { accessorKey: "course_info", header: "Course Name & code" },
      { accessorKey: "registration_time", header: "Registration Month & year" },
      { accessorKey: "releaseDate", header: "Relese Date" },
    ],
    []
  );
  return (
    <div>
      <div className=''>
        <form onSubmit={handleSubmit}
          className=" bg-white shadow-lg rounded-xl p-6 space-y-5"
        >
          <h2 className="text-2xl font-semibold text-gray-700 py-3">
            Reschedule Report
          </h2>
          <div className='grid grid-cols-2 gap-5 items-center'>
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
          </div>

          <div>
            {/* <Button
                            type='submit' size="sm" variant="primary">
                            Save
                        </Button> */}


            <Button size="sm" type="submit" variant="outline">
              <SearchIcon className='text-brand-500' /> Search
            </Button>
          </div>
        </form>

      </div>
      {tableData.length ?
        <div className='mt-3'>

          <BasicTables reports={true} data={tableData} columns={columns} editPath="/master/course/courseForm" importbtn={false} isstudent={false} path="/master/course/courseForm" />
        </div> : ""}
    </div>
  )
}

export default RescheduleReport
