"use client";
import React, { useState } from 'react'

import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
import { CountrySchema } from '@/helper/yupvalidation';
import { commonTitle } from '@/helper/commontitle';
import { Api } from '@/helper/api';
import { createData } from '@/helper/axios';
import { ChevronDownIcon } from '@/icons';
import Select from '@/components/form/Select';
import { toast } from 'react-toastify';
import Loader from '@/helper/loader';
import { useDispatch, useSelector } from 'react-redux';
import { setCountry, setLoading } from '@/redux/slices/country';

const initialValues = {
  country_name: '',
  country_code: '',
  currency_code: '',
  status: '',
}
function CountryForm() {
  const router = useRouter();
  const dispatch = useDispatch();
      const loading = useSelector((state: any) => state.countries.loading);
  const { handleChange, values,setFieldValue, handleSubmit, errors, touched } =
    useFormik({
      initialValues,
      validationSchema: CountrySchema,
      onSubmit: async (value, action) => {
      try {
       dispatch(setLoading(true));
        const payload = {
          ...value
        };

        const res = await createData(Api.addCountry, payload)

        if (res.status === 200) {
          dispatch(setCountry())
          toast.success("Country added successfully");
          action.resetForm();

          router.push("/system/country");
        }
       
        if(res.status === 500){
          toast.error(res.data.data.message);
        }
      } catch (error) {
        toast.error("Failed to add country");
        console.log("API Error", error);
      } 
      finally {
     dispatch(setLoading(false));
      }
    },
    });
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
      <form
        onSubmit={handleSubmit}
        className=" bg-white shadow-lg rounded-xl p-6 space-y-5"
      >
        <h2 className="text-2xl font-semibold text-gray-700 py-3">
          Add Country
        </h2>

        <div className='flex flex-col gap-5'>
          <div className='flex gap-4' >
            <Label className='w-30'>{commonTitle.country}  <span className="text-red-500">*</span></Label>
            <Input type="text" name="country_name" onChange={handleChange} value={values.country_name} />
            
          </div>
          {errors.country_name && touched.country_name && (
              <p className="text-red-500 text-sm mt-1 ms-2">{errors.country_name}</p>
            )}
          <div className='flex gap-4'>
            <Label className='w-30'>{commonTitle.CountryCode}  <span className="text-red-500">*</span></Label>
            <Input type="text" name="country_code" onChange={handleChange} value={values.country_code} />
          

          </div>
            {errors.country_code && touched.country_code && (
              <p className="text-red-500 text-sm mt-1 ms-2">{errors.country_code}</p>
            )}
          <div className='flex gap-4'>
            <Label className='w-30'>{commonTitle.CurrencyCode}  <span className="text-red-500">*</span></Label>
            <Input type="text" name="currency_code" onChange={handleChange} value={values.currency_code} />
        
          </div>
              {errors.currency_code && touched.currency_code && (
              <p className="text-red-500 text-sm mt-1 ms-2">{errors.currency_code}</p>
            )}
          <div className='flex gap-4'>
            <Label className='w-30' >
              {commonTitle.Status} 
            </Label>

             <div className="relative w-1/6">
            <Select
              options={statusoption}
              value={values.status}
              onChange={(value) =>
                setFieldValue(`status`, value)
              }
              placeholder="Select"
              className="dark:bg-dark-900 "
            />

            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              <ChevronDownIcon />
            </span>
          </div>

          
          </div>
           
        </div>

        <div className='flex  gap-5'>
          <Button type='submit' size="sm" variant="primary">
            Save
          </Button>

          <Button size="sm" onClick={() => {
            router.push("/system/country");
          }} variant="outline">
            Cancel
          </Button>
        </div>
      </form>

    </div>
  )
}

export default CountryForm
