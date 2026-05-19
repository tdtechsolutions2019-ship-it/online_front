/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import Label from '@/components/form/Label';
import { Api } from '@/helper/api';
import { commonTitle, statecommonTitle } from '@/helper/commontitle';
import { createData, readData, updateData } from '@/helper/axios';
import { StateSchema } from '@/helper/yupvalidation';
import { useFormik } from 'formik';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Select from '@/components/form/Select';
import { ChevronDownIcon } from '@/icons';
import Input from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import Loader from '@/helper/loader';
import { useDispatch, useSelector } from 'react-redux';
import { setGroupedState, setLoading } from '@/redux/slices/state';
import { toast } from 'react-toastify';
const initialValues = {
  country_id: "",
  states: [
    { state_name: "", gst_code: "", status: "", }
  ],
}

const StateUpdateForm = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const isViewMode = mode === "view";
  const [stateId, setStateId] = useState("");
  const params = useParams<{ id: string }>();
  const { id } = params;
  const router = useRouter();
  const dispatch = useDispatch();
    const loading = useSelector((state: any) => state.states.loading);

  const { handleChange, values, handleSubmit, errors, touched, setFieldValue, setValues } =
    useFormik({
      initialValues,
      enableReinitialize: true,
      validationSchema: StateSchema,
      onSubmit: async (value, action) => {
        try {
         dispatch(setLoading(true));
          const payload = {

            states: [
              { state_name: value.states[0].state_name, gst_code: value.states[0].gst_code, id: id, status: value.states[0].status, },
            ],
            country_id: stateId,

          };
          const res = await updateData(
           `${Api.updateState}/${id}`,
             payload,
            
          );

          if (res.status === 200) {
              dispatch(setGroupedState())
            toast.success("State updated successfully");

            action.resetForm();

            router.push("/system/state");
          }
           if(res.status === 500){
                    toast.error(res.data.data.message);
                  }
        } catch (error) {
          console.log("API Error", error);
        }
          finally {
            dispatch(setLoading(false));
          }
      }
    });
  const getState = async () => {
    try {
      setLoading(true);
      const res = await readData(`${Api.getStateById}/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = res.data[0];
      setStateId(data.country_id)
      console.log("res state update", res)
      setValues({
        country_id: data.country_name || "",
        states: [
          {
            state_name: data.state_name || "",
            gst_code: data.gst_code || "",
            status: data.status ? String(data.status) : "1",
          },
        ],
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
      getState();
    }
  }, [id]);

  console.log("formik", values, values.states[0].status);
  const statusoption = [
    { value: "1", label: "Active" },
    { value: "0", label: "Inactive" },
  ]

  return (
    <div>
 {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-white/70 dark:bg-black/50 z-50">
          <Loader />
        </div>
      )}
      <form onSubmit={handleSubmit} className='bg-white shadow-lg rounded-xl p-6 space-y-5' >
        <h2 className="text-2xl font-semibold text-gray-700 py-3">
          {isViewMode ? "View" : "Update"} State
        </h2>
        <div className='grid grid-cols-[30%_70%] gap-5 '>
          <div className='mb-5 flex items-center gap-5'>
            <Label className='w-2/5'>{commonTitle.country}<span className="text-red-500">*</span></Label>

            <div className="relative w-full">
              <Input
                type="text"
                value={values.country_id}
                className="border rounded-lg px-3 py-2 w-full dark:bg-dark-900"
                disabled
              />

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
                value={values.states?.[0]?.status || ""}
                 disable={isViewMode}
                onChange={(value) =>
                  setFieldValue("states.0.status", value)

                }
                placeholder="Select"
                className="dark:bg-dark-900 w-full"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <ChevronDownIcon />
              </span>

            </div>
            {touched.states?.[0]?.status && errors.states?.[0] && typeof errors.states[0] !== "string" && errors.states[0].status && (
              <p className="text-red-500 text-sm mt-1 ms-2">{errors.states[0].status}</p>
            )}
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
              disabled={isViewMode}
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
              disabled={isViewMode}
            />
            {touched.states?.[0]?.gst_code && errors.states?.[0] && typeof errors.states[0] !== "string" && (
              <p className="text-red-500 text-sm mt-1">
                {errors.states[0].gst_code}
              </p>
            )}
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
                  disabled={isViewMode}
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
                  disabled={isViewMode}
                />
                {touched.states?.[realIndex]?.gst_code && errors.states?.[realIndex] && typeof errors.states[realIndex] !== "string" && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.states[realIndex].gst_code}
                  </p>
                )}
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

export default StateUpdateForm;
