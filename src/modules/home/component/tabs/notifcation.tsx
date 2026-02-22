"use client";

import React from "react";
import { UseFormReturn, FieldValues, useWatch } from "react-hook-form";
import { Form, FormField, FormItem, FormControl, FormLabel, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { FormInput } from "@/src/shared/components"; 
import { PrimaryButton } from "@/src/shared/components/primary_button";
import { NOTIFICATION_SECTIONS, NotificationFieldConfig } from "../../constants/notifications";
import { cn } from "@/lib/utils";

interface NotificationFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  submitButtonValue: string;
}

export function Notification<T extends FieldValues>({ 
  form, 
  onSubmit, 
  submitButtonValue 
}: NotificationFormProps<T>) {
  const formValues = useWatch({ control: form.control });

  const renderDynamicFields = (fields: NotificationFieldConfig<T>[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 px-1 md:px-4 mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
      {fields.map((config) => (
        <FormField
          key={config.id}
          control={form.control}
          name={config.id}
          render={({ field, fieldState }) => (
            <FormInput
              field={field}
              label={config.label}
              placeholder={config.placeholder}
              type={config.type || "text"}
              error={fieldState.error?.message}
              // Added subtle background for mobile inputs to distinguish from section background
            />
          )}
        />
      ))}
    </div>
  );

  return (
    <div className="w-full bg-white max-w-4xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:space-y-10">
          
          {(NOTIFICATION_SECTIONS as unknown as any[]).map((section) => {
            const isEnabled = !!formValues[section.id];
            const Icon = section.icon;

            return (
              <div key={section.id} className="group">
                <FormField
                  control={form.control}
                  name={section.id}
                  render={({ field }) => (
                    <FormItem className={cn(
                      "flex items-start sm:items-center justify-between p-5 md:p-7 border transition-all duration-300",
                      "rounded-3xl md:rounded-[2.5rem]", // Adjusted radius for mobile
                      isEnabled 
                        ? "bg-white border-blue-200 shadow-sm" 
                        : "bg-slate-50 border-slate-200/60"
                    )}>
                      <div className="flex items-start gap-3 md:gap-5">
                        {/* Icon - Smaller on mobile */}
                        <div className={cn(
                          "p-2.5 md:p-3.5 rounded-xl md:rounded-2xl transition-colors shrink-0",
                          isEnabled ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600"
                        )}>
                          <Icon size={20} className="md:w-6 md:h-6" />
                        </div>

                        <div className="space-y-1">
                          <FormLabel className="text-base md:text-lg font-black text-slate-900 tracking-tight block">
                            {section.title}
                          </FormLabel>
                          <FormDescription className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed pr-2">
                            {section.description}
                          </FormDescription>
                        </div>
                      </div>

                      <FormControl className="mt-1 sm:mt-0">
                        <Switch 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                          className="scale-90 md:scale-100 data-[state=checked]:bg-blue-600"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {isEnabled && renderDynamicFields(section.fields)}
              </div>
            );
          })}

          {/* Sticky-ish or full-width button for mobile */}
          <div className="pt-4 pb-8 md:pt-6 px-1">
            <PrimaryButton 
              type="submit" 
              isLoading={form.formState.isSubmitting}
              className="w-full md:w-auto min-w-[240px] rounded-2xl h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-100 transition-all active:scale-[0.98]"
            >
              {submitButtonValue}
            </PrimaryButton>
          </div>
        </form>
      </Form>
    </div>
  );
}