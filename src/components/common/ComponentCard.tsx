"use client";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Link from "next/link";
import React from "react";
import ImportExportOutlinedIcon from '@mui/icons-material/ImportExportOutlined';
import Button from "../ui/button/Button";
import { useRouter } from "next/navigation";
import { useAuth } from '@/app/auth/authcontext';
import { canAccess } from '../../../utiles/rbac';
import { useSelector } from 'react-redux';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  desc?: string;
  path?: string;
  modalopen?: boolean;        // Changed to optional
  setmodalopen?: any;         // Changed to optional
  importbtn?: boolean;
  quebtn?: boolean;
  quepath?: string;
  addbtn?: boolean;
  selectstudent?: boolean;
  modulename?: string;
  showfilter?: boolean;
  setfilter?: any;
  filterComponent?: React.ComponentType<any>; // Changed to optional
  filterbtn?: boolean;
  filterProps?: any;
  appearreport?: boolean;
  releaseStudents?: any;
}
const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
  path = "",
  modalopen,
  setmodalopen,
  importbtn,
  quebtn,
  quepath,
  addbtn,
  selectstudent,
  modulename,
  showfilter,
  filterbtn,
  setfilter,
  filterProps,
  appearreport,
  releaseStudents,
  filterComponent: FilterComponent
}) => {
  const userData = useSelector((state: any) => state.login.user);
  console.log("userData", userData)
  const router = useRouter();
  console.log("modulename", filterbtn)
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {/* Card Header */}
      <div className="px-6 py-5 flex items-center justify-between">
        <div>
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            {title}
          </h3>
          {desc && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {desc}
            </p>
          )}
        </div>
        <div className="flex align-center">

          {userData?.permissions[modulename]?.import ? <>{importbtn && <div className="flex items-center justify-center rounded-lg  bg-white text-gray-700  hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03 me-5 cursor-pointer">
            <Button size="sm" variant="outline" onClick={() => { quebtn ? router.push(quepath) : setmodalopen(true) }} className=" px-5 py-3 w-35 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">   <ImportExportOutlinedIcon fontSize="small" /> Import</Button>
          </div>
          }</> : ""}
          <div className="flex items-center justify-center rounded-lg  bg-white text-gray-700   dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03 me-5 cursor-pointer">
            {filterbtn &&
              <FilterAltIcon fontSize="small" onClick={() => setfilter(!showfilter)} />}

          </div>
          <div className="flex items-center justify-center rounded-lg  bg-white text-gray-700   dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03 me-5 cursor-pointer">
            {appearreport &&
              <Button onClick={() => releaseStudents()} size="sm" variant="outline" className=" px-5 py-3 w-35 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                <NewReleasesIcon fontSize="small" /> Release
              </Button>}

          </div>
          {userData?.permissions[modulename]?.add ? <>{addbtn !== false &&
            <div className="flex items-center justify-center rounded-lg  bg-white text-gray-700  hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03 me-5 cursor-pointer">
              <Button onClick={() => router.push(path)} size="sm" variant="outline" className=" px-5 py-3 w-35 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                <AddOutlinedIcon fontSize="small" /> Add
              </Button>
            </div>}</> : ""}

        </div>

      </div>
      {showfilter && FilterComponent ? <div className='p-5'> <FilterComponent {...filterProps} /> </div> : <></>}
      {/* Card Body */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;
