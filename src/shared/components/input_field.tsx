// components/ui/form-input.tsx
"use client"; // Ensure this is a client component

import { useState } from "react";
import { FieldValues, Path, ControllerRenderProps } from "react-hook-form";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react"; // Import icons

interface FormInputProps<T extends FieldValues> {
  field: ControllerRenderProps<T, Path<T>>;
  label: string;
  placeholder?: string;
  type?: string;
  error?: string;
}

export function FormInput<T extends FieldValues>({
  field,
  label,
  placeholder,
  type = "text",
  error
}: FormInputProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

  // Check if this specific input is a password type
  const isPasswordField = type === "password";
  
  // Determine the actual HTML input type to render
  const inputType = isPasswordField ? (showPassword ? "text" : "password") : type;

  return (
    <FormItem className="w-full">
      <FormLabel className="text-black font-medium">{label}</FormLabel>
      <FormControl>
        <div className="relative">
          <Input 
            {...field} 
            type={inputType} 
            placeholder={placeholder} 
            className={cn(
              "h-12 border-slate-200 transition-all pr-10", // Added padding-right for the icon
              "text-black font-normal",
              "placeholder:text-slate-400",
              "focus:border-[#04374E] focus:ring-1 focus:ring-[#04374E]"
            )}
            value={(field.value as string) ?? ""} 
          />
          
          {isPasswordField && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 focus:outline-none"
              tabIndex={-1} // Prevents tabbing into the eye icon
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
      </FormControl>
      <FormMessage className="text-xs text-red-600 font-medium mt-1">
        {error}
      </FormMessage>
    </FormItem>
  );
}