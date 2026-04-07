"use client";

import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "../../lib/utils";

// Provider
export const ToastProvider = ToastPrimitives.Provider;

// Viewport
export const ToastViewport = React.forwardRef(function ToastViewport(
  { className, ...props },
  ref
) {
  return (
    <ToastPrimitives.Viewport
      ref={ref}
      className={cn(
        "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4",
        "sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
        className
      )}
      {...props}
    />
  );
});

// Variants
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// Toast
export const Toast = React.forwardRef(function Toast(
  { className, variant = "default", ...props },
  ref
) {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
});

// Action
export const ToastAction = React.forwardRef(function ToastAction(
  { className, ...props },
  ref
) {
  return (
    <ToastPrimitives.Action
      ref={ref}
      className={cn(
        "inline-flex h-8 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors",
        "hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});

// Close
export const ToastClose = React.forwardRef(function ToastClose(
  { className, ...props },
  ref
) {
  return (
    <ToastPrimitives.Close
      ref={ref}
      className={cn(
        "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity",
        "hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2",
        "group-hover:opacity-100",
        className
      )}
      {...props}
    >
      <X className="size-4" />
    </ToastPrimitives.Close>
  );
});

// Title
export const ToastTitle = React.forwardRef(function ToastTitle(
  { className, ...props },
  ref
) {
  return (
    <ToastPrimitives.Title
      ref={ref}
      className={cn("text-sm font-semibold", className)}
      {...props}
    />
  );
});

// Description
export const ToastDescription = React.forwardRef(function ToastDescription(
  { className, ...props },
  ref
) {
  return (
    <ToastPrimitives.Description
      ref={ref}
      className={cn("text-sm opacity-90", className)}
      {...props}
    />
  );
});