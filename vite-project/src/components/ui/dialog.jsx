import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "../../lib/utils";

// Root
function Dialog(props) {
  return <DialogPrimitive.Root {...props} />;
}

// Trigger
function DialogTrigger(props) {
  return <DialogPrimitive.Trigger {...props} />;
}

// Portal
function DialogPortal(props) {
  return <DialogPrimitive.Portal {...props} />;
}

// Close
function DialogClose(props) {
  return <DialogPrimitive.Close {...props} />;
}

// Overlay
function DialogOverlay({ className, ...props }) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  );
}

// Content
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          "fixed top-1/2 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white border rounded-lg p-6 shadow-lg",
          className
        )}
        {...props}
      >
        {children}

        {showCloseButton && (
          <DialogPrimitive.Close
            className="absolute top-4 right-4 opacity-70 hover:opacity-100 focus:outline-none"
          >
            <X className="w-4 h-4" />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

// Header
function DialogHeader({ className, ...props }) {
  return (
    <div
      className={cn("flex flex-col gap-2 text-left", className)}
      {...props}
    />
  );
}

// Footer
function DialogFooter({ className, ...props }) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}

// Title
function DialogTitle({ className, ...props }) {
  return (
    <DialogPrimitive.Title
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  );
}

// Description
function DialogDescription({ className, ...props }) {
  return (
    <DialogPrimitive.Description
      className={cn("text-sm text-gray-500", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogClose,
};