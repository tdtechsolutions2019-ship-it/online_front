import BasicTables from '@/components/tables/BasicTable'
import React, { useMemo } from 'react'

interface SelectedStudentProps {
    scedualdata?: any[];
    isViewMode?: boolean;
}
function SelectedStudent({
    scedualdata = [],
    isViewMode = false,
}: SelectedStudentProps) {

    const columns = useMemo(
        () => [
            { accessorKey: "IdNo", header: "Id No", size: 50 },
            { accessorKey: "student_name", header: "Student Name", size: 100 },
            { accessorKey: "course_code", header: "Course Code", size: 100 },

        ],
        []
    );


    return (
        <div>
            {scedualdata && scedualdata.length > 0 ?
                <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-500 text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-[12px]">Sr.No</th>
                            {!isViewMode && <th className="px-6 py-3 text-left text-sm font-semibold text-[12px]">Id No</th>}
                            <th className="px-6 py-3 text-left text-sm font-semibold text-[12px]">Student Name</th>
                            {!isViewMode && <th className="px-6 py-3 text-left text-sm font-semibold text-[12px]">Course Code</th>}
                            {isViewMode && <th className="px-6 py-3 text-left text-sm font-semibold text-[12px]">UserName</th>}
                            {isViewMode && <th className="px-6 py-3 text-left text-sm font-semibold text-[12px]">Password</th>}
                        </tr>
                    </thead>

                    <tbody className="bg-white text-gray-700">

                        {scedualdata?.map((item: any, i: any) => {

                            return (
                                <>
                                    <tr className="border-t hover:bg-gray-100">
                                        <td className="px-6 py-3 text-[12px]">{i + 1}</td>
                                        {!isViewMode && <td className="px-6 py-3 text-[12px]">{item.identity_no}</td>}
                                        <td className="px-6 py-3 text-[12px] capitalize">{item.student_name}</td>
                                        {!isViewMode && <td className="px-6 py-3 text-[12px] capitalize">{item.course_code ? item.course_code : item.course_name}</td>}
                                        {isViewMode && <td className="px-6 py-3 text-[12px] capitalize">{item.username}</td>}
                                        {isViewMode && <td className="px-6 py-3 text-[12px] capitalize">{item.password}</td>}
                                    </tr>
                                </>
                            )
                        })}

                    </tbody>
                </table> : <div className='text-center w-full'>No Data</div>}
        </div>
    )
}

export default SelectedStudent
