import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type Props = {
    value: string;
    onValueChange: (value: string) => void;
    options: { label: string; value: string }[];
    label?: string;
    placeholder?: string;
};

const Dropdown = ({ label, value, onValueChange, placeholder, options }: Props) => {
    return (
        <div className="flex flex-col w-fit">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <Select onValueChange={onValueChange} value={value}>
                <SelectTrigger className="w-[180px] bg-white">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map(({ label, value }) => (
                        <SelectItem key={value} value={value}>
                            {label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default Dropdown;
