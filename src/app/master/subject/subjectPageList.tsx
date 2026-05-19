/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import BasicTables from '@/components/tables/BasicTable';
import { Api } from '@/helper/api';
import { deleteData, readData } from '@/helper/axios';
import ResponsiveDialog from '@/helper/deleteModel';
import { fetchSubjectIfNeeded } from '@/redux/services/commonAPIService';
import { removeSubject } from '@/redux/slices/subject';
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux';
import { toast } from 'react-toastify';

const SubjectListPage = () => {

  const [id, setId] = useState("")
  const [openDelete, setOpenDelete] = useState(false)
  const subject = useSelector((state: any) => state.subject.list);
  const dispatch = useDispatch();
  const store = useStore();


  const columns = useMemo(
    () => [
      { accessorKey: "subject_name", header: "Subject Name" },
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

      const res = await deleteData(`${Api.deleteSubject}/${id}`,
      );

      console.log("delete response", res);
      if (res.status === 200) {
        toast.success("Subject deleted successfully");
        dispatch(removeSubject(id));
      } else {
        toast.error("Failed to delete subject");
      }

    } catch (error) {
      console.log(error);
      toast.error("Failed to delete Subject");
    }
  };

  const handlepopup = (id: string) => {
    setId(id);
    setOpenDelete(true);
  };

  useEffect(() => {

    if (!subject?.length) {
      fetchSubjectIfNeeded(dispatch, store?.getState);
    }
  }, [subject]);

  return (
    <div>
      <BasicTables data={subject} columns={columns} title="Subject" modulename={"Subject"} onDelete={handlepopup} editPath="/master/subject/subjectForm" importbtn={false} isstudent={false} path="/master/subject/subjectForm" />
      <ResponsiveDialog open={openDelete} handleDelete={handleDelete} setOpen={setOpenDelete} />

    </div>
  )
}

export default SubjectListPage
