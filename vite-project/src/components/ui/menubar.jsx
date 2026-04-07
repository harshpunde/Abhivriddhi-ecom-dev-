import * as React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import {
  CheckIcon,
  ChevronRightIcon,
  CircleIcon,
} from "lucide-react";

import { cn } from "../../lib/utils";

// Root
export function Menubar({ className, ...props }) {
  return (
    <MenubarPrimitive.Root
      className={cn(
        "bg-background flex h-9 items-center gap-1 rounded-md border p-1 shadow-sm",
        className
      )}
      {...props}
    />
  );
}

// Menu
export function MenubarMenu(props) {
  return <MenubarPrimitive.Menu {...props} />;
}

// Group
export function MenubarGroup(props) {
  return <MenubarPrimitive.Group {...props} />;
}

// Portal
export function MenubarPortal(props) {
  return <MenubarPrimitive.Portal {...props} />;
}

// Radio Group
export function MenubarRadioGroup(props) {
  return <MenubarPrimitive.RadioGroup {...props} />;
}

// Trigger
export function MenubarTrigger({ className, ...props }) {
  return (
    <MenubarPrimitive.Trigger
      className={cn(
        "flex items-center rounded-sm px-2 py-1 text-sm font-medium outline-none select-none",
        "focus:bg-accent focus:text-accent-foreground",
        "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
        className
      )}
      {...props}
    />
  );
}

// Content
export function MenubarContent({
  className,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  ...props
}) {
  return (
    <MenubarPortal>
      <MenubarPrimitive.Content
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover text-popover-foreground p-1 shadow-md",
          "origin-[--radix-menubar-content-transform-origin]",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
          "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
          "data-[side=bottom]:slide-in-from-top-2",
          "data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2",
          "data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      />
    </MenubarPortal>
  );
}

// Item
export function MenubarItem({
  className,
  inset,
  variant = "default",
  ...props
}) {
  return (
    <MenubarPrimitive.Item
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none",
        "focus:bg-accent focus:text-accent-foreground",
        "hover:bg-accent hover:text-accent-foreground",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        inset && "pl-8",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4",
        variant === "destructive" &&
          "text-destructive focus:text-destructive",
        className
      )}
      {...props}
    />
  );
}

// Checkbox Item
export function MenubarCheckboxItem({
  className,
  children,
  checked,
  ...props
}) {
  return (
    <MenubarPrimitive.CheckboxItem
      checked={checked}
      className={cn(
        "relative flex cursor-pointer items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none select-none",
        "focus:bg-accent focus:text-accent-foreground",
        "hover:bg-accent hover:text-accent-foreground",
        "data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  );
}

// Radio Item
export function MenubarRadioItem({
  className,
  children,
  ...props
}) {
  return (
    <MenubarPrimitive.RadioItem
      className={cn(
        "relative flex cursor-pointer items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none select-none",
        "focus:bg-accent focus:text-accent-foreground",
        "hover:bg-accent hover:text-accent-foreground",
        "data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  );
}

// Label
export function MenubarLabel({ className, inset, ...props }) {
  return (
    <MenubarPrimitive.Label
      className={cn(
        "px-2 py-1.5 text-sm font-medium",
        inset && "pl-8",
        className
      )}
      {...props}
    />
  );
}

// Separator
export function MenubarSeparator({ className, ...props }) {
  return (
    <MenubarPrimitive.Separator
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

// Shortcut
export function MenubarShortcut({ className, ...props }) {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

// Sub Menu
export function MenubarSub(props) {
  return <MenubarPrimitive.Sub {...props} />;
}

// Sub Trigger
export function MenubarSubTrigger({
  className,
  inset,
  children,
  ...props
}) {
  return (
    <MenubarPrimitive.SubTrigger
      className={cn(
        "flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none",
        "focus:bg-accent focus:text-accent-foreground",
        "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </MenubarPrimitive.SubTrigger>
  );
}

// Sub Content
export function MenubarSubContent({ className, ...props }) {
  return (
    <MenubarPrimitive.SubContent
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg",
        "origin-[--radix-menubar-content-transform-origin]",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        className
      )}
      {...props}
    />
  );
}