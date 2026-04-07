import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "../../lib/utils";
import { Separator } from "../ui/separator"; // ✅ FIXED PATH

// Group
function ItemGroup({ className, ...props }) {
  return (
    <div
      role="list"
      className={cn("flex flex-col", className)}
      {...props}
    />
  );
}

// Separator
function ItemSeparator({ className, ...props }) {
  return (
    <Separator
      orientation="horizontal"
      className={cn("my-1", className)}
      {...props}
    />
  );
}

// Variants
const itemVariants = cva(
  "flex items-center text-sm rounded-md transition-colors flex-wrap outline-none",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-gray-300",
        muted: "bg-gray-100",
      },
      size: {
        default: "p-4 gap-4",
        sm: "py-2 px-3 gap-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Item
function Item({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      className={cn(itemVariants({ variant, size }), className)}
      {...props}
    />
  );
}

// Media
const itemMediaVariants = cva(
  "flex shrink-0 items-center justify-center",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "w-8 h-8 border rounded bg-gray-100 flex items-center justify-center",
        image: "w-10 h-10 rounded overflow-hidden",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function ItemMedia({
  className,
  variant = "default",
  ...props
}) {
  return (
    <div
      className={cn(itemMediaVariants({ variant }), className)}
      {...props}
    />
  );
}

// Content
function ItemContent({ className, ...props }) {
  return (
    <div
      className={cn("flex flex-1 flex-col gap-1", className)}
      {...props}
    />
  );
}

// Title
function ItemTitle({ className, ...props }) {
  return (
    <div
      className={cn("text-sm font-medium", className)}
      {...props}
    />
  );
}

// Description
function ItemDescription({ className, ...props }) {
  return (
    <p
      className={cn("text-sm text-gray-500", className)}
      {...props}
    />
  );
}

// Actions
function ItemActions({ className, ...props }) {
  return (
    <div
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  );
}

// Header
function ItemHeader({ className, ...props }) {
  return (
    <div
      className={cn("flex justify-between items-center gap-2", className)}
      {...props}
    />
  );
}

// Footer
function ItemFooter({ className, ...props }) {
  return (
    <div
      className={cn("flex justify-between items-center gap-2", className)}
      {...props}
    />
  );
}

export {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter,
};