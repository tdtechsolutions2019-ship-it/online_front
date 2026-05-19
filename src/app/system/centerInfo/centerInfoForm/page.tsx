"use client";
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import { Api } from '@/helper/api';
import { createData } from '@/helper/axios';
import { centerInfoTitle, commonTitle } from '@/helper/commontitle';
import { centerInfoSchema, CountrySchema } from '@/helper/yupvalidation';
import { ChevronDownIcon } from '@/icons';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify';
import Button from '@/components/ui/button/Button';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { fetchCountriesIfNeeded, fetchStatesIfNeeded } from '@/redux/services/commonAPIService';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { setCenterInfo, setLoading } from '@/redux/slices/centerInfo';
import Loader from '@/helper/loader';

const initialValues = {
  center_name: '',
  center_code: '',
  email: '',
  address: '',
  contact_person1: '',
  contact_person2: '',
  mobile: '',
  phone: '',
  country_id: '',
  state_id: '',
  status: '',
  center_logo: null,
}
const CenterInfoForm = () => {

  const thumbRef = useRef(null);
  const imgRef = useRef(null);
  const router = useRouter();
  const loading = useSelector((state: any) => state.centerInfo.loading);

  const countries = useSelector((state: any) => state?.countries.list);
  const states = useSelector((state: any) => state?.states.groups);
 
  const dispatch = useDispatch();
  const store = useStore();
  const countryOptions = countries.map((country: any) => ({
    value: country.id,
    label: country.country_name,
  }));
 const StateOptions = states.flatMap((country:any) =>
  country.states
    ?.filter((state:any) => state.status === "1")
    .map((state:any) => ({
      value: state.id,
      label: state.state_name,
    }))
);

  const { handleChange, values, setFieldValue, handleSubmit, errors, touched } =
    useFormik({
      initialValues,
      validationSchema: centerInfoSchema,
      onSubmit: async (value, action) => {
     
        try {
          dispatch(setLoading(true));
          const formData = new FormData();
          formData.append("center_name", values.center_name);
          formData.append("center_code", values.center_code);
          formData.append("email", values.email);
          formData.append("address", values.address);
          formData.append("contact_person1", values.contact_person1);
          formData.append("contact_person2", values.contact_person2);
          formData.append("mobile", values.mobile);
          formData.append("phone", values.phone);
          formData.append("country_id", values.country_id);
          formData.append("state_id", values.state_id);
          formData.append("status", values.status);

          if (values.center_logo) {
            formData.append("center_logo", values.center_logo);
          }

          const res = await createData(
            Api.addCenter,
            formData,
          ); 
       
          if (res.status === 200) {
            dispatch(setCenterInfo())
            toast.success("Center added successfully");

            action.resetForm();

            router.push("/system/centerInfo");
          } else if (res.status === 400) {
            toast.error(res.data.message);
          }
        } catch (error) {
          toast.error("Failed to add center");
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

  useEffect(() => {
    const stoerestate = store?.getState;

    if (!countries?.length) {

      fetchCountriesIfNeeded(dispatch, stoerestate);
    }

    if (!states?.length) {
     
      fetchStatesIfNeeded(dispatch, stoerestate);
    }
  }, []);


  return (
    <div>
       {loading && (
              <div className="absolute inset-0 flex justify-center items-center bg-white/70 dark:bg-black/50 z-50">
                <Loader />
              </div>
            )}
      <form onSubmit={handleSubmit} className=" bg-white shadow-lg rounded-xl p-6 space-y-5">
        <h2 className="text-2xl font-semibold text-gray-700 py-3">
          Center Infomation
        </h2>
        <div className='grid grid-cols-2 gap-10'>
          <div className=''>
            <Label className='w-30'>{centerInfoTitle.center_code}  <span className="text-red-500">*</span></Label>
            <Input type="text" name="center_code" onChange={handleChange} value={values.center_code} />
            {errors.center_code && touched.center_code && (
              <p className="text-red-500 text-sm mt-1 ms-2">{errors.center_code}</p>
            )}
          </div>

          <div className=''>
            <Label className='w-30'>{centerInfoTitle.center_name}  <span className="text-red-500">*</span></Label>
            <Input type="text" name="center_name" onChange={handleChange} value={values.center_name} />
            {errors.center_name && touched.center_name && (
              <p className="text-red-500 text-sm mt-1 ms-2">{errors.center_name}</p>
            )}
          </div>

          <div className=''>
            <Label className='w-30'>{centerInfoTitle.center_logo}  <span className="text-red-500">*</span></Label>
            <Input
              id="center_logo"
              name="center_logo"
              className="cursor-pointer"
              ref={imgRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setFieldValue("center_logo", file);
              }}
            />
            {
              values.center_logo && (
                <div className="mt-2 flex">
                  <>
                    <span className='cursor-pointer text-gray-500 ms-5'>{values.center_logo?.name}</span><DeleteOutlineOutlinedIcon className="text-red-600 ms-2 cursor-pointer"
                      onClick={() => {
                        setFieldValue("center_logo", null);   // clear Formik
                        if (imgRef.current) imgRef.current.value = ""; // clear input
                      }} />
                  </>
                </div>
              )}

          </div>

          <div className=''>
            <Label className='w-30'>{centerInfoTitle.email}  <span className="text-red-500">*</span></Label>
            <Input type="email" name="email" onChange={handleChange} value={values.email} />
            {errors.email && touched.email && (
              <p className="text-red-500 text-sm mt-1 ms-2">{errors.email}</p>
            )}
          </div>

          <div className=''>
            <Label className='w-30'>{centerInfoTitle.address}  </Label>
            <TextArea className='w-full' name="address" placeholder='Enter Address' onChange={handleChange} value={values.address} />

          </div>

          <div className=''>
            <Label className='w-30'>{centerInfoTitle.contact_person1}  <span className="text-red-500">*</span></Label>
            <Input type="text" name="contact_person1" onChange={handleChange} value={values.contact_person1} />
            {errors.contact_person1 && touched.contact_person1 && (
              <p className="text-red-500 text-sm mt-1 ms-2">{errors.contact_person1}</p>
            )}
          </div>

          <div className=''>
            <Label className='w-30'>{centerInfoTitle.contact_person2}  </Label>
            <Input type="text" name="contact_person2" onChange={handleChange} value={values.contact_person2} />
          </div>

          <div className=''>
            <Label className='w-30' >{centerInfoTitle.mobile}  <span className="text-red-500">*</span> </Label>
            <Input type="text" name="mobile" onChange={handleChange} value={values.mobile} />
            {errors.mobile && touched.mobile && (
              <p className="text-red-500 text-sm mt-1 ms-2">{errors.mobile}</p>
            )}
          </div>

          <div className=''>
            <Label className='w-30'>{centerInfoTitle.phone}  </Label>
            <Input type="text" name="phone" onChange={handleChange} value={values.phone} />
          </div>
          <div className=''>
            <Label className='w-30' >
              {centerInfoTitle.country}
            </Label>

            <div className="relative">
              <Select
                options={countryOptions}
                value={values.country_id}
                onChange={(value) =>
                  setFieldValue(`country_id`, value)
                }
                placeholder="Select"
                className="dark:bg-dark-900 "
              />

              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <ChevronDownIcon />
              </span>
            </div>


          </div>
          <div className=''>
            <Label className='w-30' >
              {centerInfoTitle.state}
            </Label>

            <div className="relative">
              <Select
                options={StateOptions}
                value={values.state_id}
                onChange={(value) =>
                  setFieldValue(`state_id`, value)
                }
                placeholder="Select"
                className="dark:bg-dark-900 "
              />

              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <ChevronDownIcon />
              </span>
            </div>


          </div>
          <div className=''>
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
          <Button type='submit' size="sm" variant="primary">
            Save
          </Button>

          <Button size="sm" onClick={() => {
            router.push("/system/centerInfo");
          }} variant="outline">
            Cancel
          </Button>
        </div>

      </form>

    </div>
  )
}

export default CenterInfoForm
