/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from "react";

const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

// Added basic types for the props if you are using TypeScript
interface MonthYearPickerProps {
    value: string | null;
    onChange: (value: string) => void;
}

export default function MonthYearPicker({ value, onChange }: MonthYearPickerProps) {
    
    const [open, setOpen] = useState(false);
    const [year, setYear] = useState(new Date().getFullYear());
    
    // ✅ FIX: Added <HTMLDivElement> and initialized with (null)
    const ref = useRef<HTMLDivElement>(null);

    // ✅ Handle value safely (string only: yyyy-MM)
    const selectedMonth =
        typeof value === "string" ? Number(value.split("-")[1]) : null;

    const selectedYear =
        typeof value === "string" ? Number(value.split("-")[0]) : null;

    // ✅ Sync year when value changes
    useEffect(() => {
        if (selectedYear) {
            setYear(selectedYear);
        }
    }, [selectedYear]);

    // ✅ Close on outside click
    useEffect(() => {
        // Added MouseEvent type here
        const handleClickOutside = (e: MouseEvent) => {
            // Added 'as Node' to satisfy TypeScript's DOM type checking
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ✅ Select month
    const handleSelect = (month: number) => {
        onChange(`${year}-${String(month).padStart(2, "0")}`);
        setOpen(false);
    };
    
    const currentYear = new Date().getFullYear();
    
    return (
        <div ref={ref} className="relative w-full">

            {/* Input */}
            <div
                onClick={() => setOpen(!open)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg cursor-pointer 
        dark:border-gray-600 dark:bg-gray-700 dark:text-white 
        focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                {value && selectedMonth && selectedYear
                    ? `${months[selectedMonth - 1]} ${selectedYear}`
                    : "Select month & year"}
            </div>

            {/* Dropdown */}
            {open && (
                <div className="absolute z-50 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg p-3">

                    {/* Year Selector */}
                    <div className="flex justify-between items-center mb-3">
                        {/* Previous Year */}
                        <button
                            type="button"
                            onClick={() => setYear((prev) => prev - 1)}
                            className="px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                            ◀
                        </button>

                        <span className="text-sm font-semibold">{year}</span>

                        {/* Next Year (Disabled if current year) */}
                        <button
                            type="button"
                            onClick={() => {
                                if (year < currentYear) {
                                    setYear((prev) => prev + 1);
                                }
                            }}
                            disabled={year >= currentYear}
                            className={`px-2 py-1 text-sm rounded
      ${year >= currentYear
                                    ? "opacity-40 cursor-not-allowed"
                                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                                }`}
                        >
                            ▶
                        </button>
                    </div>
                    {/* Months Grid */}
                    <div className="grid grid-cols-3 gap-2">
                        {months.map((m, i) => {
                            const isSelected =
                                selectedMonth === i + 1 && selectedYear === year;

                            return (
                                <button
                                    key={i}
                                    onClick={() => handleSelect(i + 1)}
                                    className={`py-2 text-sm rounded-lg transition
                    ${isSelected
                                            ? "bg-blue-500 text-white"
                                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                                        }`}
                                >
                                    {m}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}