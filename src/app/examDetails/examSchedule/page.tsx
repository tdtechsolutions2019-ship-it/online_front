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
import { SearchFilter } from './searchFilter';



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
              className={`px-3 py-1 rounded-sm text-xs font-semibold ${value === "Active"
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
