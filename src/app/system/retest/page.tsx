/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import BasicTables from '@/components/tables/BasicTable';
import { Api } from '@/helper/api';
import { readData } from '@/helper/axios';
import { log } from 'console';
import React, { useEffect, useMemo, useState } from 'react'

const RetestPage = () => {
  const [users, setUsers] = useState([]);
  const getRetest = async () => {
    try {
      const res = await readData(Api.getRetest, {
        header: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 200) {
        const data = res.data;

        const result: any[] = [];
        let temp: any = {};
    
        data.forEach((item: any, index: number) => {


          if (item.key !== "startDate" && item.key !== "endDate" && item.key !== "adminReportEmail" && item.key !== "isCentralHead" && item.key !== "adminEmail" && item.key !== "complexityLevel") {
            if (item.value !== null && item.value !== undefined && item.value !== "") {
              if (item.key === "isCCC") {
                temp[item.key] = item.value === "1" ? "Yes" : "No";
              } else {
                temp[item.key] = item.value;
              }
            }
          }
        
          // every 3 items = one row
          if (Object.keys(temp).length > 0) {
            if ((index + 1) % 3 === 0) {
              result.push(temp);
              temp = {};
            }
          }
        });

        setUsers(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRetest();
  }, []);

  const columns = useMemo(
    () => [
      { accessorKey: "isCCC", header: "is CCC" },
      { accessorKey: "passingMarks", header: "Passing Marks" },
      { accessorKey: "totalMarks", header: "Total Marks" },
    ],
    []
  );
  return (
    <div>
      <BasicTables data={users} columns={columns} title="Retest" modulename={"Re-test Criteria"} editPath="/system/retest/retestForm" importbtn={false} isstudent={false} path="/system/retest/retestForm" />
    </div>
  )
}

export default RetestPage
