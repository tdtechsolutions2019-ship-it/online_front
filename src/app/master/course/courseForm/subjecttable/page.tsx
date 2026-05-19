"use client";

import React, { useEffect } from "react";
import { toast } from "react-toastify";

function SubjectWeighttable({
    values = {},
    setFieldValue,
    subjectOption = [],
    handleChange,
    isViewMode = false,
}: any) {
    const subjects = values?.subjects || [];

    const addRow = () => {
        setFieldValue("subjects", [
            ...subjects,
            { subject: "", weight: "" },
        ]);
    };

    const removeRow = (index: number) => {
        const rows = [...subjects];
        rows.splice(index, 1);
        setFieldValue("subjects", rows);
    };

    const totalWeight = subjects.reduce(
        (sum: number, item: any) => sum + Number(item?.weight || 0),
        0
    );

    useEffect(() => {
        if (
            values?.total_marks &&
            totalWeight > Number(values.total_marks)
        ) {
            toast.error(
                "Total weight should not be greater than total marks."
            );
        }
    }, [totalWeight, values?.total_marks]);

    return (
        <div className="mt-6">
            <div className="overflow-x-auto">
                <div className="border border-gray-200 rounded-xl overflow-hidden">

                    <div className="grid grid-cols-[1fr_160px_56px] gap-3 px-5 py-3 bg-gray-50 border-b border-gray-200">
                        <span className="text-xs font-medium text-gray-500 uppercase">
                            Subject
                        </span>

                        <span className="text-xs font-medium text-gray-500 uppercase">
                            Weightage
                        </span>

                        <span />
                    </div>

                    {subjects.map((row: any, index: number) => (
                        <div
                            key={index}
                            className="grid grid-cols-[1fr_160px_56px] gap-3 items-center px-5 py-2.5 border-b"
                        >
                            <select
                                name={`subjects.${index}.subject`}
                                value={row?.subject || ""}
                                onChange={handleChange}
                                disabled={isViewMode}
                                className="w-full px-3 py-2 text-sm bg-gray-50 border rounded-lg"
                            >
                                <option value="">Select Subject</option>

                                {(subjectOption || []).map((item: any) => {
                                    const isSelectedElsewhere = subjects.some(
                                        (s: any, i: number) =>
                                            i !== index &&
                                            s?.subject === item?.value
                                    );

                                    const isCurrentRowValue =
                                        item?.value === row?.subject;

                                    if (
                                        isSelectedElsewhere &&
                                        !isCurrentRowValue
                                    )
                                        return null;

                                    return (
                                        <option
                                            key={item?.id}
                                            value={item?.value}
                                        >
                                            {item?.label}
                                        </option>
                                    );
                                })}
                            </select>

                            <input
                                type="number"
                                name={`subjects.${index}.weight`}
                                value={row?.weight || ""}
                                disabled={isViewMode}
                                onChange={handleChange}
                                placeholder="Weight"
                                className="w-full px-3 py-2 border rounded-lg"
                            />

                            {!isViewMode && (
                                <div className="flex justify-center">
                                    {subjects.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeRow(index)
                                            }
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}

                    {!isViewMode && (
                        <div
                            onClick={addRow}
                            className="p-3 text-center cursor-pointer"
                        >
                            Add subject
                        </div>
                    )}

                    <div className="grid grid-cols-[1fr_160px_56px] px-5 py-3 bg-gray-50">
                        <span className="text-right font-semibold">
                            Total
                        </span>

                        <span className="text-right font-semibold">
                            {totalWeight}
                        </span>

                        <span />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SubjectWeighttable;