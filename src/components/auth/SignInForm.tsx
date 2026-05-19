"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { Api } from "@/helper/api";
import { createData } from "@/helper/axios";
import { signInSchema } from "@/helper/yupvalidation";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import { loginSuccess, setLoading } from "@/redux/slices/auth";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { jwtDecode, JwtPayload } from 'jwt-decode'
import Loader from "@/helper/loader";
import { CircularProgress } from "@mui/material";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const initialValues = {
    email: "",
    password: ""
  }
  type DecodedToken = JwtPayload & {
    name: string;
    id: number;
    email: string;
    role_id: number;
    role_name: string;
    permissions?: any[]
  };
  const { handleChange, values, setFieldValue, handleSubmit, errors, touched } =
    useFormik({
      initialValues,
      validationSchema: signInSchema,
      onSubmit: async (value, action) => {
        try {
          setIsLoading(true);
          const data = {
            email: values.email,
            password: values.password
          }
          const res = await createData(
            Api.login,
            data,

          );

    

          if (res.status === 200) {

            const token = res.data
          
            const userdecoed = jwtDecode<DecodedToken>(token);

         
            dispatch(
              loginSuccess({
                user: {
                  name: userdecoed.name,
                  id: userdecoed.id,
                  email: userdecoed.email,
                  role_id: userdecoed.role_id,
                  role_name: userdecoed.role_name,
                  permissions: userdecoed.permissions
                },
                token: token,
              })
            );
            toast.success(res.data.message)
            setIsLoading(false);
            router.push("/dashboard");
          } else if (res.status === 400) {
            
            dispatch(setLoading(false));
            toast.error(res.data.message);
          }

        } catch (error) {
          setIsLoading(false);
          
        }


      },
    });

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">

      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
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
                <div className="flex items-center justify-between">
                  <Link
                    href="/resetPassword"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <Button
                    type="submit"
                    className="w-full"
                    size="sm">
                    {isLoading ? <Loader size='20px' color="inherit" /> : "Sign In"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
