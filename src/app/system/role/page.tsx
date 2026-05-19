/* eslint-disable react-hooks/set-state-in-effect */
'use client'
import React, { useEffect, useMemo, useState } from 'react'
import BasicTables from '@/components/tables/BasicTable';
import { deleteData, readData } from '@/helper/axios';
import { Api } from '@/helper/api';
import ResponsiveDialog from '@/helper/deleteModel';
import { toast } from 'react-toastify';
function RolePage() {
    const [data, setData] = useState([])
    const [openDelete, setOpenDelete] = useState(false)
    const [id, setId] = useState("")
    const [loading, setLoading] = useState(false)
    const GetRole = async () => {
        try {
            setLoading(true)
            const res = await readData(Api.getroles, {
                header: {
                    "Content-Type": "application/json",
                },
            })
           
            if (res.status === 200) {

                const formattedData = res.data.filter((item: any) => item.id !== 1).map((item: any) => ({
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
        GetRole();
    }, [])

    const columns = useMemo(
        () => [
            { accessorKey: "role_code", header: "Role Code", Cell: ({ cell }) => cell.getValue() ? cell.getValue() : "-" },
            { accessorKey: "role_name", header: "Role Name", Cell: ({ cell }) => cell.getValue() ? cell.getValue() : "-" },
            { accessorKey: "updatedby", header: "Updated By", Cell: () => "Admin", },
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
            setLoading(true);
            setOpenDelete(false);

            const res = await deleteData(`${Api.deleteRole}/${id}`,);

            if (res.status === 200) {
                toast.success("Role deleted successfully");
                GetRole();
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
            <BasicTables data={data} columns={columns} onDelete={handlepopup} modulename={"Role"} loading={loading} title="Role" editPath="/system/role/roleForm" isstudent={false} path="/system/role/roleForm" />
            <ResponsiveDialog open={openDelete} handleDelete={handleDelete} setOpen={setOpenDelete} />
        </div>
    )
}

export default RolePage
