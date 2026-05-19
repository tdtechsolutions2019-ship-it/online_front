"use client";
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import { Api } from '@/helper/api';
import { createData } from '@/helper/axios';
import { retestTitle } from '@/helper/commontitle';
import { RetestSchema } from '@/helper/yupvalidation';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from 'react-toastify';
const initialValues = {
    isCCC: false,
    passingMarks: "",
    totalMarks: "",
}
const ResetForm = () => {
        const router = useRouter();
      const [loading, setLoading] = useState(false);
    const { handleChange, values, handleSubmit, errors, touched } =
        useFormik({
            initialValues,
            validationSchema: RetestSchema,
            onSubmit: async (value, action) => {
                 try {
                   setLoading(true);
                   const payload = {
                     ...value
                   };
           
                   const res = await createData(Api.addRetest, payload)
           
                   if (res.status === 200) {
                     toast.success("Retest added successfully");
           
                     action.resetForm();
           
                     router.push("/system/retest");
                   }
                 } catch (error) {
                   toast.error("Failed to add retest");
                   console.log("API Error", error);
                 } 
                 finally {
                   setLoading(false);
                 }
               },
        });

    return (
        <div>
            <form onSubmit={handleSubmit} className='bg-white shadow-lg rounded-xl p-6 space-y-5'>
                <h2 className="text-2xl font-semibold text-gray-700 py-3">
                    Add Retest
                </h2>


                <div className='flex items-center gap-5 '>
                    <div >
                       <div className='flex items-center gap-5 '>
                         <Label>{retestTitle.passing_marks} <span className="text-red-500">*</span></Label>
                        <Input type="text" name="passingMarks" onChange={handleChange} value={values.passingMarks} />
                        
                       </div>
                       {errors.passingMarks && touched.passingMarks && (
                            <p className="text-red-500 text-sm mt-1 ms-2">{errors.passingMarks}</p>
                        )}
                    </div>

                    <div >
                       <div className='flex items-center gap-5'>
                         <Label>{retestTitle.total_marks} <span className="text-red-500">*</span></Label>
                        <Input type="text" name="totalMarks" onChange={handleChange} value={values.totalMarks} />
                        
                       </div>
                       {errors.totalMarks && touched.totalMarks && (
                            <p className="text-red-500 text-sm mt-1 ms-2">{errors.totalMarks}</p>
                        )}
                    </div>
                </div>
                <div >
                   <div className='flex items-center gap-5'>
                     <Label>{retestTitle.isCCC}</Label>
                    <input
                        type="checkbox"
                        name="isCCC"
                        onChange={handleChange}
                        checked={values.isCCC}
                    />
                   </div>
                      
                </div>
                <div className='flex gap-5'>
                    <Button type='submit' size="sm" variant="primary">
                        Save
                    </Button>

                    <Button size="sm" onClick={() => {
                        router.push("/system/retest");
                    }} variant="outline">
                        Cancel
                    </Button>
                </div>

            </form>
        </div>
    )
}

export default ResetForm
