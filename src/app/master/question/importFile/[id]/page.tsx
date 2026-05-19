"use client"

import { formatDateTime } from '@/components/common/commonFunctions';
import BasicTables from '@/components/tables/BasicTable';
import { Api } from '@/helper/api';
import { readData } from '@/helper/axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react'

function ImportHistoryDetails() {
    const params = useParams<{ id: string }>();
    const { id } = params;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const GetQuestions = async () => {
        try {
            setLoading(true)
            const res = await readData(`${Api.getImportHistorydetailsforque}/${id ? id : ""}`, {
                header: {
                    "Content-Type": "application/json",
                },
            })
            console.log("getImportHistorydetailsforque", res)
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


    const columns = useMemo(
        () => [
            {
                accessorKey: "question_text",
                header: "Question",

            },
            {
                accessorKey: "status", header: "Status", minSize: 100,
                maxSize: 100,
                Cell: ({ cell }) => {
                    const value = cell.getValue();

                    return (
                        <span
                            className={`px-3 py-1 rounded-sm text-xs font-semibold ${value === "Success"
                                ? "bg-green-100 text-green-900"
                                : "bg-red-100 text-red-900"
                                }`}
                        >
                            {value}
                        </span>
                    );
                },
            },
            { accessorKey: "message", header: "Reason" },

            { accessorKey: "created_at", header: "Created At" },

        ],
        []
    );

    useEffect(() => {
        GetQuestions();
    }, [])
    return (
        <div>
            <BasicTables data={data} columns={columns} addbtn={false} title="Bulk Import History" quebtn={true} modulename={"Question"} quepath="/master/question/importFile" editPath="/master/question/questionForm" reports={true} isstudent={false} path="/master/question/questionForm" />


        </div>
    )
}

export default ImportHistoryDetails
