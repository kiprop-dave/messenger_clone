"use client";

import { FieldValues, UseFormRegister, FieldErrors } from "react-hook-form";

interface MessageInputProps {
  placeholder?: string;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  id: string;
  type?: string;
  required?: boolean;
}

export default function MessageInput({
  placeholder,
  register,
  errors,
  id,
  type,
  required,
}: MessageInputProps): JSX.Element {
  return (
    <div className="w-full relative">
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete="off"
        {...register(id, { required })}
        className="w-full h-12 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-neutral-100"
      />
    </div>
  );
}
