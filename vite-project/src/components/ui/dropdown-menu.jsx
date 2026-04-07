import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import {
  CheckIcon,
  ChevronRightIcon,
  CircleIcon,
} from "lucide-react";

import { cn } from "../../lib/utils";

// Root
export function DropdownMenu(props) {
  return <DropdownMenuPrimitive.Root {...props} />;
}

// Trigger
export function DropdownMenuTrigger(props) {
  return <DropdownMenuPrimitive.Trigger {...props} />;
}

// Content
export function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[8rem] max-h-[--radix-dropdown-menu-content-available-height] origin-[--radix-dropdown-menu-content-transform-origin] overflow-auto rounded-md border bg-popover text-popover-foreground p-1 shadow-md",
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
    </DropdownMenuPrimitive.Portal>
  );
}

// Group
export function DropdownMenuGroup(props) {
  return <DropdownMenuPrimitive.Group {...props} />;
}

// Item
export function DropdownMenuItem({
  className,
  inset,
  ...props
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-inset={inset}
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none",
        "focus:bg-accent focus:text-accent-foreground",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        inset && "pl-8",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4",
        className
      )}
      {...props}
    />
  );
}

// Checkbox Item
export function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      checked={checked}
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none select-none",
        "focus:bg-accent focus:text-accent-foreground",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

// Radio Group
export function DropdownMenuRadioGroup(props) {
  return <DropdownMenuPrimitive.RadioGroup {...props} />;
}

// Radio Item
export function DropdownMenuRadioItem({
  className,
  children,
  ...props
}) {
  return (
    <DropdownMenuPrimitive.RadioItem
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none select-none",
        "focus:bg-accent focus:text-accent-foreground",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

// Label
export function DropdownMenuLabel({
  className,
  inset,
  ...props
}) {
  return (
    <DropdownMenuPrimitive.Label
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
export function DropdownMenuSeparator({
  className,
  ...props
}) {
  return (
    <DropdownMenuPrimitive.Separator
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

// Shortcut
export function DropdownMenuShortcut({
  className,
  ...props
}) {
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
export function DropdownMenuSub(props) {
  return <DropdownMenuPrimitive.Sub {...props} />;
}

// Sub Trigger
export function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      className={cn(
        "flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none",
        "focus:bg-accent focus:text-accent-foreground",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

// Sub Content
export function DropdownMenuSubContent({
  className,
  ...props
}) {
  return (
    <DropdownMenuPrimitive.SubContent
      className={cn(
        "z-50 min-w-[8rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-lg",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        className
      )}
      {...props}
    />
  );
}