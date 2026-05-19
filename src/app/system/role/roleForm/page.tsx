"use client"
import Input from '@/components/form/input/InputField';
import Radio from '@/components/form/input/Radio';
import TextArea from '@/components/form/input/TextArea';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import Button from '@/components/ui/button/Button';
import { Api } from '@/helper/api';
import { createData } from '@/helper/axios';
import { commonTitle, rolecommonTitle } from '@/helper/commontitle';
import Loader from '@/helper/loader';
import { RoleSchema } from '@/helper/yupvalidation';
import { ChevronDownIcon } from '@/icons';
import { setLoading, setRole } from '@/redux/slices/role';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

function RoleForm() {
    type Permission = "view" | "add" | "edit" | "delete" | "import" | "export";

    type ModulePermissions = {
        [key in Permission]?: boolean;
    };

    type RolePermissions = {
        [module: string]: ModulePermissions;
    };
    type ModuleConfig = {
        id: string;
        name: string;
        permissions: Permission[];
    };

    const permissions: Permission[] = [
        "view",
        "add",
        "edit",
        "delete",
        "import",
        "export",
    ];
    const initialValues = {
        role_name: '',
        role_type: '',
        role_code: '',
        role_desc: '',
        status: '',
        permissions: {} as RolePermissions
    }
    const router = useRouter();
    const dispatch = useDispatch();
    const loading = useSelector((state: any) => state.role.loading);


    const { handleChange, values, handleSubmit, errors, touched, setFieldValue } =
        useFormik({
            initialValues,
            validationSchema: RoleSchema,
            onSubmit: async (value, action) => {
                try {
                    dispatch(setLoading(true));

                 
                    const payload = {
                        ...value
                    };

                    const res = await createData(
                        Api.addRoles, payload,
                    );
           
                    if (res.success === true) {
                        dispatch(setRole());
                        toast.success("Role added successfully");
                        action.resetForm();
                        router.push("/system/role");
                    }
                    if (res.status === 500) {
                        toast.error(res.data.data.message);
                    }
                    action.resetForm()
                } catch (error) {
                    console.log("API Error", error);

                }
                finally {
                    dispatch(setLoading(false));
                }
            }
        });


    const modules: ModuleConfig[] = [
        {
            id: "1",
            name: "Select All",
            permissions: ["view", "add", "edit", "delete", "import", "export"],
        },
        {
            id: "2",
            name: "User",
            permissions: ["view", "add", "edit"],
        },
        {
            id: "3",
            name: "Role",
            permissions: ["view", "add", "edit"],
        },
        {
            id: "4",
            name: "Center Info",
            permissions: ["view", "add", "edit"],
        },
        {
            id: "5",
            name: "Country",
            permissions: ["view", "add", "edit", "delete", "export"],
        },
        {
            id: "6",
            name: "State",
            permissions: ["view", "add", "edit", "delete", "export"],
        },
        {
            id: "7",
            name: "Student",
            permissions: ["view", "add", "edit", "delete", "import", "export"],
        },
        {
            id: "8",
            name: "Subject",
            permissions: ["view", "add", "edit", "delete"],
        },
        {
            id: "9",
            name: "Course",
            permissions: ["view", "add", "edit", "delete"],
        },
        {
            id: "10",
            name: "Question",
            permissions: ["view", "add", "edit", "delete", "import", "export"],
        },
        {
            id: "11",
            name: "Exam Schedule",
            permissions: ["view", "add", "edit", "delete", "export"],
        },
        {
            id: "12",
            name: "Re-test Criteria",
            permissions: ["view", "add", "edit", "delete"],
        },
        {
            id: "13",
            name: "Exam Report",
            permissions: ["view"],
        },
        {
            id: "14",
            name: "Result Report",
            permissions: ["view"],
        },
        {
            id: "15",
            name: "Appearance Report",
            permissions: ["view"],
        },
        {
            id: "16",
            name: "ReSchedule Report",
            permissions: ["view"],
        },
        {
            id: "17",
            name: "Settings",
            permissions: ["delete"],
        }
    ];
    const handlePermissionChange = (
        module: string,
        id: string,
        permission: Permission
    ) => {
        const currentPermissions = values.permissions;

        // 🔥 SELECT ALL LOGIC
        if (module === "Select All") {
            const isChecked = !currentPermissions[module]?.[permission];

            const updatedPermissions: any = {};

            modules.forEach((mod) => {
                updatedPermissions[mod.name] = {
                    id: mod.id,
                    module: mod.name,
                    ...currentPermissions[mod.name],
                    [permission]: isChecked,
                };
            });

            setFieldValue("permissions", updatedPermissions);
            return;
        }

        // ✅ Normal toggle
        setFieldValue("permissions", {
            ...currentPermissions,
            [module]: {
                id,
                module,
                ...currentPermissions[module],
                [permission]: !currentPermissions[module]?.[permission],
            },
        });
    }
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
                    {rolecommonTitle.addrole}
                </h2>
                <div className='grid grid-cols-2 gap-5'>
                    <div >
                        <Label>{rolecommonTitle.RoleCode}  <span className="text-red-500">*</span></Label>
                        <Input type="text" name="role_code" className='w-[10x]' placeholder='Enter Role Code' onChange={handleChange} value={values.role_code} />
                        {errors.role_code && touched.role_code && (
                            <p className="text-red-500 text-sm mt-1 ms-2">{errors.role_code}</p>
                        )}
                    </div>
                    <div>
                        <Label>{rolecommonTitle.Role}  <span className="text-red-500">*</span></Label>
                        <Input type="text" name="role_name" placeholder='Enter Role Name' onChange={handleChange} value={values.role_name} />
                        {errors.role_name && touched.role_name && (
                            <p className="text-red-500 text-sm mt-1 ms-2">{errors.role_name}</p>
                        )}
                    </div>
                    {/* <div>
                        <Label>{rolecommonTitle.RoleType}  </Label>
                        <div className="relative w-full">
                            <Select
                                options={options}
                                value={values.role_type}
                                onChange={(option) => setFieldValue("role_type", option)}
                                placeholder="Select Role Type"
                                className="dark:bg-dark-900 w-full"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2">
                                <ChevronDownIcon />
                            </span>

                        </div>

                    </div> */}
                </div>
                <div className='grid grid-cols-2 gap-5'>
                    <div>
                        <Label>{rolecommonTitle.Roledesc}  </Label>
                        <TextArea name="role_desc" placeholder='Enter Role Description' onChange={handleChange} value={values.role_desc} />

                    </div>
                    <div >
                        <Label className='my-2'>{rolecommonTitle.Status}  </Label>
                        <div className="relative w-full">
                            <Select
                                options={statusoption}
                                value={values.status}
                                onChange={(value) =>
                                    setFieldValue(`status`, value)
                                }
                                placeholder="Select"
                                className="dark:bg-dark-900 w-full"
                            />

                            <span className="absolute right-3 top-1/2 -translate-y-1/2">
                                <ChevronDownIcon />
                            </span>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="overflow-x-auto rounded-md ">
                        <table className="w-full  border-gray-300 ">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-2 text-left ">Module</th>
                                    {permissions.map((perm) => (
                                        <th key={perm} className="p-2 text-center capitalize">
                                            {perm}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className='space-y-6'>
                                {modules.map((module) => (
                                    <tr key={module.name} className="border-t odd:bg-gray-50">
                                        <td className="p-2 text-[12px]">{module.name}</td>

                                        {permissions.map((perm) => (
                                            <td key={perm} className="text-center">
                                                {module.permissions.includes(perm) ? (
                                                    <input
                                                        type="checkbox"
                                                        className='cursor-pointer'
                                                        checked={values.permissions?.[module.name]?.[perm] ?? false}
                                                        onChange={() => handlePermissionChange(module.name, module.id, perm)}
                                                    />
                                                ) : null}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className='flex gap-5'>
                    <Button type='submit' size="sm" variant="primary">
                        Save
                    </Button>

                    <Button size="sm" onClick={() => {
                        router.push("/system/role");
                    }} variant="outline">
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default RoleForm
