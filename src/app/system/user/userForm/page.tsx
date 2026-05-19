"use client";
import Input from '@/components/form/input/InputField';
import Radio from '@/components/form/input/Radio';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import Button from '@/components/ui/button/Button';
import { Api } from '@/helper/api';
import { createData } from '@/helper/axios';
import { centerInfoTitle, rolecommonTitle, userTitle } from '@/helper/commontitle';
import Loader from '@/helper/loader';
import { userPageSchema } from '@/helper/yupvalidation';
import { ChevronDownIcon } from '@/icons';
import { fetchCenterIfNeeded, fetchCountriesIfNeeded, fetchRolesIfNeeded, fetchStatesIfNeeded } from '@/redux/services/commonAPIService';
import { log } from 'console';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux';
import { toast } from 'react-toastify';
const initialValues = {
  center_name: '',
  role: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  status: '',
  usertype: "",
  username: "",
}

const UserAddForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const countries = useSelector((state: any) => state?.countries.list);
  const states = useSelector((state: any) => state?.states.groups);
  const center = useSelector((state: any) => state.centerInfo.list);
  const role = useSelector((state: any) => state.role.list);


  const dispatch = useDispatch();
  const store = useStore();

  const centerOptions = center?.map((state: any) => ({
    value: state.id,
    label: state.center_name,
  }));

  const roleoptions = role?.map((state: any) => ({
    value: state.id,
    label: state.role_name,
  }));
 
  const { handleChange, values, setFieldValue, handleSubmit, errors, touched } =
    useFormik({
      initialValues,
      validationSchema: userPageSchema,
      onSubmit: async (value, action) => {
      
        try {
          setLoading(true);
          const role_name = roleoptions.find((item: any) => item.value === Number(values.role));
          const payload = {
            center_id: value.center_name,
            role: value.role,
            role_name: role_name?.label,
            first_name: value.first_name,
            last_name: value.last_name,
            email: value.email,
            phone: value.phone,
            status: value.status,
            username: value.username
          };

          const res = await createData(
            Api.adduser,
            payload,
          );
          
          if (res.status === 200) {
            toast.success("User added successfully");

            action.resetForm();

            router.push("/system/user");
          } else if (res.status === 400) {
            toast.error(res.data.message);
          }
        } catch (error) {
          toast.error("Failed to add country");
         
        }
        finally {
          setLoading(false);
        }
      },
    });
  const statusoption = [
    { label: "Active", value: "1" },
    { label: "Inactive", value: "0" }
  ];


  useEffect(() => {
    const stoerestate = store?.getState;

    if (!center?.length) {
   
      fetchCenterIfNeeded(dispatch, stoerestate);
    }
    if (!role?.length) {
      
      fetchRolesIfNeeded(dispatch, stoerestate);
    }


  }, [countries, states, dispatch]);



  useEffect(() => {
    if (values.usertype === "1") {
      setFieldValue("role", "1"); // auto-set role to 1
    } else {
      setFieldValue("role", "");  // reset when switching away
    }
  }, [values.usertype]);
  return (
    <div>
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-white/70 dark:bg-black/50 z-50">
          <Loader />
        </div>
      )}
      <form onSubmit={handleSubmit} className=" bg-white shadow-lg rounded-xl p-6 space-y-5">
        <h2 className="text-2xl font-semibold text-gray-700 py-3">
          Add User
        </h2>
        <div className='grid grid-cols-2 gap-5'>

          <div className=''>
            <Label className='w-30' >
              {centerInfoTitle.center_name}<span className='text-red-800 ms-2'>*</span>
            </Label>

            <div className="relative">
              <Select
                options={centerOptions}
                value={values.center_name}
                onChange={(value) =>
                  setFieldValue(`center_name`, value)
                }
                placeholder="Select"
                className="dark:bg-dark-900 "
              />

              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <ChevronDownIcon />
              </span>
            </div>

            {errors.center_name && touched.center_name && (
              <p className="text-red-500 text-sm mt-1 ms-2">{errors.center_name}</p>
            )}
          </div>
          <div className=''>
            <Label className='w-30' >
              Role Type<span className='text-red-800 ms-2'>*</span>
            </Label>

            <div className="flex flex-wrap items-center gap-8">
              <Radio
                id="radio1"
                name="usertype"
                value="0"
                checked={values.usertype === "0"}
                onChange={(value) =>
                  setFieldValue(`usertype`, value)
                }
                label="Admin User"
              />

              <Radio
                id="radio2"
                name="usertype"
                value="1"
                checked={values.usertype === "1"}
                onChange={(value) =>
                  setFieldValue(`usertype`, value)
                }
                label="Center User"
              />

            </div>

            {errors.usertype && touched.usertype && (
              <p className="text-red-500 text-sm mt-1 ms-2">{errors.usertype}</p>
            )}
          </div>

          <div className=''>
            <Label className='w-30'>
              {rolecommonTitle.Role}<span className='text-red-800 ms-2'>*</span>
            </Label>
            {values.usertype === "1" ? (
              <div className="relative">

                <Select
                  options={roleoptions}
                  value={roleoptions.find((opt: any) => opt.value === "1")?.value ?? "1"}
                  onChange={(value) => setFieldValue(`role`, value)}
                  placeholder="Select"
                  className="dark:bg-dark-900"
                  disable
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  <ChevronDownIcon />
                </span>
              </div>
            ) : (
              <div className="relative">
                <Select
                  options={roleoptions}
                  value={values.role}
                  onChange={(value) =>
                    setFieldValue(`role`, value)
                  }
                  placeholder="Select"
                  className="dark:bg-dark-900 "
                  disable={values.usertype === ""}
                />

                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  <ChevronDownIcon />
                </span>
              </div>
            )}

            {errors.role && touched.role && (
              <p className="text-red-500 text-sm mt-1 ms-2">{errors.role}</p>
            )}
          </div>

          <div className=''>
            <Label className='w-30'>{userTitle.username}<span className='text-red-800 ms-2'>*</span>  </Label>
            <Input type="text" name="username" onChange={handleChange} value={values.username} />
            {errors.username && touched.username && (
              <p className="text-red-500 text-sm mt-1 ms-2">{errors.username}</p>
            )}
          </div>
          <div className=''>
            <Label className='w-30'>{userTitle.first_name}<span className='text-red-800 ms-2'>*</span>  </Label>
            <Input type="text" name="first_name" onChange={handleChange} value={values.first_name} />
            {errors.first_name && touched.first_name && (
              <p className="text-red-500 text-sm mt-1 ms-2">{errors.first_name}</p>
            )}
          </div>

          <div className=''>
            <Label className='w-30'>{userTitle.last_name} <span className='text-red-800 ms-2'>*</span> </Label>
            <Input type="text" name="last_name" onChange={handleChange} value={values.last_name} />
            {errors.last_name && touched.last_name && (
              <p className="text-red-500 text-sm mt-1 ms-2">{errors.last_name}</p>
            )}
          </div>

          <div className=''>
            <Label className='w-30'>{centerInfoTitle.email} <span className='text-red-800 ms-2'>*</span> </Label>
            <Input type="text" name="email" onChange={handleChange} value={values.email} />
            {errors.email && touched.email && (
              <p className="text-red-500 text-sm mt-1 ms-2">{errors.email}</p>
            )}
          </div>

          <div className=''>
            <Label className='w-30'>{centerInfoTitle.phone}  </Label>
            <Input type="text" name="phone" onChange={handleChange} value={values.phone} />
          </div>

          <div className=''>
            <Label className='w-30' >
              {rolecommonTitle.Status}
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
            router.push("/system/user");
          }} variant="outline">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

export default UserAddForm
