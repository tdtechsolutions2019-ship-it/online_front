"use client";
import React, { useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { Button, Menu, MenuItem, IconButton } from "@mui/material";
import { mkConfig, generateCsv, download } from "export-to-csv";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdfOutlined';
import Tooltip from "@mui/material/Tooltip";
import TableViewIcon from '@mui/icons-material/TableViewOutlined';
import GridOnIcon from '@mui/icons-material/GridOnOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { usePathname, useRouter } from 'next/navigation';
import { Api } from "@/helper/api";
import { deleteData } from "@/helper/axios";
import Loader from "@/helper/loader";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useSelector } from "react-redux";

export default function DataTable({ data, columns, isstudent, editPath, onDelete, loading, examschedule, setRowSelection, examscheduleList, downloadStudents, modulename, reports, appearreport }: any) {
  console.log("examschedule", appearreport)
  const router = useRouter();
  const [rowSelectiones, setRowSelectionedd] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  // const filename = location.pathname.split("/")[2];
  // console.log("filename",filename)
  const userData = useSelector((state: any) => state.login.user);
  const pathname = usePathname();

  const filename = pathname.split("/")[2];

  console.log("filename", filename);

  // CSV
  const csvConfig = mkConfig({
    fieldSeparator: ",",
    decimalSeparator: ".",
    useKeysAsHeaders: true,
    filename: "data",
  });

  const exportCSV = (data: any[]) => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  // Excel
  const exportExcel = () => {
    // ✅ Headers
    const headers = columns.map((col: any) => col.header);

    // ✅ Rows (with Cell support)
    const rows = data.map((row: any) => {
      const obj: any = {};

      columns.forEach((col: any) => {
        let value = "";

        if (col.Cell) {
          value =
            typeof col.Cell === "function"
              ? col.Cell({
                row: { original: row },
                cell: { getValue: () => row[col.accessorKey] }
              })
              : "";
        } else {
          value = row[col.accessorKey] ?? "";
        }

        obj[col.header] = value;
      });

      return obj;
    });

    // ✅ Create sheet
    const ws = XLSX.utils.json_to_sheet(rows);

    // ✅ Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // ✅ Dynamic file name
    const date = new Date().toISOString().split("T")[0];
    XLSX.writeFile(wb, `${filename}_${date}.xlsx`);
  };

  // PDF
  const exportPDF = () => {
    const doc = new jsPDF();

    const headers = columns.map((col: any) => col.header);

    const body = data.map((row: any) =>
      columns.map((col: any) => {
        console.log("row", row)
        if (col.Cell) {
          return typeof col.Cell === "function"
            ? col.Cell({
              row: { original: row },
              cell: { getValue: () => row[col.accessorKey] }
            })
            : "";
        }
        return row[col.accessorKey] ?? "";
      })
    );

    autoTable(doc, {
      head: [headers],
      body,
    });

    // ✅ dynamic name
    doc.save(`${filename}_${Date.now()}.pdf`);
  };
  console.log("studentdata", isstudent)
  const srNoColumn = {
    header: "Sr. No.",
    size: 60,
    Cell: ({ row, table }: any) => {
      const { pageIndex, pageSize } = table.getState().pagination;

      return pageIndex * pageSize + row.index % pageSize + 1;
    },
  };
  const tableColumns = [srNoColumn, ...columns];

  return (

    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          {loading && (
            <div className="absolute inset-0 flex justify-center items-center bg-white/70 dark:bg-black/50 z-50">
              <Loader />
            </div>
          )}

          <MaterialReactTable
            columns={tableColumns}
            data={data ? data : []}
            enableColumnFilters={true}        // was false, enable it
            enableFilterMatchHighlighting     // highlights matched text
            enableFacetedValues               // shows filter value counts
            columnFilterDisplayMode="popover"
            muiTableBodyRowProps={({ row }) => ({
              sx: {
                opacity: row.original.isblocked === "1" ? 0.5 : 1,
                pointerEvents:
                  row.original.isblocked === "1"
                    ? "none"
                    : "auto",
                backgroundColor:
                  row.original.isblocked === "1"
                    ? "#f5f5f5"
                    : "inherit",
              },
            })}
            {...((examschedule || appearreport) && {
              enableRowSelection: (row) =>
                row.original.isblocked !== "1",
            })}
            enableGlobalFilter
            onRowSelectionChange={(updater) => {
              // update MRT state
              const newSelection =
                updater instanceof Function
                  ? updater(rowSelectiones)
                  : updater;

              setRowSelectionedd(newSelection);

              // get selected rows immediately
              const selectedRows = Object.keys(newSelection).map(
                (index) => data[Number(index)]
              );
              setRowSelection(selectedRows);

            }}
            initialState={{
              columnPinning: {
                right: ["mrt-row-actions"], // ✅ actions fixed right
              },
            }}
            enableRowActions={examschedule || reports ? false : true}
            enablePagination
            state={{ pagination, rowSelection: rowSelectiones, }}
            onPaginationChange={setPagination}
            enableColumnOrdering
            positionActionsColumn="last"
            displayColumnDefOptions={{
              "mrt-row-actions": {
                header: "Actions",
                size: 90,
                minSize: 80,
                maxSize: 110,
              },
            }}
            enableHiding={false}
            renderTopToolbarCustomActions={({ table }) => {
              return examschedule ? (
                <div className="flex items-center justify-center rounded-lg border border-gray-300  bg-white text-gray-700  hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03 me-5 cursor-pointer">
                  <button
                    className="px-5 py-3  flex items-center justify-center text-sm text-gray-500 dark:text-gray-400"

                    onClick={() => {
                      const selectedRows = table.getSelectedRowModel().rows;
                      const selectedData = selectedRows.map(row => row.original);
                      setRowSelection(selectedData);
                      console.log(selectedData);
                    }}
                  >
                    <AddOutlinedIcon fontSize="small" /> Select
                  </button>
                </div>
              ) : (
                <div className="flex justify-start">
                  <Tooltip title="Excel">
                    <IconButton onClick={exportExcel}>
                      <TableViewIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="PDF">
                    <IconButton onClick={exportPDF}>
                      <PictureAsPdfIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              );
            }}

            renderRowActions={({ row }) => {
              return (

                <>

                  <div className="flex items-center gap-1">
                    {userData?.permissions[modulename]?.export ? <>
                      {isstudent || examscheduleList ?
                        <Tooltip title="Download">
                          <IconButton size="small" onClick={() => downloadStudents(row.original.id)}>
                            <FileDownloadOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip> : ""
                      }
                    </> : ""}
                    {userData?.permissions[modulename]?.view ? <>

                      <Tooltip title="View">
                        <IconButton size="small">
                          <RemoveRedEyeOutlinedIcon onClick={() => {
                            router.push(`${editPath}/${row.original.id}?mode=view`);
                          }} fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </> : ""}
                    {userData?.permissions[modulename]?.edit ? <>

                      {examscheduleList ? "" : <Tooltip title="Edit">
                        <IconButton size="small">
                          <EditOutlinedIcon onClick={() => {
                            router.push(`${editPath}/${row.original.id}?mode=edit`);

                          }} fontSize="small" />
                        </IconButton>
                      </Tooltip>}
                    </> : ""}
                    {userData?.permissions[modulename]?.delete ? <>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error">
                          <DeleteOutlineOutlinedIcon onClick={() => onDelete(row.original.id)} fontSize="small" />
                        </IconButton>
                      </Tooltip>

                    </> : ""}
                  </div>
                </>
              )
            }}
          />
        </div>
      </div>
    </div>

  );
}