/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import BasicTables from '@/components/tables/BasicTable';
import { Api } from '@/helper/api';
import { deleteData, readData } from '@/helper/axios';
import ResponsiveDialog from '@/helper/deleteModel';
import { fetchCourseIfNeeded } from '@/redux/services/commonAPIService';
import { removeCourse } from '@/redux/slices/course';
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux';
import { toast } from 'react-toastify';

const CourseListPage = () => {
  const [id, setId] = useState("")
  const [openDelete, setOpenDelete] = useState(false)
  const course = useSelector((state: any) => state.course.list);
  const dispatch = useDispatch();
  const store = useStore();


  const columns = useMemo(
    () => [
      { accessorKey: "course_name", header: "Course Name" },
      { accessorKey: "course_code", header: "Course Code" },
      { accessorKey: "updated_by", header: "Updated By" },
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

  const handleDelete = async () => {
    try {
      setOpenDelete(false);

      const res = await deleteData(`${Api.deleteCourse}/${id}`,
      );

      console.log("delete response", res);
      if (res.status === 200) {
        toast.success("Course deleted successfully");
        dispatch(removeCourse(id));
      } else {
        toast.error("Failed to delete Course");
      }

    } catch (error) {
      console.log(error);
      toast.error("Failed to delete Course");
    }
  };

  const handlepopup = (id: string) => {
    setId(id);
    setOpenDelete(true);
  };
  useEffect(() => {
    if (!course?.length) {
      fetchCourseIfNeeded(dispatch, store?.getState);
    }
  }, []);
  return (
    <div>
      <BasicTables data={course} columns={columns} title="Course" modulename={"Course"} onDelete={handlepopup} editPath="/master/course/courseForm" importbtn={false} isstudent={false} path="/master/course/courseForm" />
      <ResponsiveDialog open={openDelete} handleDelete={handleDelete} setOpen={setOpenDelete} />

    </div>
  )
}

export default CourseListPage
