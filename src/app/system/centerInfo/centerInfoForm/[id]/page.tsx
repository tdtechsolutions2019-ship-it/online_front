"use client";

import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import Button from '@/components/ui/button/Button';
import { Api } from '@/helper/api';
import { createData, readData, updateData } from '@/helper/axios';
import { centerInfoTitle, commonTitle } from '@/helper/commontitle';
import { centerInfoSchema } from '@/helper/yupvalidation';
import { ChevronDownIcon } from '@/icons';
import { fetchCountriesIfNeeded, fetchStatesIfNeeded } from '@/redux/services/commonAPIService';
import { useFormik } from 'formik';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux';
import { toast } from 'react-toastify';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Image from 'next/image';
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

const CenterInfoEditForm = () => {
  const params = useParams<{ id: string }>();
  const { id } = params;
  const thumbRef = useRef(null);
  const imgRef = useRef(null);
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const isViewMode = mode === "view";
  const countries = useSelector((state: any) => state?.countries.list);
  const states = useSelector((state: any) => state?.states.groups);
  const dispatch = useDispatch();
  const loading = useSelector((state: any) => state.centerInfo.loading);

  const store = useStore();
  const countryOptions = countries.map((country: any) => ({
    value: country.id,
    label: country.country_name,
  }));
  const StateOptions = states[0]?.states?.map((state: any) => ({
    value: state.id,
    label: state.state_name,
  }));

  const { handleChange, values, setFieldValue, setValues, handleSubmit, errors, touched } =
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
          formData.append("user_id", userId);

          if (values.center_logo) {
            formData.append("center_logo", values.center_logo);
          }

          const res = await updateData(
            `${Api.updateCenterInfo}/${id}`,
            formData,
          );
          
          if (res.status === 200) {
            dispatch(setCenterInfo())

            toast.success("Center Updared successfully");

            action.resetForm();

            router.push("/system/centerInfo");
          }
        } catch (error) {
          toast.error("Failed to Update center");
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


  const GetCenter = async () => {
    try {
      setLoading(true);
      const res = await readData(`${Api.getCenterInfoById}/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      

      if (res.status === 200) {
        setValues({
          center_name: res.data.center_name || '',
          center_code: res.data.center_code || '',
          email: res.data.email || '',
          address: res.data.address || '',
          contact_person1: res.data.contact_person1 || '',
          contact_person2: res.data.contact_person2 || '',
          mobile: res.data.mobile || '',
          phone: res.data.phone || '',
          country_id: res.data.country_id || '',
          state_id: res.data.state_id || '',
          status: res.data.status || '',
          center_logo: res.data.center_logo || null,
        });
        setUserId(res.data.user_id)
      }

    } catch (error) {
      console.log("Fetch Error", error);
    }
    finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (id) {
      GetCenter();
    }
  }, [id]);

  useEffect(() => {
    const stoerestate = store?.getState;

    if (!countries?.length) {
    
      fetchCountriesIfNeeded(dispatch, stoerestate);
    }

    if (!states?.length) {
      
      fetchStatesIfNeeded(dispatch, stoerestate);
    }
  }, [countries, states, dispatch]);

 
  return (
    <div>
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-white/70 dark:bg-black/50 z-50">
          <Loader />
        </div>
      )}
      <form onSubmit={handleSubmit} className=" bg-white shadow-lg rounded-xl p-6 space-y-5">
        <h2 className="text-2xl font-semibold text-gray-700 py-3">
          {isViewMode ? "View" : "Edit"}  Center Infomation
        </h2>
        <div className='grid grid-cols-2 gap-10'>
          <div className=''>
            <Label className='w-30'>{centerInfoTitle.center_code}  <span className="text-red-500">*</span></Label>
            <Input type="text" name="center_code" onChange={handleChange} value={values.center_code} disabled={true} />
            {errors.center_code && touched.center_code && (
              <p className="text-red-500 text-sm mt-1 ms-2">{errors.center_code}</p>
            )}
          </div>
          <div className=''>
            <Label className='w-30'>{centerInfoTitle.center_name}  <span className="text-red-500">*</span></Label>
            <Input type="text" name="center_name" onChange={handleChange} value={values.center_name} disabled={isViewMode} />
            {errors.center_name && touched.center_name && (
              <p className="text-red-500 text-sm mt-1 ms-2">{errors.center_name}</p>
            )}
          </div>



          <div className=''>
            <Label className='w-30'>{centerInfoTitle.center_logo}  <span className="text-red-500">*</span></Label>
            {!isViewMode ?
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
              /> : values.center_logo === null ? <Input
                id="center_logo"
                name="center_logo"
                className="cursor-pointer"
                ref={imgRef}
                type="file"
                accept="image/*"
                disabled
              /> : <img width={100} height={100} src={values.center_logo?.url} alt="center logo" className="mt-2 w-50 w-50" />
            }
            {!isViewMode &&
              values.center_logo && (
                <div className="mt-2 flex">
                  <>
                    {mode === 'edit' && <a target='_blank' href={values.center_logo.url} className='cursor-pointer text-gray-500 ms-5'>{values.center_logo?.name}</a>}
                    <DeleteOutlineOutlinedIcon className="text-red-600 ms-2 cursor-pointer"
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
            <Input type="email" name="email" onChange={handleChange} value={values.email} disabled={isViewMode} />
            {errors.email && touched.email && (
              <p className="text-red-500 text-sm mt-1 ms-2">{errors.email}</p>
            )}
          </div>

          <div className=''>
            <Label className='w-30'>{centerInfoTitle.address}  </Label>
            <TextArea className='w-full' name="address" placeholder='Enter Address' onChange={handleChange} value={values.address} disabled={isViewMode} />

          </div>

          <div className=''>
            <Label className='w-30'>{centerInfoTitle.contact_person1}  <span className="text-red-500">*</span></Label>
            <Input type="text" name="contact_person1" onChange={handleChange} value={values.contact_person1} disabled={isViewMode} />
            {errors.contact_person1 && touched.contact_person1 && (
              <p className="text-red-500 text-sm mt-1 ms-2">{errors.contact_person1}</p>
            )}
          </div>

          <div className=''>
            <Label className='w-30'>{centerInfoTitle.contact_person2}  </Label>
            <Input type="text" name="contact_person2" onChange={handleChange} value={values.contact_person2} disabled={isViewMode} />
          </div>

          <div className=''>
            <Label className='w-30' >{centerInfoTitle.mobile}  <span className="text-red-500">*</span> </Label>
            <Input type="text" name="mobile" onChange={handleChange} value={values.mobile} disabled={isViewMode} />
            {errors.mobile && touched.mobile && (
              <p className="text-red-500 text-sm mt-1 ms-2">{errors.mobile}</p>
            )}
          </div>

          <div className=''>
            <Label className='w-30'>{centerInfoTitle.phone}  </Label>
            <Input type="text" name="phone" onChange={handleChange} value={values.phone} disabled={isViewMode} />
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
                disable={isViewMode}
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
                disable={isViewMode}
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
                disable={isViewMode}
              />

              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <ChevronDownIcon />
              </span>
            </div>


          </div>
        </div>

        <div className='flex gap-5'>
          {!isViewMode &&
            <Button type='submit' size="sm" variant="primary">
              Save
            </Button>
          }
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

export default CenterInfoEditForm
