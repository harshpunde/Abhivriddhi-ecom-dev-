import * as React from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import {
  Check,
  ChevronRight,
  Circle,
} from "lucide-react";

import { cn } from "../../lib/utils";

// Root
function ContextMenu(props) {
  return <ContextMenuPrimitive.Root {...props} />;
}

// Trigger
function ContextMenuTrigger(props) {
  return <ContextMenuPrimitive.Trigger {...props} />;
}

// Content
function ContextMenuContent({ className, ...props }) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        className={cn(
          "z-50 min-w-[160px] bg-white border rounded-md shadow-md p-1",
          className
        )}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  );
}

// Item
function ContextMenuItem({ className, inset, ...props }) {
  return (
    <ContextMenuPrimitive.Item
      className={cn(
        "flex items-center gap-2 px-2 py-2 text-sm rounded cursor-pointer hover:bg-gray-100",
        inset && "pl-8",
        className
      )}
      {...props}
    />
  );
}

// Checkbox Item
function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      className={cn(
        "flex items-center gap-2 px-2 py-2 pl-8 text-sm rounded cursor-pointer hover:bg-gray-100",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="absolute left-2">
        <ContextMenuPrimitive.ItemIndicator>
          <Check className="w-4 h-4" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  );
}

// Radio Item
function ContextMenuRadioItem({
  className,
  children,
  ...props
}) {
  return (
    <ContextMenuPrimitive.RadioItem
      className={cn(
        "flex items-center gap-2 px-2 py-2 pl-8 text-sm rounded cursor-pointer hover:bg-gray-100",
        className
      )}
      {...props}
    >
      <span className="absolute left-2">
        <ContextMenuPrimitive.ItemIndicator>
          <Circle className="w-3 h-3 fill-black" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  );
}

// Label
function ContextMenuLabel({ className, inset, ...props }) {
  return (
    <ContextMenuPrimitive.Label
      className={cn(
        "px-2 py-1 text-sm font-medium text-gray-700",
        inset && "pl-8",
        className
      )}
      {...props}
    />
  );
}

// Separator
function ContextMenuSeparator({ className, ...props }) {
  return (
    <ContextMenuPrimitive.Separator
      className={cn("h-px bg-gray-200 my-1", className)}
      {...props}
    />
  );
}

// Shortcut
function ContextMenuShortcut({ className, ...props }) {
  return (
    <span
      className={cn("ml-auto text-xs text-gray-400", className)}
      {...props}
    />
  );
}

// Sub Menu
function ContextMenuSub(props) {
  return <ContextMenuPrimitive.Sub {...props} />;
}

function ContextMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}) {
  return (
    <ContextMenuPrimitive.SubTrigger
      className={cn(
        "flex items-center px-2 py-2 text-sm rounded cursor-pointer hover:bg-gray-100",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto w-4 h-4" />
    </ContextMenuPrimitive.SubTrigger>
  );
}

function ContextMenuSubContent({ className, ...props }) {
  return (
    <ContextMenuPrimitive.SubContent
      className={cn(
        "bg-white border rounded-md shadow-md p-1 min-w-[160px]",
        className
      )}
      {...props}
    />
  );
}

// Group + Portal + RadioGroup
function ContextMenuGroup(props) {
  return <ContextMenuPrimitive.Group {...props} />;
}

function ContextMenuPortal(props) {
  return <ContextMenuPrimitive.Portal {...props} />;
}

function ContextMenuRadioGroup(props) {
  return <ContextMenuPrimitive.RadioGroup {...props} />;
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};