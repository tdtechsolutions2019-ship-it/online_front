import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Next.js Basic Table | SmartQuiz - Next.js Dashboard Template",
  description:
    "This is Next.js Basic Table  page for SmartQuiz  Tailwind CSS Admin Dashboard Template",
  // other metadata
};
interface BasicTablesProps {
  data?: any[];
  columns?: any[];
  title?: string;
  isstudent?: boolean;
  path?: string;
}

export default function BasicTables({ data = [],
  columns = [],
  title = "Basic Table",
  isstudent = false,
  path = "",
}: BasicTablesProps) {
  return (
    <div>
      <PageBreadcrumb pageTitle={title} />
      <div className="space-y-6">
        <ComponentCard title={title} path={path}>
          <BasicTableOne data={data} columns={columns} isstudent={isstudent} />
        </ComponentCard>
      </div>
    </div>
  );
}
