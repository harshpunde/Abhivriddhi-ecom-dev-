import * as React from "react";
import { GripVerticalIcon } from "lucide-react";
import * as ResizablePrimitive from "react-resizable-panels";

import { cn } from "../../lib/utils";

// Panel Group
export function ResizablePanelGroup({
  className,
  ...props
}) {
  return (
    <ResizablePrimitive.PanelGroup
      className={cn(
        "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
        className
      )}
      {...props}
    />
  );
}

// Panel
export function ResizablePanel(props) {
  return <ResizablePrimitive.Panel {...props} />;
}

// Handle
export function ResizableHandle({
  withHandle,
  className,
  ...props
}) {
  return (
    <ResizablePrimitive.PanelResizeHandle
      className={cn(
        "bg-border relative flex w-px items-center justify-center",
        "focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 outline-none",
        
        // vertical support
        "data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full",

        // hover area
        "after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2",
        "data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:h-1",

        className
      )}
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
          <GripVerticalIcon className="size-3" />
        </div>
      )}
    </ResizablePrimitive.PanelResizeHandle>
  );
}