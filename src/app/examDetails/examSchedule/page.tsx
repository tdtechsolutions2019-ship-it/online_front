"use client";
import DatePicker from '@/components/form/date-picker';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import SelectToDropdown from '@/components/form/SelectTo';
import BasicTables from '@/components/tables/BasicTable';
import Button from '@/components/ui/button/Button';
import { Api } from '@/helper/api';
import { deleteData, readData } from '@/helper/axios';
import ResponsiveDialog from '@/helper/deleteModel';
import { ChevronDownIcon } from '@/icons';
import { fetchCenterIfNeeded } from '@/redux/services/commonAPIService';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux';
import { toast } from 'react-toastify';


export const SearchFilter = ({ examData, setExamData, setHasSearched }) => {
  console.log("11111111", examData, setExamData, setHasSearched)
  const centerCode = useSelector((state: any) => state.centerInfo.list);
  const dispatch = useDispatch();
  const store = useStore();
  const centerCodeOptions = centerCode.map((centerCode: any) => ({
    value: centerCode.id,
    label: centerCode.center_code,
  }));
  const [searchParams, setSearchParams] = useState({
    center_name: "",
    examdate_from: '',
    examdate_to: '',
    status: ''
  });
  // ✅ track if search was triggered

  const [isLoading, setIsLoading] = useState(false);
  const statusOptions = [
    { value: "1", label: "Active" },
    { value: "0", label: "Inactive" },
  ];

  const handleReset = () => {
    setSearchParams({
      center_name: "",
      examdate_from: '',
      examdate_to: '',
      status: ''
    });
    setExamData([]);
    setHasSearched(false);
  };


  const handleSearch = useCallback(async () => {
    const { center_name, status, examdate_from, examdate_to } = searchParams;

    // ✅ Require at least one field
    if (

      !center_name &&
      !status.trim() && !examdate_from && !examdate_to
    ) {
      toast.warning("Please enter at least one search field");
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const res = await readData(Api.getschedualbySearch, {
        params: {
          center_code: String(center_name) || undefined,
          status: searchParams.status || undefined,
          // ✅ ADD THESE
          examdate_from: examdate_from || undefined,
          examdate_to: examdate_to || undefined,

        },
      });

      if (res.status === 200) {
        const formattedData = res.data.map((item: any) => ({
          ...item,
          status: item.status === "1" ? "Active" : "Inactive",
        }));

        setExamData(formattedData ?? []);
      } else {
        toast.error("Failed to fetch students");
        setExamData([]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch students");
      setExamData([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!centerCode?.length) {
      fetchCenterIfNeeded(dispatch, store?.getState);
    }
  }, [centerCode]);
  console.log("searchParams", searchParams)
  console.log("examData", examData)
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">

        {/* Center Name */}
        <div>
          <Label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
            Center Name
          </Label>
          <div className="relative">
            {/* <Select

              options={centerCodeOptions}
              value={searchParams.center_name}
              onChange={(value) =>
                setSearchParams(prev => ({ ...prev, center_name: value }))
              }
              placeholder="Select Center Name"
              className="dark:bg-dark-900 "
            /> */}
            <SelectToDropdown centerCodeOptions={centerCodeOptions} setSearchParams={setSearchParams} value={searchParams.center_name} />

          </div>
        </div>
        <div>
          <Label className="text-xs text-gray-500 mb-1 block">
            Exam Date From
          </Label>
          <DatePicker
            id="exam-date"
            mode="range"
            placeholder='Select Date'
            value={[
              searchParams.examdate_from
                ? new Date(searchParams.examdate_from)
                : null,
              searchParams.examdate_to
                ? new Date(searchParams.examdate_to)
                : null,
            ]}
            onChange={(dates) => {
              setSearchParams((prev) => ({
                ...prev,
                examdate_from: dates[0]
                  ? dates[0].toLocaleDateString("en-CA")
                  : "",
                examdate_to: dates[1]
                  ? dates[1].toLocaleDateString("en-CA")
                  : "",
              }));
            }}
          />
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

        <div className="grid grid-cols-2 gap-2 mt-3">
          <Button
            onClick={handleSearch}
            className="px-3 py-2 w-full  transition"
          >
            Search
          </Button>

          <Button onClick={handleReset} variant='outline'
            className=" w-full transition"
          >
            Reset
          </Button>
        </div>
      </div></>
  )
}
const ExamListPage = () => {
  const [loading, setLoading] = useState(false);
  const [examData, setExamData] = useState([]);
  const [data, setData] = useState([])
  const [id, setId] = useState("")
  const [openDelete, setOpenDelete] = useState(false)
  const [showfilter, setfilter] = useState(false)
  const [hasSearched, setHasSearched] = useState(false);
  const examdata = [
    {
      exam_date: "01/01/2023",
      exam_time: "10:00 AM",
      center_id: "Center 1",
      status: "Active",
    }
  ]
  const columns = useMemo(
    () => [
      { accessorKey: "center_name", header: "Center Name", Cell: ({ cell }) => cell.getValue() ? cell.getValue() : "-" },
      { accessorKey: "exam_date", header: "Exam Date", Cell: ({ cell }) => cell.getValue() ? cell.getValue() : "-" },
      { accessorKey: "exam_time", header: "Exam Time", Cell: ({ cell }) => cell.getValue() ? cell.getValue() : "-" },
       {
  accessorKey: "status",
  header: "Status",
  Cell: ({ cell }) => {
    const value = cell.getValue();

    return (
      <span
        className={`px-3 py-1 rounded-sm text-xs font-semibold ${
          value === "Active"
            ? "bg-green-100 text-green-900"
            : "bg-red-100 text-red-900"
        }`}
      >
        {value}
      </span>
    );
  },
}
    ],
    []
  );

  const GetSchedualList = async () => {
    try {
      setLoading(true)
      const res = await readData(Api.getALLscheduale, {
        header: {
          "Content-Type": "application/json",
        },
      })
      console.log("resexamschedule", res)
      if (res.status === 200) {

        const formattedData = res.data.map((item: any) => ({
          ...item,
          status: item.status === "1" ? "Active" : "Inactive",
        }));
        setData(formattedData)
      }
    } catch (error) {
      console.log("error", error)
    }
    finally {

      setLoading(false)
    }
  }
  useEffect(() => {
    GetSchedualList();
  }, [])
  const handleDelete = async () => {
    try {
      setOpenDelete(false);

      const res = await deleteData(`${Api.deleteExamschedule}/${id}`);

      console.log("delete response", res);
      if (res.status === 200) {
        toast.success("Student deleted successfully");
        GetSchedualList();
      } else {
        toast.error("Failed to delete student");
      }

    } catch (error) {
      console.log(error);
      toast.error("Failed to delete Student");
    }
  };
  const csvConfig = mkConfig({
    fieldSeparator: ",",
    decimalSeparator: ".",
    useKeysAsHeaders: true,
    filename: "Student_data",
  });
  const downloadStudents = async (scheduleId: any) => {
    const res = await readData(`${Api.downloadstudent}/${scheduleId}`, {});

    // Parse CSV string into array of objects
    const lines = res.trim().split("\n");
    const headers = lines[0].split(",");
    const data = lines.slice(1).map((line: string) => {
      const values = line.split(",");
      return headers.reduce((obj: any, header: string, i: number) => {
        obj[header] = values[i];
        return obj;
      }, {});
    });

    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };
  const handlepopup = (id: string) => {
    setId(id);
    setOpenDelete(true);
  };
  return (
    <div>
      <BasicTables data={hasSearched ? examData : data} columns={columns} showfilter={showfilter} setfilter={setfilter} title="ExamSchedule" modulename={"Exam Schedule"} downloadStudents={downloadStudents} onDelete={handlepopup} examscheduleList={true} editPath="/examDetails/examSchedule/examForm" importbtn={false} isstudent={false} path="/examDetails/examSchedule/examForm" filterbtn={true}
        filterComponent={SearchFilter} filterProps={{
          examData,
          setExamData,
          setHasSearched
        }} />
      <ResponsiveDialog open={openDelete} handleDelete={handleDelete} setOpen={setOpenDelete} />
    </div>
  )
}

export default ExamListPage
