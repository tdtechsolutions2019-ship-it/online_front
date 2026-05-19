/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import BasicTables from '@/components/tables/BasicTable';
import { Modal } from '@/components/ui/modal';
import { Api } from '@/helper/api';
import { createData, deleteData, readData } from '@/helper/axios';
import ResponsiveDialog from '@/helper/deleteModel';
import React, { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify';
import ImportState from '../../../../importfileui/importState';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { fetchStatesIfNeeded } from '@/redux/services/commonAPIService';
import { removeState, setGroupedState } from '@/redux/slices/state';

const StateListPage = () => {
  const [data, setData] = useState<any[]>([])
  const [openDelete, setOpenDelete] = useState(false)
  const [id, setId] = useState("")
  const [importmodal, setImportModal] = useState(false)
  const [loading, setLoading] = useState(false)
   const [error, setError] = useState(null);
  const states = useSelector((state: any) => state.states.groups);
  const dispatch = useDispatch();
  const store = useStore();

  // Removed local GetState - use Redux data
  const tableData = useMemo(() => {
    if (!states?.length) return [];
    return states.flatMap((group: any) =>
      group.states.map((stateItem: any) => ({
        country_name: group.country_name,
        id: stateItem.id,
        state_name: stateItem.state_name,
        gst_code: stateItem.gst_code,
        status: stateItem.status === "1" ? "Active" : "Inactive",
      }))
    );
  }, [states]);

  useEffect(() => {
    setData(tableData);
  }, [tableData]);
  useEffect(() => {
    if (!states?.length) {
      fetchStatesIfNeeded(dispatch, store?.getState);
    }
  }, []);
  const columns = useMemo(
    () => [
      { accessorKey: "country_name", header: "Country Name", Cell: ({ cell }) => cell.getValue() ? cell.getValue() : "-" },
      { accessorKey: "state_name", header: "State Name", Cell: ({ cell }) => cell.getValue() ? cell.getValue() : "-" },
      { accessorKey: "gst_code", header: "State Code", Cell: ({ cell }) => cell.getValue() ? cell.getValue() : "-" },
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

      const res = await deleteData(
        `${Api.deleteState}/${id}`,
      );
    


      if (res.status === 200) {
        dispatch(removeState(Number(id)));
        toast.success("State deleted successfully");
      }

    } catch (error) {
      console.log(error);
      toast.error("Failed to delete state");
    }
  };

  const handlepopup = (id: string) => {
    setId(id);
    setOpenDelete(true);
  };


  const handleImportFile = async (file: File) => {
  

    // Option 1: send to backend
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await createData(
        Api.importState,
        formData
      )

      if (res?.status === 200) {
        toast.success("State imported successfully");
        fetchStatesIfNeeded(dispatch, store?.getState);
        dispatch(setGroupedState())
        setImportModal(false);

      }
    } catch (error) {
      console.log("error", error)
    }


  };
  return (
    <div>
      <BasicTables data={data} columns={columns} modulename={"State"} title="State" isstudent={false} loading={loading} onDelete={handlepopup} importbtn={true} editPath="/system/state/stateForm" path="/system/state/stateForm" modalopen={importmodal} setmodalopen={setImportModal} />
      <ResponsiveDialog open={openDelete} handleDelete={handleDelete} setOpen={setOpenDelete} />
      <Modal isOpen={importmodal} onClose={() => setImportModal(false)}>
        <ImportState error={error} setError={setError} onClose={() => setImportModal(false)} onImport={handleImportFile} templateUrl='/state_template.xlsx' />
      </Modal>
    </div>
  )
}

export default StateListPage
