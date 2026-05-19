"use client"
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import Button from '@/components/ui/button/Button';
import { Api } from '@/helper/api';
import { createData, readData, updateData } from '@/helper/axios';
import { commonTitle } from '@/helper/commontitle';
import Loader from '@/helper/loader';
import { CountrySchema } from '@/helper/yupvalidation';
import { ChevronDownIcon } from '@/icons';
import { setCountry, setLoading } from '@/redux/slices/country';
import { useFormik } from 'formik';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const CountryEditForm = () => {
  const params = useParams<{ id: string }>();
  const { id } = params;
  const initialValues = {
    country_name: '',
    country_code: '',
    currency_code: '',
    status: '',
  }
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const isViewMode = mode === "view";
  const dispatch = useDispatch();
  const loading = useSelector((state: any) => state.countries.loading);

  const { handleChange, values, handleSubmit, setFieldValue, errors, touched, setValues } =
    useFormik({
      initialValues,
      validationSchema: CountrySchema,
      onSubmit: async (value, action) => {
        try {
          dispatch(setLoading(true));
          const payload = {
            ...value
          };

          const res = await updateData(`${Api.updateCountry}/${id}`,payload,);
  
          if (res.status === 200) {
            dispatch(setCountry())
            toast.success("Country updated successfully");

            action.resetForm();

            router.push("/system/country");
          }
           if(res.status === 500){
                    toast.error(res.data.data.message);
                  }
          
        } catch (error) {
          console.log("API Error", error);
          toast.error("Failed to update country");
        }
        finally {
          dispatch(setLoading(false));
        }
      },
    });

  const getCountry = async () => {
    try {
      setLoading(true);
      const res = await readData(`${Api.getCountryById}/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("res", res)
      setValues({
        country_name: res.data[0].country_name || "",
        country_code: res.data[0].country_code || "",
        currency_code: res.data[0].currency_code || "",
        status: res.data[0].status ? String(res.data[0].status) : "1",
      });
    } catch (error) {
      console.log("Fetch Error", error);
    }
    finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (id) {
      getCountry();
    }
  }, [id]);
  console.log("formik values", values);
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
          {isViewMode ? "View" : "Edit"} Country
        </h2>

        <div className='flex flex-col gap-5'>
          <div className='flex gap-4' >
            <Label className='w-30'>{commonTitle.country}  <span className="text-red-500">*</span></Label>
            <Input type="text" name="country_name" disabled={isViewMode} onChange={handleChange} value={values.country_name} />

          </div>
          {errors.country_name && touched.country_name && (
            <p className="text-red-500 text-sm mt-1 ms-2">{errors.country_name}</p>
          )}
          <div className='flex gap-4'>
            <Label className='w-30'>{commonTitle.CountryCode}  <span className="text-red-500">*</span></Label>
            <Input type="text" name="country_code" disabled={isViewMode} onChange={handleChange} value={values.country_code} />

 
          </div>
          {errors.country_code && touched.country_code && (
            <p className="text-red-500 text-sm mt-1 ms-2">{errors.country_code}</p>
          )}
          <div className='flex gap-4'>
            <Label className='w-30'>{commonTitle.CurrencyCode}  <span className="text-red-500">*</span></Label>
            <Input type="text" name="currency_code" disabled={isViewMode} onChange={handleChange} value={values.currency_code} />

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
                disable={isViewMode}
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

        <div className='flex gap-5'>
          {
            !isViewMode && (
                <Button type='submit' size="sm" variant="primary">
            Save
          </Button>
            )
        }

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

export default CountryEditForm
