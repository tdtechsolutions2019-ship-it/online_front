"use client";
import React, { use, useEffect } from 'react'
import { toast } from 'react-toastify';

function SubjectWeighttable({ values, setFieldValue, subjectOption, handleChange, isViewMode }) {
    const addRow = () => {
        setFieldValue("subjects", [
            ...values.subjects,
            { subject: "", weight: "" }
        ]);
    };

    const removeRow = (index) => {
        const rows = [...values.subjects];
        rows.splice(index, 1);
        setFieldValue("subjects", rows);
    };

    const totalWeight = values.subjects.reduce(
        (sum, item) => sum + Number(item.weight || 0),
        0
    );

    useEffect(() => {
        console.log("totalWeight", values.total_marks, totalWeight);
        if (totalWeight > values.total_marks) {
            toast.error("“Total weight should not be greater than total marks.");
        }

    }, [])
    return (
        <div className="mt-6">
            <div className="overflow-x-auto">
                <div className="border border-gray-200 rounded-xl overflow-hidden">

                    {/* Header */}
                    <div className="grid grid-cols-[1fr_160px_56px] gap-3 px-5 py-3 bg-gray-50 border-b border-gray-200">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Subject</span>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Weightage</span>
                        <span></span>
                    </div>

                    {/* Rows */}
                    {values.subjects.map((row, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-[1fr_160px_56px] gap-3 items-center px-5 py-2.5 border-b border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                            {/* Subject */}
                            <select
                                name={`subjects.${index}.subject`}
                                value={row.subject}
                                onChange={handleChange}
                                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 12px center',
                                    paddingRight: '32px',
                                }}
                                disabled={isViewMode}
                            >
                                <option value="">Select Subject</option>
                                {subjectOption.map((item) => {
                                    const isSelectedElsewhere = values.subjects.some(
                                        (s, i) => i !== index && s.subject === item.value
                                    );
                                    console.log("isSelectedElsewhere", isSelectedElsewhere, values.subjects, item)
                                    const isCurrentRowValue = item.value === row.subject;

                                    // Always show current row's own selected value
                                    // Hide if selected in any other row
                                    if (isSelectedElsewhere && !isCurrentRowValue) return null;
                                    return (
                                        <option key={item.id} value={item.value}>{item.label}</option>
                                    );
                                })}
                            </select>

                            {/* Weight */}
                            <input
                                type="number"
                                name={`subjects.${index}.weight`}
                                value={row.weight}
                                disabled={isViewMode}
                                onChange={handleChange}
                                onBlur={() => {
                                    if (totalWeight > values.total_marks) {
                                        toast.error("Total weight should not be greater than total marks.");
                                    }
                                }}
                                placeholder="Weight"
                                className="w-full px-3 py-2 text-sm font-medium bg-gray-50 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400 placeholder:font-normal"
                            />

                            {/* Remove */}
                            {!isViewMode && <div className="flex justify-center">
                                {values.subjects.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeRow(index)}
                                        title="Remove row"
                                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                            <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                                        </svg>
                                    </button>
                                )}
                            </div>}
                        </div>
                    ))}

                    {/* Add Subject Strip */}
                    {!isViewMode && <div
                        onClick={addRow}
                        className="group flex items-center gap-3 px-5 border-b border-gray-200 h-11 cursor-pointer hover:bg-emerald-50 transition-colors"
                    >
                        <div className="flex-1 h-px bg-gray-200 group-hover:bg-emerald-400 transition-colors" />
                        <div className="w-6 h-6 rounded-full bg-gray-300 group-hover:bg-emerald-500 flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-110 group-hover:rotate-90">
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                <path d="M5 1v8M1 5h8" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
                            </svg>
                        </div>
                        <span className="text-xs font-medium text-gray-400 group-hover:text-emerald-700 transition-colors whitespace-nowrap">
                            Add subject
                        </span>
                        <div className="flex-1 h-px bg-gray-200 group-hover:bg-emerald-400 transition-colors" />
                    </div>}

                    {/* Total */}
                    <div className="grid grid-cols-[1fr_160px_56px] gap-3 items-center px-5 py-3.5 bg-gray-50 border-t border-gray-200">
                        <span className="text-xl font-semibold text-gray-600 uppercase tracking-wide text-right">Total</span>
                        <span className={`text-xl font-semibold text-end text-emerald-600
                        `}>
                            {totalWeight}
                        </span>
                        <span></span>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default SubjectWeighttable
