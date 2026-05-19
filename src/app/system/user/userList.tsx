"use client"
import BasicTables from '@/components/tables/BasicTable';
import { Api } from '@/helper/api';
import { deleteData, readData } from '@/helper/axios';
import ResponsiveDialog from '@/helper/deleteModel';
import React, { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify';

const UserListPage = () => {
  const [data, setData] = useState([])
  const [openDelete, setOpenDelete] = useState(false)
  const [id, setId] = useState("")
  const [loading, setLoading] = useState(false)

  const GetUser = async () => {
    try {
      setLoading(true)
      const res = await readData(Api.getuser, {
        header: {
          "Content-Type": "application/json",
        },
      })
      console.log("res", res)
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

  console.log("data", data)
  const columns = useMemo(
    () => [
      { accessorKey: "role_name", header: "Role Name", Cell: ({ cell }) => cell.getValue() ? cell.getValue() : "-" },
      { accessorKey: "username", header: "User Name", Cell: ({ cell }) => cell.getValue() ? cell.getValue() : "-" },
      { accessorKey: "first_name", header: "First Name", Cell: ({ cell }) => cell.getValue() ? cell.getValue() : "-" },
      { accessorKey: "last_name", header: "Last Name", Cell: ({ cell }) => cell.getValue() ? cell.getValue() : "-" },
      { accessorKey: "email", header: "Email", Cell: ({ cell }) => cell.getValue() ? cell.getValue() : "-" },
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

      const res = await deleteData(`${Api.deleteuser}/${id}`,);

      if (res.status === 200) {
        toast.success("User deleted successfully");
        GetUser()
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

  useEffect(() => {
    GetUser();
  }, [])
  return (
    <div>
      <BasicTables data={data} columns={columns} title="User" onDelete={handlepopup} modulename={"User"} editPath="/system/user/userForm" importbtn={false} isstudent={false} path="/system/user/userForm" />
      <ResponsiveDialog open={openDelete} handleDelete={handleDelete} setOpen={setOpenDelete} />

    </div>
  )
}

export default UserListPage
