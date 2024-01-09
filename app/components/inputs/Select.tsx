import React from "react";
import ReactSelect from "react-select";

interface SelectProps {
    label: string;
    value?: Record<string, any>;
    onChange: (value: Record<string, any>) => void;
    options: Record<string, any>[];
    disabled?: boolean;
}

export default function Select({
    label,
    value,
    onChange,
    options,
    disabled,
}: SelectProps) {
    return (
        <div className="z-[100]">
            <label className="block text-sm font-medium leading-6 text-gray-900">
                {label}
            </label>
            <div className="mt-2">
                <ReactSelect
                    closeMenuOnSelect={false}
                    isDisabled={disabled}
                    value={value}
                    onChange={onChange}
                    options={options}
                    menuPortalTarget={document.body}
                    isMulti
                    styles={{
                        menuPortal: (base) => ({
                            ...base,
                            zIndex: 9999,
                        }),
                    }}
                    classNames={{
                        control: () => "text-sm",
                    }}
                />
            </div>
        </div>
    );
}
