import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";

import { cn } from "../../lib/utils";

// Root
export function Select(props) {
  return <SelectPrimitive.Root {...props} />;
}

// Group
export function SelectGroup(props) {
  return <SelectPrimitive.Group {...props} />;
}

// Value
export function SelectValue(props) {
  return <SelectPrimitive.Value {...props} />;
}

// Trigger
export function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}) {
  return (
    <SelectPrimitive.Trigger
      data-size={size}
      className={cn(
        "flex w-fit items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm",
        "focus:outline-none focus:ring-2 focus:ring-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[size=default]:h-9 data-[size=sm]:h-8",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

// Content
export function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position={position}
        className={cn(
          "relative z-50 min-w-[8rem] max-h-[--radix-select-content-available-height]",
          "overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-md",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
          "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
          "origin-[--radix-select-content-transform-origin]",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",
          className
        )}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport className="p-1">
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

// Label
export function SelectLabel({ className, ...props }) {
  return (
    <SelectPrimitive.Label
      className={cn(
        "px-2 py-1.5 text-xs text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

// Item
export function SelectItem({
  className,
  children,
  ...props
}) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex w-full cursor-pointer items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm",
        "focus:bg-accent focus:text-accent-foreground",
        "outline-none select-none",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <span className="absolute right-2 flex items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>

      <SelectPrimitive.ItemText>
        {children}
      </SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

// Separator
export function SelectSeparator({
  className,
  ...props
}) {
  return (
    <SelectPrimitive.Separator
      className={cn(
        "pointer-events-none -mx-1 my-1 h-px bg-border",
        className
      )}
      {...props}
    />
  );
}

// Scroll Up
export function SelectScrollUpButton({
  className,
  ...props
}) {
  return (
    <SelectPrimitive.ScrollUpButton
      className={cn(
        "flex items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  );
}

// Scroll Down
export function SelectScrollDownButton({
  className,
  ...props
}) {
  return (
    <SelectPrimitive.ScrollDownButton
      className={cn(
        "flex items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  );
}