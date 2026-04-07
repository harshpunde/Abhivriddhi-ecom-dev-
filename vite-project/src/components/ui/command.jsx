import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";

import { cn } from "../../lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"; // ✅ FIXED PATH

// Main Command
function Command({ className, ...props }) {
  return (
    <CommandPrimitive
      className={cn(
        "bg-white text-black flex h-full w-full flex-col overflow-hidden rounded-md border",
        className
      )}
      {...props}
    />
  );
}

// Dialog Wrapper
function CommandDialog({
  title = "Command Palette",
  description = "Search for a command...",
  children,
  className,
  showCloseButton = true,
  ...props
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>

      <DialogContent
        className={cn("overflow-hidden p-0", className)}
        showCloseButton={showCloseButton}
      >
        <Command>
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
}

// Input
function CommandInput({ className, ...props }) {
  return (
    <div className="flex items-center gap-2 border-b px-3">
      <Search className="w-4 h-4 opacity-50" />
      <CommandPrimitive.Input
        className={cn(
          "w-full bg-transparent py-2 text-sm outline-none placeholder:text-gray-400",
          className
        )}
        {...props}
      />
    </div>
  );
}

// List
function CommandList({ className, ...props }) {
  return (
    <CommandPrimitive.List
      className={cn(
        "max-h-[300px] overflow-y-auto overflow-x-hidden",
        className
      )}
      {...props}
    />
  );
}

// Empty
function CommandEmpty(props) {
  return (
    <CommandPrimitive.Empty
      className="py-6 text-center text-sm text-gray-500"
      {...props}
    />
  );
}

// Group
function CommandGroup({ className, ...props }) {
  return (
    <CommandPrimitive.Group
      className={cn("p-2 text-sm", className)}
      {...props}
    />
  );
}

// Separator
function CommandSeparator({ className, ...props }) {
  return (
    <CommandPrimitive.Separator
      className={cn("h-px bg-gray-200 my-1", className)}
      {...props}
    />
  );
}

// Item
function CommandItem({ className, ...props }) {
  return (
    <CommandPrimitive.Item
      className={cn(
        "flex items-center gap-2 px-2 py-2 text-sm cursor-pointer rounded hover:bg-gray-100",
        className
      )}
      {...props}
    />
  );
}

// Shortcut
function CommandShortcut({ className, ...props }) {
  return (
    <span
      className={cn("ml-auto text-xs text-gray-400", className)}
      {...props}
    />
  );
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};