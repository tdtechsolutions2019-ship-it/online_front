"use client";
import DatePicker from '@/components/form/date-picker';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import { commonTitle, courseTitle, studentTitle } from '@/helper/commontitle';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { fetchCenterIfNeeded, fetchCourseIfNeeded, fetchStudentIfNeeded } from '@/redux/services/commonAPIService';
import Select from '@/components/form/Select';
import { ChevronDownIcon } from '@/icons';
import BasicTables from '@/components/tables/BasicTable';
import { formatTime } from '@/components/common/commonFunctions';
import { toast } from 'react-toastify';
import { readData } from '@/helper/axios';
import { Api } from '@/helper/api';
const initialValues = {
    startDate: "",
    endDate: "",
    center_id: "",
    course_name: "",
    student_name: "",
}
const ResultReportPage = () => {
    const dispatch = useDispatch();
    const store = useStore();
    const router = useRouter();
    const centername = useSelector((state: any) => state?.centerInfo.list);
    const coursename = useSelector((state: any) => state?.course.list);
    const studentname = useSelector((state: any) => state?.student.list);
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(false);

    const centerNameOption = centername.map((centername: any) => ({
        value: centername.id,
        label: centername.center_name,
    }));


    const courseNameOption = coursename.map((coursename: any) => ({
        value: coursename.id,
        label: coursename.course_name,
    }));

    const studentNameOption = studentname.map((studentname: any) => ({
        value: studentname.id,
        label: studentname.student_name,
    }));
    const { handleChange, values, handleSubmit, errors, touched, handleBlur, setFieldValue } =
        useFormik({
            initialValues,
            // validationSchema: SettingSchema,
            onSubmit: async (value) => {
                   // Require at least one field
                if (

                    !value.center_id
                ) {
                    toast.warning("Please enter at least one search field");
                    return;
                }

                try {
                    setLoading(true);

                    const res = await readData(Api.resultReport, {
                        params: {
                            center_id: value.center_id || undefined,
                            start_date: value.startDate || undefined,
                            exam_scheduale_date: value.endDate || undefined,
                            course_id: value.course_name || undefined,
                            student_id: value.student_name || undefined

                        },
                    });

                    
                    if (res.status === 200) {
                        const formattedData = res.data.map((item: any) => ({
                            ...item,
                            center_info: item.center_code + ' ' + ' - ' + item.center_name,
                            student_info: item.identity_no + ' ' + ' - ' + item.student_name,
                            course_info: item.course_code + ' ' + ' - ' + item.course_name,
                            examendtime: formatTime(item.Examendtime),

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
        const stoerestate = store?.getState;

        if (!centername?.length) {

            fetchCenterIfNeeded(dispatch, stoerestate);
        }
        if (!coursename?.length) {

            fetchCourseIfNeeded(dispatch, stoerestate);
        }
        if (!studentname?.length) {

            fetchStudentIfNeeded(dispatch, stoerestate);
        }



    }, [centername, coursename]);

    const columns = useMemo(
        () => [
            { accessorKey: "identity_no", header: "Student Code" },
            { accessorKey: "student_name", header: "Student Name" },
            {
                accessorKey: "center_info",
                header: "Center Name & Code",
            },
            {
                accessorKey: "course_info",
                header: "Course Name & Code",
            },
            { accessorKey: "exam_start_time", header: "Exam Start Time" },
            { accessorKey: "examendtime", header: "Exam End Time" },
            { accessorKey: "total_questions", header: "Total Questions" },
            { accessorKey: "total_questions_Attempted", header: "Questions Attempted" },
            { accessorKey: "marks_obtained", header: "Marks Obtained" },
            { accessorKey: "part1", header: "Part 1" },
            { accessorKey: "part2", header: "Part 2" },
            { accessorKey: "percentage", header: "Percentage" },

        ],
        []
    );
    return (
        <div>
            <form onSubmit={handleSubmit} className='bg-white shadow-lg rounded-xl p-6 space-y-5'>
                <h3 className='text-2xl font-semibold text-gray-700 py-3'>Result Report</h3>
                <div className='grid grid-cols-2 gap-5'>

                    <div className='grid grid-cols-[30%_70%] items-center '>
                        <Label className=''>{commonTitle.ExamScheduleStartDate} <span className="text-red-500">*</span></Label>
                        <div>
                            <DatePicker
                                id="date-picker1"
                                placeholder="Select a date"
                                value={values.startDate}
                                onChange={(dates, currentDateString) => {
                                    setFieldValue(`startDate`, currentDateString);
                                }}
                            />
                        </div>

                    </div>

                    <div className='grid grid-cols-[30%_70%] items-center '>
                        <Label className=''>{commonTitle.ExamScheduleEndDate} <span className="text-red-500">*</span></Label>
                        <div>
                            <DatePicker
                                id="date-picker2"
                                placeholder="Select a date"
                                value={values.endDate}
                                onChange={(dates, currentDateString) => {
                                    setFieldValue(`endDate`, currentDateString);
                                }}
                            />
                        </div>
                    </div>

                    <div className='grid grid-cols-[30%_70%] items-center '>

                        <Label className=''>{commonTitle.CenterName} <span className="text-red-500">*</span></Label>

                        <div className="relative">
                            <Select
                                options={centerNameOption}
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


                    <div className='grid grid-cols-[30%_70%] items-center '>

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
                    <div className='grid grid-cols-[30%_70%] items-center '>

                        <Label className=''>{studentTitle.student_name} <span className="text-red-500">*</span></Label>

                        <div className="relative">
                            <Select
                                options={studentNameOption}
                                value={values.student_name}
                                onChange={(value) =>
                                    setFieldValue(`student_name`, value)
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
            {tableData.length ?
                <div className='mt-3'>
                    <BasicTables reports={true} appearreport={false} data={tableData} columns={columns} editPath="/master/course/courseForm" importbtn={false} isstudent={false} path="/master/course/courseForm" />
                </div> : ""}
        </div>
    )
}

export default ResultReportPage
