import { ChevronDownIcon } from "@/icons";
import Select from "react-select";
type OptionType = {
    value: string;
    label: string;
};
interface Props {
    centerCodeOptions: OptionType[];
    setSearchParams: React.Dispatch<React.SetStateAction<any>>;
    value: string;

}

function SelectToDropdown({ centerCodeOptions, setSearchParams, value }: Props) {
    const selectedOption =
        centerCodeOptions.find((opt) => opt.value === value) || null;
    return (
        <div className="relative">

            <Select<OptionType>
                className="z-99999"
                options={centerCodeOptions}
                value={selectedOption}
                isClearable
                onChange={(option) =>
                    setSearchParams((prev) => ({
                        ...prev,
                        center_name: option?.value || "",
                    }))
                }
            />
            {/* <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <ChevronDownIcon />
            </span> */}
        </div>
    );
}

export default SelectToDropdown;