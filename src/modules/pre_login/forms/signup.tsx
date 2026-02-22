// components/forms/signup-form.tsx
import { UseFormReturn, FieldValues, Path } from "react-hook-form";
import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { SignupFieldConfig } from "../type";
import { PrimaryButton } from "@/src/shared/components/primary_button";
import Link from "next/link";
import { FormInput } from "@/src/shared/components";


interface SignupFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  fields: SignupFieldConfig[];
  submitbuttonValue:string;
  footerLink?: {
    text: string;
    linkText: string;
    href: string;
  };
}

export function SignupForm<T extends FieldValues>({
  form,
  onSubmit,
  fields,
  submitbuttonValue,
  footerLink
}: SignupFormProps<T>) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {fields.map((config) => (
        <FormField
          key={config.id}
          control={form.control}
          name={config.id as Path<T>}
          render={({ field, fieldState }) => ( // 1. Grab fieldState here
          <FormInput
            field={field}
            label={config.label}
            placeholder={config.placeholder}
            type={config.id.toLowerCase().includes("password") ? "password" : "text"}
            error={fieldState.error?.message ?? ''} 
          />
        )}
      />
        ))}

        <div className="pt-4">
          <PrimaryButton
            type="submit" 
            isLoading={form.formState.isSubmitting}
            >
              {submitbuttonValue}
            </PrimaryButton>
        </div>

        {footerLink && (
          <div className="text-center mt-6">
            <p className="text-slate-500 text-sm">
              {footerLink.text}{" "}
              <Link 
                href={footerLink.href} 
                className="text-blue-600 font-bold underline"
              >
                {footerLink.linkText}
              </Link>
            </p>
          </div>
        )}
      </form>
    </Form>
  );
}