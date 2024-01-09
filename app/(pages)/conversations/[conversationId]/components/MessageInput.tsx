import React from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface MessageInputProps {
    id: HTMLInputElement["id"];
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors;
    type?: HTMLInputElement["type"];
    required?: boolean;
    placeholder?: string;
}

export default function MessageInput({
    id,
    register,
    errors,
    type,
    required,
    placeholder,
}: MessageInputProps) {
    return (
        <div className="relative w-full">
            <input
                id={id}
                type={type}
                autoComplete={id}
                placeholder={placeholder}
                {...register(id, { required })}
                className="
                    w-full 
                    rounded-full 
                    bg-neutral-100 
                    px-4 
                    py-2 
                    font-light 
                    text-black 
                    focus:outline-none"
            />
        </div>
    );
}
