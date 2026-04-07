import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";

import { cn } from "../../lib/utils";
import { toggleVariants } from "../ui/toggle";

// Context (JS safe)
const ToggleGroupContext = React.createContext({
  size: "default",
  variant: "default",
});

// Root
export function ToggleGroup({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}) {
  return (
    <ToggleGroupPrimitive.Root
      data-variant={variant}
      data-size={size}
      className={cn(
        "group/toggle-group flex w-fit items-center rounded-md",
        className
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

// Item
export function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  ...props
}) {
  const context = React.useContext(ToggleGroupContext);

  const finalVariant = context.variant || variant || "default";
  const finalSize = context.size || size || "default";

  return (
    <ToggleGroupPrimitive.Item
      data-variant={finalVariant}
      data-size={finalSize}
      className={cn(
        toggleVariants({
          variant: finalVariant,
          size: finalSize,
        }),
        "flex-1 min-w-0 shrink-0 rounded-none",
        "first:rounded-l-md last:rounded-r-md",
        "focus:z-10 focus-visible:z-10",
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
}