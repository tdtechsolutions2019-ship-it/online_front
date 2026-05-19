"use client";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Basic Table | SmartQuiz - Next.js Dashboard Template",
  description:
    "This is Next.js Basic Table  page for SmartQuiz  Tailwind CSS Admin Dashboard Template",
  // other metadata
};

export default function BasicTables({ data, columns, title, isstudent, editPath, path, onDelete, modalopen, setmodalopen, importbtn, loading, quebtn, quepath, examschedule, reports, addbtn, rowSelection, setRowSelection, selectstudent, tableRef, examscheduleList, downloadStudents, modulename, showfilter, setfilter, filterComponent, filterbtn, filterProps, appearreport, releaseStudents }: any) {
  return (
    <div>
      {examschedule || !isstudent ? "" : <PageBreadcrumb pageTitle={title} />}

      <div className="space-y-6">
        <ComponentCard title={title} path={path} modalopen={modalopen} modulename={modulename} importbtn={importbtn} quebtn={quebtn} setmodalopen={setmodalopen} addbtn={addbtn} quepath={quepath} selectstudent={selectstudent} showfilter={showfilter} setfilter={setfilter} filterComponent={filterComponent} filterbtn={filterbtn} filterProps={filterProps} appearreport={appearreport} releaseStudents={releaseStudents}>
          <BasicTableOne data={data} columns={columns} isstudent={isstudent} modulename={modulename} editPath={editPath} onDelete={onDelete} downloadStudents={downloadStudents} loading={loading} examschedule={examschedule} reports={reports} appearreport={appearreport} setRowSelection={setRowSelection} rowSelection={rowSelection} tableRef={tableRef} examscheduleList={examscheduleList} />
        </ComponentCard>
      </div>
    </div>
  );
}
