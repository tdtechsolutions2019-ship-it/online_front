/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import Button from '@/components/ui/button/Button';
import { ChevronDownIcon } from '@/icons';
import { useFormik } from 'formik';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/dist/client/components/navigation';
import { StateSchema } from '@/helper/yupvalidation';
import { commonTitle, statecommonTitle } from '@/helper/commontitle';
import Label from '@/components/form/Label';
import { createData, readData } from '@/helper/axios';
import { Api } from '@/helper/api';
import { toast } from 'react-toastify';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { fetchCountriesIfNeeded } from '@/redux/services/commonAPIService';

import Loader from '@/helper/loader';
import { setGroupedState, setLoading } from '@/redux/slices/state';
const initialValues = {
  country_id: "",
  states: [
    { state_name: "", gst_code: "", status: "", }
  ],
}
const StateForm = () => {
  const router = useRouter();
  const countries = useSelector((state: any) => state.countries.list);
    const loading = useSelector((state: any) => state.states.loading);
  
  const dispatch = useDispatch();
  const store = useStore();
  const countryOptions = countries.map((country: any) => ({
    value: country.id,
    label: country.country_name,
  }));


  const { handleChange, values, handleSubmit, errors, touched, setFieldValue } =
    useFormik({
      initialValues,
      validationSchema: StateSchema,
      onSubmit: async (value, action) => {
        try {
          dispatch(setLoading(true))
                const payload = {
                  ...value
                };
               
        
                const res = await createData(
                  Api.addState,
                  payload,
                );
       
                if (res.status === 200) {
                  dispatch(setGroupedState())
                  toast.success("State added successfully");
        
                  action.resetForm();
        
                  router.push("/system/state");
                }
                 if(res.status === 500){
                          toast.error(res.data.data.message);
                        }
              } catch (error) {
                console.log("API Error", error);
                toast.error("Failed to add state");
              } 
              finally {
                dispatch(setLoading(false))
              }
      }
    });
  const addRow = () => {
    setFieldValue("states", [
      ...values.states,
      { state_name: "", gst_code: "" , status: values.states[0]?.status, },
    ]);
  };
  const removeRow = (index: number) => {
    const updated = [...values.states];
    updated.splice(index, 1);
    setFieldValue("states", updated);
  };
  const statusoption = [
    { label: "Active", value: "1" },
    { label: "Inactive", value: "0" }
  ];

  useEffect(() => {
    if (!countries?.length) {
      fetchCountriesIfNeeded(dispatch, store?.getState);
    }
  }, [countries]);

  return (
    <div>
       {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-white/70 dark:bg-black/50 z-50">
          <Loader />
        </div>
      )}
    <form onSubmit={handleSubmit} className='bg-white shadow-lg rounded-xl p-6 space-y-5' >
      <h2 className="text-2xl font-semibold text-gray-700 py-3">
        Add State
      </h2>
      <div className='grid grid-cols-[30%_70%] gap-5 '>
        <div className='mb-5 '>
          <Label className='w-2/5'>{commonTitle.country}<span className="text-red-500">*</span></Label>

          <div className="relative w-full">
            <Select
              options={countryOptions}
              value={values.country_id}
              onChange={(option) => setFieldValue("country_id", option)}
              placeholder="Select"
              className="dark:bg-dark-900 w-full"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              <ChevronDownIcon />
            </span>
            {errors.country_id && touched.country_id && (
              <p className="text-red-500 text-sm mt-1 ms-2">{errors.country_id}</p>
            )}
          </div>
        </div>

        <div>
          <Label>
            {commonTitle.Status} <span className="text-red-500">*</span>
          </Label>

          <div className="relative w-1/2">
            <Select
              options={statusoption}
              value={values.states[0].status}
              onChange={(value) =>
                setFieldValue(`states.0.status`, value)
              }
              placeholder="Select"
              className="dark:bg-dark-900 w-full"
            />

            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              <ChevronDownIcon />
            </span>
          </div>
          {touched.states?.[0]?.status && typeof errors.states?.[0] !== "string" && errors.states?.[0]?.status && (
            <p className="text-red-500 text-sm mt-1 ms-2">
              {errors.states[0].status}</p>)}
        </div>


      </div>
      {/* First Row */}
      <div className="grid grid-cols-3 gap-5 mb-4">

        <div>
          <Label className='mb-2'>
            {statecommonTitle.State} <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            name="states[0].state_name"
            value={values.states[0].state_name}
            onChange={handleChange}
          />
          {touched.states?.[0]?.state_name && errors.states?.[0] && typeof errors.states[0] !== "string" && (
            <p className="text-red-500 text-sm mt-1">
              {errors.states[0].state_name}
            </p>
          )}
        </div>

        <div>
          <Label className='mb-2'>
            {statecommonTitle.StateCode} <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            name="states[0].gst_code"
            value={values.states[0].gst_code}
            onChange={handleChange}
          />
          {touched.states?.[0]?.gst_code && errors.states?.[0] && typeof errors.states[0] !== "string" && (
            <p className="text-red-500 text-sm mt-1">
              {errors.states[0].gst_code}
            </p>
          )}
        </div>

        <div className="flex items-end">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={addRow}
          >
            <AddCircleOutlineOutlinedIcon    />

          </Button>
        </div>

      </div>

      {/* Other Rows */}
      {values.states.slice(1).map((item, index) => {

        const realIndex = index + 1;

        return (
          <div key={realIndex} className="grid grid-cols-3 gap-5 mb-4">

            <div>
              <Input
                type="text"
                name={`states[${realIndex}].state_name`}
                value={item.state_name}
                onChange={handleChange}
              />
              {touched.states?.[realIndex]?.state_name && errors.states?.[realIndex] && typeof errors.states[realIndex] !== "string" && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.states[realIndex].state_name}
                </p>
              )}
            </div>

            <div>
              <Input
                type="text"
                name={`states[${realIndex}].gst_code`}
                value={item.gst_code}
                onChange={handleChange}
              />
              {touched.states?.[realIndex]?.gst_code && errors.states?.[realIndex] && typeof errors.states[realIndex] !== "string" && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.states[realIndex].gst_code}
                </p>
              )}
            </div>

            <div className="flex items-center">
              <button
                type="button"
                onClick={() => removeRow(realIndex)}
              >
                <DeleteOutlineOutlinedIcon className='text-red-500' />
              </button>
            </div>
          </div>
        );
      })}
      <div className='flex gap-5'>
        <Button type='submit' size="sm" variant="primary">
          Save
        </Button>

        <Button size="sm" onClick={() => {
          router.push("/system/state");
        }} variant="outline">
          Cancel
        </Button>
      </div>
    </form>
    </div>
  )
}

export default StateForm
