/* eslint-disable react-hooks/set-state-in-effect */
"use client"


import BasicTables from '@/components/tables/BasicTable';
import { Api } from '@/helper/api';
import { deleteData, readData } from '@/helper/axios';
import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation';
import AlertDialogSlide from '@/helper/model';
import ResponsiveDialog from '@/helper/deleteModel';
import { toast } from 'react-toastify';
import { Modal } from '@/components/ui/modal';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { removeCountry, setCountry } from '@/redux/slices/country';
import { fetchCountriesIfNeeded } from '@/redux/services/commonAPIService';


function CountryListPage() {
    const [deleteMessage, setDeleteMessage] = useState("");
    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false)
    const [id, setId] = useState("")
    const [loading, setLoading] = useState(false);
    const countries = useSelector((state: any) => state.countries.list);
    const dispatch = useDispatch();
    const store = useStore();

    const columns = useMemo(
        () => [
            { accessorKey: "country_name", header: "Country Name", Cell: ({ cell }) => cell.getValue() ? cell.getValue() : "-" },
            { accessorKey: "country_code", header: "Country Code", Cell: ({ cell }) => cell.getValue() ? cell.getValue() : "-" },
            { accessorKey: "currency_code", header: "Currency Code", Cell: ({ cell }) => cell.getValue() ? cell.getValue() : "-" },
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

            const res = await deleteData(`${Api.deleteCountry}/${id}`,
            );

            if (!res?.data?.data?.canDelete && res?.data?.status == 400) {
                setDeleteMessage(res?.data?.message || "This country cannot be deleted.");
                setOpen(true);
                return;
            }
            if (res.status === 200) {
                toast.success("Country deleted successfully");
                dispatch(removeCountry(id));
            }

        } catch (error) {
            console.log(error);
            toast.error("Failed to delete country");
        }
    };

    const handlepopup = (id: string) => {
        setId(id);
        setOpenDelete(true);
    };

    useEffect(() => {
        if (!countries?.length) {
            fetchCountriesIfNeeded(dispatch, store?.getState);
        }
    }, []);
    console.log("countries", countries)
    return (
        <div>
            <BasicTables data={countries} columns={columns} modulename={"Country"} title="Country" onDelete={handlepopup} loading={loading} editPath="/system/country/countryForm" importbtn={false} isstudent={false} path="/system/country/countryForm" />
            <AlertDialogSlide open={open} setOpen={setOpen} deleteMessage={deleteMessage} onClose={() => setOpen(false)} />
            <ResponsiveDialog open={openDelete} handleDelete={handleDelete} setOpen={setOpenDelete} />
        </div>
    )
}

export default CountryListPage
