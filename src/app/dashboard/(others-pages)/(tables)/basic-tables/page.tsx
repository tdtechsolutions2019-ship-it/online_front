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

export default function BasicTables({data, columns, title, isstudent, path}:any) {
  return (
    <div>
      <PageBreadcrumb pageTitle={title} />
      <div className="space-y-6">
        <ComponentCard title={title} path={path}>
          <BasicTableOne data={data} columns={columns} isstudent={isstudent}/>
        </ComponentCard>
      </div>
    </div>
  );
}
