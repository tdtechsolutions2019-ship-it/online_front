"use client"
import BasicTables from '@/components/tables/BasicTable';
import { Modal } from '@/components/ui/modal';
import ResponsiveDialog from '@/helper/deleteModel';
import React, { useEffect, useMemo, useState } from 'react'
import ImportState from '../../../../importfileui/importState';
import { deleteData, readData } from '@/helper/axios';
import { Api } from '@/helper/api';
import { toast } from 'react-toastify';

const QuestionListPage = () => {
  const [importmodal, setImportModal] = useState(false)
  const [data, setData] = useState([])
  const [openDelete, setOpenDelete] = useState(false)
  const [id, setId] = useState("")
  const [loading, setLoading] = useState(false)
  const users = [
    {
      question: "FULL FORM OF GUI IS ",
      subject_name: "WINXP",
      question_type: "MCQ",
      status: "Active"

    }]
  const questiontype = [
    { value: '1', label: "Multiple Choice Question" },
    { value: '2', label: "True/False Question" },
    { value: '3', label: "Descriptive Questions" },
  ]

  const GetQuestions = async () => {
    try {
      setLoading(true)
      const res = await readData(Api.getquestion, {
        header: {
          "Content-Type": "application/json",
        },
      })
     
      if (res.status === 200) {

        const formattedData = res.data.map((item: any) => ({
          ...item,
          question_type: item.question_type === "1" ? "Multiple Choice Question" : item.question_type === "2" ? "True/False Question" : "Descriptive Questions",
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
    GetQuestions();
  }, [])
  const columns = useMemo(
    () => [
      {
        accessorKey: "question", header: "Question", minSize: 500,
        maxSize: 500, Cell: ({ cell }) => (cell.getValue() ? <div dangerouslySetInnerHTML={{ __html: cell.getValue() }} /> : "-"),
      },
      {
        accessorKey: "subject_name", header: "Subject Name", minSize: 100,
        maxSize: 100,
      },
      {
        accessorKey: "question_type", header: "Question Type", minSize: 100,
        maxSize: 100
      },
           {
  accessorKey: "status",
             header: "Status",
   minSize: 100,
        maxSize: 100,
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
},
    ],
    []
  );





  const handleDelete = async () => {
    try {
      setLoading(true);
      setOpenDelete(false);

      const res = await deleteData(`${Api.deletequestion}/${id}`,);

      if (res.status === 200) {
        toast.success("Question deleted successfully");
        GetQuestions();
      }

    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false);
    }
  };
  const handlepopup = (id: string) => {
    setId(id);
    setOpenDelete(true);
  };

  return (
    <div>
      <BasicTables data={data} columns={columns} title="Question" quebtn={true} modulename={"Question"} onDelete={handlepopup} quepath="/master/question/importFile" editPath="/master/question/questionForm" importbtn={true} isstudent={false} path="/master/question/questionForm" />
      <ResponsiveDialog open={openDelete} handleDelete={handleDelete} setOpen={setOpenDelete} />

    </div>
  )
}

export default QuestionListPage
