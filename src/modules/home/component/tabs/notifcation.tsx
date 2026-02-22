"use client";

import React from "react";
import { UseFormReturn, FieldValues, useWatch } from "react-hook-form";
import { Form, FormField, FormItem, FormControl, FormLabel, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { FormInput } from "@/src/shared/components"; 
import { PrimaryButton } from "@/src/shared/components/primary_button";
import { NOTIFICATION_SECTIONS, NotificationFieldConfig } from "../../constants/notifications";

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
  
  // Watch all values to check the boolean state of section toggles
  const formValues = useWatch({ control: form.control });

  /**
   * Renders the input fields associated with a section.
   * Type safety is maintained because NotificationFieldConfig now uses Path<T>.
   */
  const renderDynamicFields = (fields: NotificationFieldConfig<T>[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-4 mt-6 animate-in fade-in slide-in-from-top-4 duration-500">
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
            />
          )}
        />
      ))}
    </div>
  );

  return (
    <div className="w-full bg-white">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          
          {/* Map through sections defined in your constants */}
          {(NOTIFICATION_SECTIONS as unknown as any[]).map((section) => {
            // Check if this specific section's toggle is currently 'true'
            const isEnabled = !!formValues[section.id];
            const Icon = section.icon;

            return (
              <div key={section.id} className="group">
                <FormField
                  control={form.control}
                  name={section.id}
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-7 bg-[#F8FAFC] border border-slate-200/60 rounded-[2.5rem] transition-all duration-300 hover:shadow-md hover:bg-white hover:border-blue-100">
                      <div className="flex items-center gap-5">
                        <div className="p-3.5 bg-blue-50 rounded-2xl text-blue-600 shadow-sm">
                          <Icon size={24} />
                        </div>
                        <div className="space-y-1 text-left">
                          <FormLabel className="text-lg font-black text-slate-900 tracking-tight">
                            {section.title}
                          </FormLabel>
                          <FormDescription className="text-sm text-slate-500 font-medium">
                            {section.description}
                          </FormDescription>
                        </div>
                      </div>
                      <FormControl>
                        <Switch 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-slate-200"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Show fields only when the master switch is ON */}
                {isEnabled && renderDynamicFields(section.fields)}
              </div>
            );
          })}

          <div className="pt-6 px-2">
            <PrimaryButton 
              type="submit" 
              isLoading={form.formState.isSubmitting}
              className="w-full md:w-auto min-w-[200px] rounded-2xl h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-xl shadow-blue-100 transition-all active:scale-[0.98]"
            >
              {submitButtonValue}
            </PrimaryButton>
          </div>
        </form>
      </Form>
    </div>
  );
}