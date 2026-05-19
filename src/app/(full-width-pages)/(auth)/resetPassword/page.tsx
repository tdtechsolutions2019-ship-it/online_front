"use client"
import Button from '@/components/ui/button/Button';
import { resetPassword, signInSchema } from '@/helper/yupvalidation';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import { EyeCloseIcon, EyeIcon } from '@/icons';

const ResetPasswordPage = () => {
     const [showPassword, setShowPassword] = useState(false);
      const [isChecked, setIsChecked] = useState(false);
      const router = useRouter();
      const initialValues = {
            email:"",
            password:"",
            confirm_password:""
    }    
       const { handleChange, values, setFieldValue, handleSubmit, errors, touched } =
           useFormik({
             initialValues,
             validationSchema: resetPassword,
             onSubmit: async (value, action) => {
       
              
               router.push("/signin");  
             },
           });
  return (
     <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
      
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className=" sm:mb-8">
            <h1 className=" font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Reset Password
            </h1>
          </div>
          <div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
            </div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input placeholder="info@gmail.com" name="email" type="email" onChange={handleChange} value={values.email} />
                  {touched.email && errors.email && (
  <p className="text-red-500 text-sm">{errors.email}</p>
)}
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      name="password" 
                      onChange={handleChange}
                      value={values.password}
                    />
              {touched.password && errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
)}
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                   <div>
                  <Label>
                    Confirm Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      name="confirm_password" 
                      onChange={handleChange}
                      value={values.confirm_password}
                    />
              {touched.confirm_password && errors.confirm_password && (
            <p className="text-red-500 text-sm">{errors.confirm_password}</p>
)}
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
               
                <div>
                    <Button
                    type="submit"
                    className="w-full"
                    size="sm">
              Save
            </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage
