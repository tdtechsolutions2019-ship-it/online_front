"use client";
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import Button from '@/components/ui/button/Button';
import { Api } from '@/helper/api';
import { readData, updateData } from '@/helper/axios';
import { commonTitle, subjectTitle } from '@/helper/commontitle';
import Loader from '@/helper/loader';
import { subjectPageSchema } from '@/helper/yupvalidation';
import { ChevronDownIcon } from '@/icons';
import { setLoading, setSubject } from '@/redux/slices/subject';
import { useFormik } from 'formik';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
const initialValues = {
  subject_name: '',
  description: '',
  status: '',
}
const SubjectUpdateForm = () => {
  const router = useRouter();
  const loading = useSelector((state: any) => state.subject.loading);
  const params = useParams<{ id: string }>();
  const { id } = params;
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const isViewMode = mode === "view";
  const dispatch = useDispatch();
  const { handleChange, values, setFieldValue, handleSubmit, setValues, errors, touched } =
    useFormik({
      initialValues,
      validationSchema: subjectPageSchema,
      onSubmit: async (value, action) => {
        
        try {
          dispatch(setLoading(true));
          const payload = {
            ...value
          };

          const res = await updateData(`${Api.updateSubject}/${id}`, payload);

          if (res.status === 200) {
            dispatch(setSubject())
            toast.success("Subject Update successfully");

            action.resetForm();

            router.push("/master/subject");
          }
        } catch (error) {
          toast.error("Failed to Update subject");
          console.log("API Error", error);
        }
        finally {
          dispatch(setLoading(false));
        }
      },
    });

  const getSubject = async () => {
    try {
      dispatch(setLoading(true));
      const res = await readData(`${Api.getSubjectByid}/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
     
      const data = res.data[0] || {};
  
      setValues({
        subject_name: data.subject_name || "",
        description: data.description || "",
        status: data.status ? String(data.status) : "1",
      });
    } catch (error) {
      console.log("Fetch Error", error);
    }
    finally {
      dispatch(setLoading(false));
    }
  };
  useEffect(() => {
    if (id) {
      getSubject();
    }
  }, [id]);

  const statusoption = [
    { label: "Active", value: "1" },
    { label: "Inactive", value: "0" }
  ];

  return (
    <div>
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-white/70 dark:bg-black/50 z-50">
          <Loader />
        </div>
      )}
      <form onSubmit={handleSubmit} className=" bg-white shadow-lg rounded-xl p-6 space-y-5">
        <h2 className="text-2xl font-semibold text-gray-700 py-3">
          {isViewMode ? "View" : "Update"} Subject
        </h2>
        <div className='flex flex-col gap-5'>
          <div className='grid grid-cols-[10%_40%]' >
            <div>

              <Label className='w-30'>{subjectTitle.subject_name}  <span className="text-red-500">*</span></Label>
            </div>
            <div>
              <Input type="text" name="subject_name" disabled={isViewMode} onChange={handleChange} value={values.subject_name} />
              {errors.subject_name && touched.subject_name && (
                <p className="text-red-500 text-sm mt-1 ms-2">{errors.subject_name}</p>
              )}
            </div>

          </div>

          <div className='grid grid-cols-[10%_40%]'>
            <div>

              <Label className='w-30'>{subjectTitle.description} <span className="text-red-500">*</span> </Label>
            </div>
            <div>
              <TextArea className='w-full h-28' name="description" disabled={isViewMode} placeholder='Enter Description' onChange={handleChange} value={values.description} />
              {errors.description && touched.description && (
                <p className="text-red-500 text-sm mt-1 ms-2">{errors.description}</p>
              )}
            </div>
          </div>

          <div className='grid grid-cols-[10%_40%]'>
            <Label className='w-30' >
              {commonTitle.Status}
            </Label>

            <div className="relative">
              <Select
                options={statusoption}
                value={values.status}
                onChange={(value) =>
                  setFieldValue(`status`, value)
                }
                disable={isViewMode}
                placeholder="Select"
                className="dark:bg-dark-900 "
              />

              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <ChevronDownIcon />
              </span>

            </div>
          </div>
        </div>
        <div className='flex gap-5'>
          {
            !isViewMode && (
              <Button size="sm" type="submit">
                Save
              </Button>
            )
          }

          <Button size="sm" onClick={() => {
            router.push("/master/subject");
          }} variant="outline">
            Cancel
          </Button>
        </div>
      </form>

    </div>
  )
}

export default SubjectUpdateForm
