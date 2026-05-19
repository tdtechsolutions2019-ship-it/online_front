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
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux';
import SearchIcon from '@mui/icons-material/Search';
import BasicTables from '@/components/tables/BasicTable';
import { readData } from '@/helper/axios';
import { Api } from '@/helper/api';
import { toast } from 'react-toastify';
import { formatMonthYear, formatTime } from '@/components/common/commonFunctions';
const initialValues = {
    exam_date: '',
    exam_time: '',
    center_id: '',
    fees: '',
}
const ExamReport = () => {
    const [loading, setLoading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const router = useRouter();
    const centerName = useSelector((state: any) => state.centerInfo.list);
    const dispatch = useDispatch();
    const store = useStore();
    const centerNameOptions = centerName.map((centerName: any) => ({
        value: centerName.id,
        label: centerName.center_name,
    }));

    const { handleChange, values, setFieldValue, handleSubmit, errors, touched } =
        useFormik({
            initialValues,
            validationSchema: '',
            onSubmit: async (value) => {
        
                // Require at least one field
                if (
                    !value.exam_date &&
                    !value.exam_time &&
                    !value.center_id
                ) {
                    toast.warning("Please enter at least one search field");
                    return;
                }

                try {
                    setLoading(true);

                    const res = await readData(Api.getexamreport, {
                        params: {
                            exam_date: value.exam_date || undefined,
                            exam_time: value.exam_time || undefined,
                            center_id: value.center_id || undefined,
                        },
                    });

                    
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


    const columns = useMemo(
        () => [
            { accessorKey: "exam_date", header: "Exam Date" },
            { accessorKey: "exam_time", header: "Exam Time" },
            { accessorKey: "center_info", header: "Center Name & code" },
            { accessorKey: "course_info", header: "Course Name & code" },
            { accessorKey: "student_info", header: "Student Name" },
            { accessorKey: "registration_time", header: "Registration Month & year" },
            { accessorKey: "examendtime", header: "Exam End Time" },
        ],
        []
    );


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
                        Exam Report
                    </h2>
                    <div className='grid grid-cols-2 gap-5 items-center'>
                        <div className='grid grid-cols-[20%_70%] items-center'>
                            <div>
                                <Label className=''>{commonTitle.ExamDate}</Label>
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

                        <div className='grid grid-cols-[20%_70%] items-center'>

                            <Label className=''>{commonTitle.CenterName}</Label>

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

export default ExamReport
