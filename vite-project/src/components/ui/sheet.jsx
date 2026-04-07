"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

import { cn } from "../../lib/utils";

// Root
export function Sheet(props) {
  return <SheetPrimitive.Root {...props} />;
}

// Trigger
export function SheetTrigger(props) {
  return <SheetPrimitive.Trigger {...props} />;
}

// Close
export function SheetClose(props) {
  return <SheetPrimitive.Close {...props} />;
}

// Portal
export function SheetPortal(props) {
  return <SheetPrimitive.Portal {...props} />;
}

// Overlay
export function SheetOverlay({ className, ...props }) {
  return (
    <SheetPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-black/50",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
        className
      )}
      {...props}
    />
  );
}

// Content
export function SheetContent({
  className,
  children,
  side = "right",
  ...props
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        className={cn(
          "fixed z-50 flex flex-col gap-4 bg-background shadow-lg transition",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",

          // sides
          side === "right" &&
            "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
          side === "left" &&
            "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
          side === "top" &&
            "inset-x-0 top-0 border-b data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top",
          side === "bottom" &&
            "inset-x-0 bottom-0 border-t data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",

          className
        )}
        {...props}
      >
        {children}

        <SheetPrimitive.Close
          className={cn(
            "absolute right-4 top-4 rounded-md p-1 opacity-70 transition-opacity",
            "hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring",
            "disabled:pointer-events-none"
          )}
        >
          <XIcon className="size-4" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

// Header
export function SheetHeader({ className, ...props }) {
  return (
    <div
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    />
  );
}

// Footer
export function SheetFooter({ className, ...props }) {
  return (
    <div
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  );
}

// Title
export function SheetTitle({ className, ...props }) {
  return (
    <SheetPrimitive.Title
      className={cn("text-foreground font-semibold", className)}
      {...props}
    />
  );
}

// Description
export function SheetDescription({ className, ...props }) {
  return (
    <SheetPrimitive.Description
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}