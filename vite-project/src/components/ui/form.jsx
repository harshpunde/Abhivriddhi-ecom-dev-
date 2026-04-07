import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
} from "react-hook-form";

import { cn } from "../../lib/utils";
import { Label } from "../ui/label"; // ✅ FIXED PATH

// Form Provider
const Form = FormProvider;

// Contexts
const FormFieldContext = React.createContext(null);
const FormItemContext = React.createContext(null);

// FormField
function FormField(props) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

// Hook
function useFormField() {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState } = useFormContext();

  const formState = useFormState({ name: fieldContext?.name });
  const fieldState = getFieldState(fieldContext?.name, formState);

  if (!fieldContext || !itemContext) {
    throw new Error("useFormField must be used inside FormField & FormItem");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-description`,
    formMessageId: `${id}-message`,
    ...fieldState,
  };
}

// FormItem
function FormItem({ className, ...props }) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div className={cn("grid gap-2", className)} {...props} />
    </FormItemContext.Provider>
  );
}

// Label
function FormLabel({ className, ...props }) {
  const { error, formItemId } = useFormField();

  return (
    <Label
      className={cn(error && "text-red-600", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
}

// Control
function FormControl(props) {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      id={formItemId}
      aria-describedby={
        error
          ? `${formDescriptionId} ${formMessageId}`
          : formDescriptionId
      }
      aria-invalid={!!error}
      {...props}
    />
  );
}

// Description
function FormDescription({ className, ...props }) {
  const { formDescriptionId } = useFormField();

  return (
    <p
      id={formDescriptionId}
      className={cn("text-sm text-gray-500", className)}
      {...props}
    />
  );
}

// Message (Error)
function FormMessage({ className, children, ...props }) {
  const { error, formMessageId } = useFormField();

  const body = error ? error.message : children;

  if (!body) return null;

  return (
    <p
      id={formMessageId}
      className={cn("text-sm text-red-600", className)}
      {...props}
    >
      {body}
    </p>
  );
}

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  useFormField,
};