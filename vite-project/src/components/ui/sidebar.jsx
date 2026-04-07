import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { PanelLeft } from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

// Context
const SidebarContext = React.createContext(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used inside SidebarProvider");
  }
  return context;
}

// Provider
function SidebarProvider({ children }) {
  const [open, setOpen] = React.useState(true);

  const toggleSidebar = () => setOpen((prev) => !prev);

  return (
    <SidebarContext.Provider value={{ open, setOpen, toggleSidebar }}>
      <div className="flex w-full min-h-screen">
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

// Sidebar
function Sidebar({ className, children }) {
  const { open } = useSidebar();

  return (
    <aside
      className={cn(
        "bg-white border-r transition-all duration-300",
        open ? "w-64" : "w-16",
        className
      )}
    >
      {children}
    </aside>
  );
}

// Trigger
function SidebarTrigger({ className }) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      onClick={toggleSidebar}
      className={cn("m-2", className)}
    >
      <PanelLeft />
    </Button>
  );
}

// Content
function SidebarContent({ className, ...props }) {
  return (
    <div className={cn("p-2 flex flex-col gap-2", className)} {...props} />
  );
}

// Header
function SidebarHeader({ className, ...props }) {
  return (
    <div className={cn("p-2 font-semibold", className)} {...props} />
  );
}

// Footer
function SidebarFooter({ className, ...props }) {
  return (
    <div className={cn("p-2 mt-auto", className)} {...props} />
  );
}

// Menu
function SidebarMenu({ className, ...props }) {
  return (
    <ul className={cn("flex flex-col gap-1", className)} {...props} />
  );
}

function SidebarMenuItem({ className, ...props }) {
  return (
    <li
      className={cn(
        "px-3 py-2 rounded hover:bg-gray-100 cursor-pointer",
        className
      )}
      {...props}
    />
  );
}

// Main content
function SidebarInset({ className, ...props }) {
  return (
    <main className={cn("flex-1 p-4", className)} {...props} />
  );
}

export {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarInset,
  useSidebar,
};