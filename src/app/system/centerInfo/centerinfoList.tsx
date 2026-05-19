"use client";
import BasicTables from '@/components/tables/BasicTable';
import { Api } from '@/helper/api';
import { deleteData, readData } from '@/helper/axios';
import ResponsiveDialog from '@/helper/deleteModel';
import { fetchCenterIfNeeded, fetchCountriesIfNeeded } from '@/redux/services/commonAPIService';
import { removeCenterInfo } from '@/redux/slices/centerInfo';
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux';
import { toast } from 'react-toastify';

const CenterInfoListPage = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [openDelete, setOpenDelete] = useState(false)
    const [id, setId] = useState("")
    const center = useSelector((state: any) => state.centerInfo.list);
    console.log("center", center)
    const dispatch = useDispatch();
    const store = useStore();

    useEffect(() => {
        if (!center?.length) {
            fetchCenterIfNeeded(dispatch, store?.getState);
        }
    }, [center]);

    const columns = useMemo(
        () => [
            {
  header: "Center Name",
  accessorFn: (row) => {
    const code = row.center_code || "";
    const name = row.center_name || "";

    if (!code && !name) return "-";

    return `${code}${code && name ? " - " : ""}${name}`;
  },
},
            { accessorKey: "contact_person1", header: "Center Person", Cell: ({ cell }) => cell.getValue() ? cell.getValue() : "-" },
            { accessorKey: "state_name", header: "State", Cell: ({ cell }) => cell.getValue() ? cell.getValue() : "-" },
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

            const res = await deleteData(`${Api.deleteCenterInfo}/${id}`,);

            if (res.status === 200) {
                toast.success("Center Info deleted successfully");
                dispatch(removeCenterInfo(id));
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
            <BasicTables data={center} columns={columns} title="Center Info" modulename={"Center Info"} onDelete={handlepopup} loading={loading} editPath="/system/centerInfo/centerInfoForm" isstudent={false} path="/system/centerInfo/centerInfoForm" />
            <ResponsiveDialog open={openDelete} handleDelete={handleDelete} setOpen={setOpenDelete} />
        </div>
    )
}

export default CenterInfoListPage
