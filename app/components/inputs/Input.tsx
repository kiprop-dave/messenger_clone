"use client";

import clsx from "clsx";
import { FieldValues, UseFormRegister, FieldErrors } from "react-hook-form";

interface InputProps {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  disabled?: boolean;
}

export default function Input({
  label,
  id,
  type,
  register,
  disabled,
  errors,
  required,
}: InputProps) {
  return (
    <div>
      <label htmlFor={id} className="text-sm text-gray-900 leading-6 block font-medium">
        {label}
      </label>
      <div className="mt-2">
        <input
          id={id}
          type={type}
          autoComplete={id}
          disabled={disabled}
          {...register(id, { required })}
          className={clsx(
            `
          form-input
          block 
          w-full 
          rounded-md 
          border-0 
          py-1.5 
          text-gray-900 
          shadow-sm 
          ring-1 
          ring-inset 
          ring-gray-300 
          placeholder:text-gray-400 
          focus:ring-2 
          focus:ring-inset 
          focus:ring-sky-600 
          sm:text-sm 
          sm:leading-6
          `,
            errors[id] && "ring-red-500",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        />
      </div>
    </div>
  );
}
