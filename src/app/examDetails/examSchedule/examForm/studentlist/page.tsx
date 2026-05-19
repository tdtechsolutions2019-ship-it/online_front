import BasicTables from '@/components/tables/BasicTable'
import React, { useMemo } from 'react'

function StudentList({ studentlist, rowSelection, setRowSelection, tableRef }: any) {
    console.log("studentlist", studentlist)
    const columns = useMemo(
        () => [
            { accessorKey: "identity_no", header: "Id No" },
            { accessorKey: "student_name", header: "Student Name" },
            { accessorKey: "joining_month", header: "Joining Month" },
            { accessorKey: "joining_year", header: "Registration Month" },
            { accessorKey: "course_code", header: "Course Code" },

        ],
        []
    );
    return (
        <div>
            <BasicTables data={studentlist} addbtn={false} columns={columns} title="Students List" examschedule={true} importbtn={false} isstudent={false} path="/examDetails/examSchedule/examForm" setRowSelection={setRowSelection} rowSelection={rowSelection} selectstudent={true} tableRef={tableRef} />
        </div>
    )
}

export default StudentList
