"use client";
import Select from '@/components/form/Select';
import BasicTables from '@/components/tables/BasicTable';
import { Api } from '@/helper/api';
import { createData, deleteData, readData } from '@/helper/axios';
import ResponsiveDialog from '@/helper/deleteModel';
import { fetchCenterIfNeeded, fetchCourseIfNeeded } from '@/redux/services/commonAPIService';

import { fetchStudentIfNeeded } from '@/redux/services/commonAPIService';
import { removeStudent, setStudent } from '@/redux/slices/student';
import { stat } from 'fs';
import { Modal } from '@/components/ui/modal';
import ImportState from '../../../../importfileui/importState';
import ImportExportOutlinedIcon from '@mui/icons-material/ImportExportOutlined';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux';
import { toast } from 'react-toastify';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import MonthYearPicker from '@/components/calendar/Month_YearPicker';
import Button from '@/components/ui/button/Button';
import { useRouter } from 'next/navigation';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Label from '@/components/form/Label';
import { ChevronDownIcon } from '@/icons';
import { formatMonthYear } from '@/components/common/commonFunctions';

const StudentListPage = () => {
  const [id, setId] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const router = useRouter();
  // ✅ Search state
  const [searchParams, setSearchParams] = useState({
    name: "",
    center_name: "",
    course_name: "",
    joining_from: '',
    joining_to: '',
    registration_to: '',
    registration_from: '',
    status: ''

  });
  const [hasSearched, setHasSearched] = useState(false);  // ✅ track if search was triggered
  const [studentData, setStudentData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const centerCode = useSelector((state: any) => state.centerInfo.list);
  const userData = useSelector((state: any) => state.login.user);
  const store = useStore();
  const [error, setError] = useState(null);
  const student = useSelector((state: any) => state.student.list);
  const [importmodal, setImportModal] = useState(false)
  const centerCodeOptions = centerCode.map((centerCode: any) => ({
    value: centerCode.id,
    label: centerCode.center_code,
  }));

  const courseCode = useSelector((state: any) => state.course.list);
  const courseOptions = courseCode.map((courseCode: any) => ({
    value: courseCode.id,
    label: courseCode.course_code,
  }));
  const statusOptions = [
    { value: "1", label: "Active" },
    { value: "0", label: "Inactive" },
  ];

  const dispatch = useDispatch();
  // ✅ Search API call

  const handleSearch = useCallback(async () => {
    const { name, center_name, course_name, joining_from, joining_to, registration_from, registration_to, status } = searchParams;

    // ✅ Require at least one field
    if (
      !name?.trim() &&
      !center_name &&
      !course_name &&
      !joining_from &&
      !joining_to && !registration_from && !registration_to && !status.trim()
    ) {
      toast.warning("Please enter at least one search field");
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const res = await readData(Api.getStudentBysearch, {
        params: {
          name: name?.trim() || undefined,
          center_code: center_name?.trim() || undefined,
          course_code: course_name?.trim() || undefined,
          status: searchParams.status || undefined,

          // ✅ ADD THESE
          joining_from: joining_from || undefined,
          joining_to: joining_to || undefined,
          registration_from: registration_from || undefined,
          registration_to: registration_to || undefined,
        },
      });

      if (res.status === 200) {
        const formattedData = res.data.map((item: any) => ({
          ...item,
          status: item.status === "1" ? "Active" : "Inactive",
          joining_time: formatMonthYear(item.joining_month, item.joining_year),
          registration_time: formatMonthYear(item.registration_month, item.registration_year),
        }));

        setStudentData(formattedData ?? []);
      } else {
        toast.error("Failed to fetch students");
        setStudentData([]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch students");
      setStudentData([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);
  const columns = useMemo(
    () => [
      {
        accessorKey: "profile_photo",
        header: "Profile Photo",
        Cell: ({ cell }) => {
          const photo = cell.getValue();

          return photo?.url ? (
            <img
              src={photo.url}
              alt={photo.name}
              style={{
                width: "60px",
                height: "60px",
                objectFit: "cover",
              }}
            />
          ) : (
            "No Image"
          );
        },
      },

      {
        header: "Student Name",
        accessorFn: (row) => {
          const name = row.student_name || "";
          const id = row.identity_no || "";

          if (!name && !id) return "-";

          return `${id}${name && id ? " - " : ""}${name}`;
        },
      },
      { accessorKey: "joining_time", header: "Joining Month/Year" },
      { accessorKey: "registration_time", header: "Registration Month/Year" },
      {
        header: "Center / Course Code",
        accessorFn: (row) => {
          const center = row.center_code || "";
          const course = row.course_code || "";

          if (!center && !course) return "-";

          return `${center}${center && course ? " - " : ""}${course}`;
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ cell }) => {
          const value = cell.getValue();

          return (
            <span
              className={`px-3 py-1 rounded-sm text-xs font-semibold ${value === "Active"
                ? "bg-green-100 text-green-900"
                : "bg-red-100 text-red-900"
                }`}
            >
              {value}
            </span>
          );
        },
      },
      { accessorKey: "exam_date", header: "Exam Date" },
      { accessorKey: "exam_time", header: "Exam Time" },
    ],
    []
  );
  // ✅ Reset search
  const handleReset = () => {
    setSearchParams({ name: "", center_name: "", course_name: "", joining_from: '', joining_to: '', registration_to: '', registration_from: '', status: '' });
    setStudentData([]);
    setHasSearched(false);
  };

  const handleDelete = async () => {
    try {
      setOpenDelete(false);
      const res = await deleteData(`${Api.deleteStudent}/${id}`);
      if (res.status === 200) {
        toast.success("Student deleted successfully");
        // dispatch(removeStudent(id));
        // ✅ Remove from local list too
        setStudentData(prev => prev.filter((s: any) => s.id !== id));

      } else {
        toast.error("Failed to delete student");
      }
    } catch (error) {
      console.log("dekete error",error);
      toast.error("Failed to delete Student");
    }
  };
  const handleImportFile = async (file: File) => {
    console.log("Uploaded file:", file);

    // Option 1: send to backend
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await createData(
        Api.importStudent,
        formData
      )

      if (res?.status === 200) {
        toast.success("Student imported successfully");
        fetchStudentIfNeeded(dispatch, store?.getState);
        dispatch(setStudent())
        setImportModal(false);

      }

      else if (res.status === 500) {
        setError(res.data.message)
      }
      console.log("import res", res)
    } catch (error) {
      console.log("error", error)
    }


  };

  const handlepopup = (id: string) => {
    setId(id);
    setOpenDelete(true);
  };
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


  console.log('studentData', studentData)
  return (
    <div className='space-y-4'>
      <h2
        className="text-xl ms-3 font-semibold text-gray-800 dark:text-white/90"
        x-text="pageName"
      >
        Student
      </h2>
      {/* ✅ Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 mb-4 space-y-5">
        <div className='flex items-center justify-between'>

          <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">
            Search Students
          </h2>
          <div className='flex'>
            {userData?.permissions['Student']?.import ? <>
              <div className="flex items-center justify-center rounded-lg  bg-white text-gray-700  hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03 me-5 cursor-pointer">
                <Button size="sm" variant="outline" onClick={() => { setImportModal(true) }} className=" px-5 py-3 w-35 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">   <ImportExportOutlinedIcon fontSize="small" /> Import</Button>
              </div>

            </> : ""}
            {userData?.permissions['Student']?.add ? <>
              <div className="flex items-center justify-center rounded-lg  bg-white text-gray-700   dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03 me-5 cursor-pointer">
                <Button onClick={() => router.push('/master/student/studentForm')} size="sm" variant="outline" className=" px-5 py-3 w-35 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                  <AddOutlinedIcon fontSize="small" /> Add
                </Button>
              </div></> : ""}
          </div>

        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">

          {/* Name */}
          <div>
            <Label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
              Student Name
            </Label>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchParams.name}
              onChange={(e) =>
                setSearchParams(prev => ({ ...prev, name: e.target.value }))
              }
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Center Name */}
          <div>
            <Label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
              Center Name
            </Label>
            <div className="relative">
              <Select
                options={centerCodeOptions}
                value={searchParams.center_name}
                onChange={(value) =>
                  setSearchParams(prev => ({ ...prev, center_name: value }))
                }
                placeholder="Select Center Name"
                className="dark:bg-dark-900 "
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <ChevronDownIcon />
              </span>
            </div>
          </div>
          {/* Course Name */}
          <div>
            <Label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
              Course Name
            </Label>
            <div className="relative">
              <Select
                options={courseOptions}
                value={searchParams.course_name}
                onChange={(value) =>
                  setSearchParams(prev => ({ ...prev, course_name: value }))
                }
                placeholder="Select Course Name"
                className="dark:bg-dark-900 "
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <ChevronDownIcon />
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
              Status
            </label>
            <div className="relative">


              <Select
                options={statusOptions}
                value={searchParams.status}
                onChange={(value) =>
                  setSearchParams(prev => ({ ...prev, status: value }))
                }
                placeholder="Select Status"
                className="dark:bg-dark-900 "
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <ChevronDownIcon />
              </span>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-4 gap-2'>
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">
              Joining From
            </Label>
            <MonthYearPicker
              value={searchParams.joining_from || ""}
              onChange={(val) =>
                setSearchParams((prev) => ({
                  ...prev,
                  joining_from: val,
                }))
              }
            />
          </div>

          <div>
            <Label className="text-xs text-gray-500 mb-1 block">
              Joining To
            </Label>
            <MonthYearPicker
              value={searchParams.joining_to || ""}
              onChange={(val) =>
                setSearchParams((prev) => ({
                  ...prev,
                  joining_to: val,
                }))
              }
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">
              Registration From
            </Label>
            <MonthYearPicker
              value={searchParams.registration_from || ""}
              onChange={(val) =>
                setSearchParams((prev) => ({
                  ...prev,
                  registration_from: val,
                }))
              }
            />
          </div>

          <div>
            <Label className="text-xs text-gray-500 mb-1 block">
              Registration To
            </Label>
            <MonthYearPicker
              value={searchParams.registration_to || ""}
              onChange={(val) =>
                setSearchParams((prev) => ({
                  ...prev,
                  registration_to: val,
                }))
              }
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-3">
          <Button
            onClick={handleSearch}
            disabled={isLoading}
            className="transition"
          >
            {isLoading ? "Searching..." : "Search"}
          </Button>

          <Button
            variant='outline'
            size='sm'
            onClick={handleReset}
            className="transition"
          >
            Reset
          </Button>
        </div>
      </div>

      {/* ✅ Show table only after search */}
      {!hasSearched ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
          <span className="text-5xl mb-3">🔍</span>
          <p className="text-sm">Search by name, center, or course to view students</p>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-500" />
        </div>
      ) : studentData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
          <span className="text-5xl mb-3">📭</span>
          <p className="text-sm">No students found for your search</p>
        </div>
      ) : (
        <BasicTables
          data={studentData}
          columns={columns}
          title="Student"
          modulename={"Student"}
          onDelete={handlepopup}
          editPath="/master/student/studentForm"
          importbtn={false}
          isstudent={false}
          addbtn={false}
          path="/master/student/studentForm"
        />
      )}

      <ResponsiveDialog
        open={openDelete}
        handleDelete={handleDelete}
        setOpen={setOpenDelete}
      />
      <Modal isOpen={importmodal} onClose={() => setImportModal(false)}>
        <ImportState error={error} setError={setError} onClose={() => setImportModal(false)} onImport={handleImportFile} templateUrl='/student_template.xlsx' />
      </Modal>
    </div>
  );
};

export default StudentListPage;