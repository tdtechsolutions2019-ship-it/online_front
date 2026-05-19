import { useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Label from './Label';
import { CalenderIcon } from '@/icons';
import { DateOption } from 'flatpickr/dist/types/options';
type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: (selectedDates: Date[], dateStr: string) => void; // ✅ FIX
  defaultDate?: DateOption;
  label?: string;
  placeholder?: string;
  value?: string | Date | (string | Date)[]; // ✅ FIX
  disabled?: boolean;
  minDate?: DateOption;
  maxDate?: DateOption;
};
export default function DatePicker({
  id,
  mode,
  onChange,
  label,
  defaultDate,
  placeholder,
  value,
  disabled,
  minDate,
  maxDate,
}: PropsType) {

  const fpRef = useRef<any>(null);

  useEffect(() => {
    fpRef.current = flatpickr(`#${id}`, {
      mode: mode || "single",
      static: true,
      monthSelectorType: "static",
      dateFormat: "Y-m-d",
      defaultDate,
      onChange: (selectedDates, dateStr) => {
        onChange && onChange(selectedDates, dateStr);
      },
      minDate,
      maxDate,

    });

    return () => {
      fpRef.current?.destroy();
    };
  }, []);

  // ✅ Sync value when it changes
  useEffect(() => {


    if (fpRef.current && value) {
      fpRef.current.setDate(value, false);
    }
  }, [value]);
  
  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative">
        <input
          id={id}
          placeholder={placeholder}
          disabled={disabled}
          className="h-11 w-full rounded-lg border px-4 py-2.5 text-sm"
        />

        <span className="absolute right-3 top-1/2 -translate-y-1/2">
          <CalenderIcon className="size-6 cursor-pointer" />
        </span>
      </div>
    </div>
  );
}