"use client"

import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import React, { useEffect, useMemo, useRef, useState } from 'react'

import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import Button from '@/components/ui/button/Button';
import { useRouter } from 'next/navigation';
import { createData, readData } from '@/helper/axios';
import { Api } from '@/helper/api';
import { toast } from 'react-toastify';
import BasicTables from '@/components/tables/BasicTable';
import { formatDateTime } from '@/components/common/commonFunctions';
function ImportQueFile() {

    const router = useRouter()
    const [file, setFile] = useState<File | null>(null);
    const [selectedFile, setselectedFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const fileref = useRef(null as any);



    const GetQuestionsHistory = async () => {
        try {
            setLoading(true)
            const res = await readData(Api.getImportHistory, {
                header: {
                    "Content-Type": "application/json",
                },
            })
            console.log("resimporthistory", res)
            if (res.status === 200) {

                const formattedData = res.data.map((item: any) => ({
                    ...item,
                    created_at: formatDateTime(item.created_at)
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
    const hanleChange = (e: any) => {
        console.log("eeee", e.target.files[0])
        const seletecFile = e.target.files[0];
        setFile(seletecFile);
        if (!seletecFile) return;

        setselectedFile(seletecFile);
        const allowFileTypes = ['csv', 'xlsx', 'xls'];
        const fileext = seletecFile.name.split('.').pop();
        if (!allowFileTypes.includes(fileext || "")) {
            setError('Please select a valid file type (csv, xlsx, xls)');
            e.target.value = '';
            return
        }

        const maxsize = 2 * 1024 * 1024;
        if (seletecFile.size > maxsize) {
            setError('Please select a file less than 2MB');
            e.target.value = '';
            return
        }
        setError(null);
        setFile(seletecFile);
    }
    const handleImportFile = async (file: File) => {
        console.log("Uploaded file:", file);

        // Option 1: send to backend
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await createData(
                Api.importQuestion,
                formData
            )

            if (res?.status === 200) {
                toast.success(res.message);
                GetQuestionsHistory()

            }
        } catch (error) {
            console.log("error", error)
        }


    };
    const handleImport = () => {
        if (!file) return setError("Please select a file");
        handleImportFile(file);
    };
    console.log("file", error)
    const handleRemove = () => {
        setFile(null);
        setselectedFile(null);
        setError(null);

        if (fileref.current) {

            fileref.current.value = '';
        }
    }

    const columns = useMemo(
        () => [
            {
                accessorKey: "file_name",
                header: "File Name",
                Cell: ({ row, cell }) => (
                    <span
                        style={{
                            color: "blue",
                            cursor: "pointer",
                            textDecoration: "underline",
                            fontSize: "14px",
                            textTransform: "capitalize",
                            letterSpacing: "1px",
                        }}
                        onClick={() =>
                            router.push(`/master/question/importFile/${row.original.id}`)
                        }
                    >
                        {cell.getValue()}
                    </span>
                ),
            },
            { accessorKey: "total_rows", header: "Total Rows" },
            { accessorKey: "valid_rows", header: "valid Rows" },
            { accessorKey: "invalid_rows", header: "Invalid Rows" },
            { accessorKey: "created_at", header: "Created At" },

        ],
        []
    );
    useEffect(() => {
        GetQuestionsHistory();
    }, [])
    return (
        <>
            <h2 className="text-2xl font-semibold text-gray-700 py-3 ">
                Bulk Question Import
            </h2>
            <form className='bg-white shadow-lg rounded-xl mb-5 p-6 space-y-5' >


                <div className='flex items-center space-y-3.5 border-b justify-between'>
                    <Label className='text-[20px]'>Bulk Import</Label>
                    <a href='/question_template.xlsx' download={true} className='w-50 mb-5 px-4 py-2 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 inline-flex items-center justify-center font-medium gap-2 rounded-lg transition ' >Download Template</a>
                </div>
                <Label className='text-[15px] mt-3'>Add File</Label>
                <div className='flex items-center space-y-2 mb-1 w-full justify-between'>

                    <div className='w-200'>
                        <div className="space-y-4 ">
                            <Input ref={fileref} type="file" className='cursor-pointer w-full' onChange={hanleChange} accept=".csv, .xlsx" />


                        </div>
                    </div>

                    <div className="gap-3 pb-4" style={{ display: "flex", justifyContent: "center" }}>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push('/master/question')}
                            className="!rounded-lg !normal-case !px-4"
                        >
                            Cancel
                        </Button>

                        <Button
                            size="sm"
                            variant="primary"
                            onClick={handleImport}
                            className="!rounded-lg !normal-case !px-4 !shadow-none"
                        >
                            Import
                        </Button>
                    </div>

                </div>
                {selectedFile ? (
                    <p className='text-gray-500 space-x-2 mb-1'><span className='font-bold '>Selected:</span> {selectedFile.name} <span className='font-bold cursor-pointer'><DeleteOutlinedIcon onClick={handleRemove} color='error' /></span></p>
                ) : ""}

                {error && <p className='text-red-500'>{error}</p>}
            </form>

            <BasicTables data={data} columns={columns} addbtn={false} editPath="/master/course/courseForm" reports={true} importbtn={false} isstudent={false} path="/master/course/courseForm" />
        </>
    )
}

export default ImportQueFile
