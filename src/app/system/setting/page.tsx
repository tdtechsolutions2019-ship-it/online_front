"use client";
import DatePicker from '@/components/form/date-picker';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import { Api } from '@/helper/api';
import { createData, readData, updateData } from '@/helper/axios';
import { commonTitle } from '@/helper/commontitle';
import { SettingSchema } from '@/helper/yupvalidation';
import { useFormik } from 'formik';
import { useRouter } from 'next/dist/client/components/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
type SettingItem = { id: number; key: string; value: string };

type FormValues = {
    startDate: string;
    endDate: string;
    adminReportEmail: string;
    settimeforexam: string;
    isCentralHead: boolean;
    adminEmail: string;
    complexityLevel: {
        easy: string;
        moderate: string;
        difficult: string;
    };
    changedFields: string[]; // ✅ hidden tracker
};

/* ─────────────────────────────────────────────
   Initial Values
───────────────────────────────────────────── */
const initialValues: FormValues = {
    startDate: "",
    endDate: "",
    adminReportEmail: "",
    isCentralHead: false,
    settimeforexam: "",
    adminEmail: "",
    complexityLevel: {
        easy: "",
        moderate: "",
        difficult: "",
    },
    changedFields: [],
};

/* ─────────────────────────────────────────────
   Helper — get last occurrence of key
───────────────────────────────────────────── */
const getValue = (data: SettingItem[], key: string): string => {
    const found = [...data].reverse().find((item) => item.key === key);
    return found ? found.value : "";
};

/* ─────────────────────────────────────────────
   Helper — build payload from changed fields
───────────────────────────────────────────── */
const buildPayload = (values: FormValues): { key: string; value: string }[] => {
    const payload: { key: string; value: string }[] = [];

    values.changedFields.forEach((field) => {
        // Group all complexityLevel sub-fields into one entry
        if (["complexityLevel.easy", "complexityLevel.moderate", "complexityLevel.difficult"].includes(field)) {
            const alreadyAdded = payload.find((p) => p.key === "complexityLevel");
            if (!alreadyAdded) {
                payload.push({
                    key: "complexityLevel",
                    value: JSON.stringify({
                        easy: values.complexityLevel.easy,
                        moderate: values.complexityLevel.moderate,
                        difficult: values.complexityLevel.difficult,
                    }),
                });
            }
        } else {
            const rawValue = values[field as keyof Omit<FormValues, "complexityLevel" | "changedFields">];
            payload.push({
                key: field,
                value: String(rawValue),
            });
        }
    });

    return payload;
};

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */
const SettingPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const formik = useFormik<FormValues>({
        initialValues,
        validationSchema: SettingSchema,
        enableReinitialize: true,
        onSubmit: async (values, action) => {
            try {
                setLoading(true);

                // ✅ Only send changed fields as key-value pairs
                const payload = buildPayload(values);

                if (!payload.length) {
                    toast.info("No changes to save");
                    return;
                }

                const res = await updateData(Api.updateRetest, { settings: payload });

                if (res.status === 200) {
                    toast.success("Settings saved successfully");
                    action.resetForm();
                    router.push("/dashboard");
                }
            } catch (error) {
                toast.error("Failed to save settings");
                console.error("API Error", error);
            } finally {
                setLoading(false);
            }
        },
    });

    const { handleSubmit, values, errors, touched, handleBlur, setValues, setFieldValue } = formik;

    /* ─── Track changed field ─── */
    const trackChange = (fieldKey: string, value: any) => {
        setFieldValue(fieldKey, value);

        const alreadyTracked = values.changedFields.includes(fieldKey);
        if (!alreadyTracked) {
            setFieldValue("changedFields", [...values.changedFields, fieldKey]);
        }
    };

    /* ─── Fetch & populate settings ─── */
    const fetchSettings = async () => {
        try {
            const res = await readData(`${Api.getRetest}`, {
                headers: { "Content-Type": "application/json" },
            });

            const data: SettingItem[] = res.data;

            const complexityRaw = getValue(data, "complexityLevel");
            let complexityParsed = { easy: "", moderate: "", difficult: "" };

            try {
                if (complexityRaw) {
                    const parsed = JSON.parse(complexityRaw);
                    complexityParsed = {
                        easy: parsed.easy?.toString() ?? "",
                        moderate: parsed.moderate?.toString() ?? "",
                        difficult: parsed.difficult?.toString() ?? "",
                    };
                }
            } catch (e) {
                console.error("Failed to parse complexityLevel", e);
            }

            setValues({
                startDate: getValue(data, "startDate"),
                endDate: getValue(data, "endDate"),
                adminReportEmail: getValue(data, "adminReportEmail"),
                isCentralHead: getValue(data, "isCentralHead") === "1",
                adminEmail: getValue(data, "adminEmail"),
                settimeforexam: getValue(data, "settimeforexam"),
                complexityLevel: complexityParsed,
                changedFields: [], // ✅ reset tracker after fetch
            });
        } catch (error) {
            console.error("Failed to fetch settings", error);
            toast.error("Failed to load settings");
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    /* ─────────────────────────────────────────────
       Render
    ───────────────────────────────────────────── */
    return (
        <div>
            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-6 space-y-5">
                <h2 className="text-base font-medium text-gray-800 dark:text-white/90">
                    Setting
                </h2>

                {/* Start Date */}
                <div>
                    <div className="flex items-center gap-5">
                        <Label className="w-[230px]">
                            {commonTitle.ExamScheduleStartDate} <span className="text-red-500">*</span>
                        </Label>
                        <DatePicker
                            id="date-picker1"
                            placeholder="Select a date"
                            value={values.startDate}
                            onChange={(_dates, currentDateString) => {
                                trackChange("startDate", currentDateString);
                            }}
                        />
                    </div>
                    {errors.startDate && touched.startDate && (
                        <p className="text-red-500 text-sm mt-1 ms-2">{errors.startDate}</p>
                    )}
                </div>

                {/* End Date */}
                <div>
                    <div className="flex items-center gap-5">
                        <Label className="w-[230px]">
                            {commonTitle.ExamScheduleEndDate} <span className="text-red-500">*</span>
                        </Label>
                        <DatePicker
                            id="date-picker2"
                            placeholder="Select a date"
                            value={values.endDate}
                            onChange={(_dates, currentDateString) => {
                                trackChange("endDate", currentDateString);
                            }}
                        />
                    </div>
                    {errors.endDate && touched.endDate && (
                        <p className="text-red-500 text-sm mt-1 ms-2">{errors.endDate}</p>
                    )}
                </div>
                {/* Exam Time */}
                <div>
                    <div className="flex items-center gap-5">
                        <Label className="w-[230px]">
                            {commonTitle.SetTimeToSchedualExam} <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="number"
                            name="settimeforexam"
                            value={values.settimeforexam}
                            onBlur={handleBlur}
                            onChange={(e) => trackChange("settimeforexam", e.target.value)}
                        />
                    </div>
                    {errors.settimeforexam && touched.settimeforexam && (
                        <p className="text-red-500 text-sm mt-1 ms-2">{errors.settimeforexam}</p>
                    )}
                </div>
                {/* Admin Report Email */}
                <div>
                    <div className="flex items-center gap-5">
                        <Label className="w-[230px]">
                            {commonTitle.AdminExamReportEmail} <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="email"
                            name="adminReportEmail"
                            value={values.adminReportEmail}
                            onBlur={handleBlur}
                            onChange={(e) => trackChange("adminReportEmail", e.target.value)}
                        />
                    </div>
                    {errors.adminReportEmail && touched.adminReportEmail && (
                        <p className="text-red-500 text-sm mt-1 ms-2">{errors.adminReportEmail}</p>
                    )}
                </div>

                {/* Is Central Head */}
                <div>
                    <div className="flex items-center gap-5">
                        <Label>
                            Send Exam Report To Central Head <span className="text-red-500">*</span>
                        </Label>
                        <input
                            type="checkbox"
                            name="isCentralHead"
                            checked={values.isCentralHead}
                            onBlur={handleBlur}
                            onChange={(e) => trackChange("isCentralHead", e.target.checked)}
                        />
                    </div>
                    {errors.isCentralHead && touched.isCentralHead && (
                        <p className="text-red-500 text-sm mt-1 ms-2">{errors.isCentralHead}</p>
                    )}
                </div>

                {/* Admin Email */}
                <div>
                    <div className="flex items-center gap-5">
                        <Label>
                            Admin Exam Schedule Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="email"
                            name="adminEmail"
                            value={values.adminEmail}
                            onBlur={handleBlur}
                            onChange={(e) => trackChange("adminEmail", e.target.value)}
                        />
                    </div>
                    {errors.adminEmail && touched.adminEmail && (
                        <p className="text-red-500 text-sm mt-1 ms-2">{errors.adminEmail}</p>
                    )}
                </div>

                {/* Complexity Level */}
                <div>
                    <div className="flex items-center gap-4 mt-2">
                        <Label className="mt-6">
                            Complexity Level <span className="text-red-500">*</span>
                        </Label>

                        {/* Easy */}
                        <div>
                            <Label className="text-xs text-green-600 font-medium mb-1 block">Easy</Label>
                            <Input
                                type="number"
                                name="complexityLevel.easy"
                                value={values.complexityLevel?.easy ?? ""}
                                onBlur={handleBlur}
                                onChange={(e) => trackChange("complexityLevel.easy", e.target.value)}
                                placeholder="e.g. 50"
                            />
                            {errors.complexityLevel?.easy && touched.complexityLevel?.easy && (
                                <p className="text-red-500 text-xs mt-1">{errors.complexityLevel.easy}</p>
                            )}
                        </div>

                        {/* Moderate */}
                        <div>
                            <Label className="text-xs text-yellow-600 font-medium mb-1 block">Moderate</Label>
                            <Input
                                type="number"
                                name="complexityLevel.moderate"
                                value={values.complexityLevel?.moderate ?? ""}
                                onBlur={handleBlur}
                                onChange={(e) => trackChange("complexityLevel.moderate", e.target.value)}
                                placeholder="e.g. 25"
                            />
                            {errors.complexityLevel?.moderate && touched.complexityLevel?.moderate && (
                                <p className="text-red-500 text-xs mt-1">{errors.complexityLevel.moderate}</p>
                            )}
                        </div>

                        {/* Difficult */}
                        <div>
                            <Label className="text-xs text-red-600 font-medium mb-1 block">Difficult</Label>
                            <Input
                                type="number"
                                name="complexityLevel.difficult"
                                value={values.complexityLevel?.difficult ?? ""}
                                onBlur={handleBlur}
                                onChange={(e) => trackChange("complexityLevel.difficult", e.target.value)}
                                placeholder="e.g. 25"
                            />
                            {errors.complexityLevel?.difficult && touched.complexityLevel?.difficult && (
                                <p className="text-red-500 text-xs mt-1">{errors.complexityLevel.difficult}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-5">
                    <Button type="submit" size="sm" variant="primary" disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => router.push("/dashboard")}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default SettingPage;