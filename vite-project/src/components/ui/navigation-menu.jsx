import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "../../lib/utils";

// Root
export function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-viewport={viewport}
      className={cn(
        "relative flex max-w-max flex-1 items-center justify-center",
        className
      )}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  );
}

// List
export function NavigationMenuList({ className, ...props }) {
  return (
    <NavigationMenuPrimitive.List
      className={cn(
        "flex flex-1 list-none items-center justify-center gap-1",
        className
      )}
      {...props}
    />
  );
}

// Item
export function NavigationMenuItem({ className, ...props }) {
  return (
    <NavigationMenuPrimitive.Item
      className={cn("relative", className)}
      {...props}
    />
  );
}

// Trigger style
export const navigationMenuTriggerStyle = cva(
  "inline-flex h-9 items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition",
  {
    variants: {},
  }
);

// Trigger
export function NavigationMenuTrigger({
  className,
  children,
  ...props
}) {
  return (
    <NavigationMenuPrimitive.Trigger
      className={cn(
        navigationMenuTriggerStyle(),
        "group hover:bg-accent hover:text-accent-foreground",
        "focus:bg-accent focus:text-accent-foreground",
        "data-[state=open]:bg-accent/50",
        "outline-none",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon
        className="ml-1 size-3 transition-transform duration-200 group-data-[state=open]:rotate-180"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  );
}

// Content
export function NavigationMenuContent({
  className,
  ...props
}) {
  return (
    <NavigationMenuPrimitive.Content
      className={cn(
        "top-0 left-0 w-full p-2 md:absolute md:w-auto",
        "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out",
        "data-[motion=from-end]:slide-in-from-right-10",
        "data-[motion=from-start]:slide-in-from-left-10",
        "data-[motion=to-end]:slide-out-to-right-10",
        "data-[motion=to-start]:slide-out-to-left-10",
        "bg-popover text-popover-foreground rounded-md border shadow-md",
        className
      )}
      {...props}
    />
  );
}

// Viewport
export function NavigationMenuViewport({
  className,
  ...props
}) {
  return (
    <div className="absolute top-full left-0 z-50 flex justify-center w-full">
      <NavigationMenuPrimitive.Viewport
        className={cn(
          "relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)]",
          "w-full md:w-[var(--radix-navigation-menu-viewport-width)]",
          "overflow-hidden rounded-md border bg-popover shadow",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          className
        )}
        {...props}
      />
    </div>
  );
}

// Link
export function NavigationMenuLink({
  className,
  ...props
}) {
  return (
    <NavigationMenuPrimitive.Link
      className={cn(
        "flex flex-col gap-1 rounded-sm p-2 text-sm transition",
        "hover:bg-accent hover:text-accent-foreground",
        "focus:bg-accent focus:text-accent-foreground",
        "outline-none",
        className
      )}
      {...props}
    />
  );
}

// Indicator
export function NavigationMenuIndicator({
  className,
  ...props
}) {
  return (
    <NavigationMenuPrimitive.Indicator
      className={cn(
        "top-full z-[1] flex h-1.5 items-end justify-center",
        "data-[state=visible]:animate-in data-[state=hidden]:animate-out",
        className
      )}
      {...props}
    >
      <div className="bg-border h-2 w-2 rotate-45 rounded-tl-sm shadow-md" />
    </NavigationMenuPrimitive.Indicator>
  );
}