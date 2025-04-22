
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, PanelLeft, Plus, Search } from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button } from "../button";
import { Input } from "../input";
import { Separator } from "../separator";
import { Skeleton } from "../skeleton";
import { useSidebar } from "./sidebar-context";

// SidebarContent component
export const SidebarContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      )}
      {...props}
    />
  )
);
SidebarContent.displayName = "SidebarContent";

// SidebarHeader component
export const SidebarHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn("flex h-12 items-center gap-1 border-b px-4 py-2", className)}
      {...props}
    />
  )
);
SidebarHeader.displayName = "SidebarHeader";

// SidebarFooter component
export const SidebarFooter = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn("border-t p-4", className)}
      {...props}
    />
  )
);
SidebarFooter.displayName = "SidebarFooter";

// SidebarGroup component
export const SidebarGroup = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn("space-y-1", className)}
      {...props}
    />
  )
);
SidebarGroup.displayName = "SidebarGroup";

// SidebarGroupLabel component
export const SidebarGroupLabel = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-sidebar="group-label"
      className={cn(
        "px-4 py-2 text-xs font-medium text-sidebar-foreground/60 group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
);
SidebarGroupLabel.displayName = "SidebarGroupLabel";

// SidebarGroupContent component
export const SidebarGroupContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-sidebar="group-content"
      className={cn("space-y-1 px-2", className)}
      {...props}
    />
  )
);
SidebarGroupContent.displayName = "SidebarGroupContent";

// SidebarGroupAction component
export const SidebarGroupAction = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-sidebar="group-action"
      className={cn("flex items-center justify-end px-4 py-2 group-data-[collapsible=icon]:hidden", className)}
      {...props}
    />
  )
);
SidebarGroupAction.displayName = "SidebarGroupAction";

// SidebarInset component
export const SidebarInset = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-sidebar="inset"
      className={cn(
        "mx-2 rounded-lg border border-sidebar-border bg-sidebar-accent/20 p-2",
        className
      )}
      {...props}
    />
  )
);
SidebarInset.displayName = "SidebarInset";

// SidebarInput component
export const SidebarInput = React.forwardRef<HTMLInputElement, React.ComponentProps<typeof Input>>(
  ({ className, ...props }, ref) => (
    <div className="relative group-data-[collapsible=icon]:hidden">
      <Search
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sidebar-foreground/60"
        aria-hidden="true"
      />
      <Input
        ref={ref}
        type="search"
        className={cn(
          "h-9 w-full bg-sidebar-accent/20 pl-9 text-sidebar-foreground placeholder:text-sidebar-foreground/60",
          className
        )}
        {...props}
      />
    </div>
  )
);
SidebarInput.displayName = "SidebarInput";

// SidebarRail component
export const SidebarRail = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-sidebar="rail"
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex w-14 flex-col border-r bg-sidebar-rail py-3",
        className
      )}
      {...props}
    />
  )
);
SidebarRail.displayName = "SidebarRail";

// SidebarSeparator component
export const SidebarSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Separator>
>(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
  <Separator
    ref={ref}
    data-sidebar="separator"
    orientation={orientation}
    decorative={decorative}
    className={cn("shrink-0 bg-sidebar-border", className)}
    {...props}
  />
));
SidebarSeparator.displayName = "SidebarSeparator";

// SidebarMenuBadge component
export const SidebarMenuBadge = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-sidebar="menu-badge"
      className={cn(
        "ml-auto flex h-5 items-center justify-center rounded-full bg-sidebar-accent px-2 text-xs font-medium text-sidebar-foreground group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
);
SidebarMenuBadge.displayName = "SidebarMenuBadge";

// SidebarMenuSkeleton component
export const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="menu-skeleton"
    className={cn("px-2", className)}
    {...props}
  >
    <div className="flex items-center gap-2 py-2">
      <Skeleton className="size-4 shrink-0" />
      <Skeleton className="h-4 w-full group-data-[collapsible=icon]:hidden" />
    </div>
  </div>
));
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton";

// SidebarMenuSub component
export const SidebarMenuSub = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-sidebar="menu-sub"
      className={cn("pl-6 group-data-[collapsible=icon]:pl-0", className)}
      {...props}
    />
  )
);
SidebarMenuSub.displayName = "SidebarMenuSub";

// SidebarMenuSubButton component
export const SidebarMenuSubButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & { isActive?: boolean }
>(({ className, isActive, ...props }, ref) => (
  <button
    ref={ref}
    data-sidebar="menu-sub-button"
    data-active={isActive}
    className={cn(
      "flex h-8 w-full items-center gap-2 rounded-md px-2 py-1 text-xs text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 data-[active=true]:bg-sidebar-accent/30 data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground group-data-[collapsible=icon]:hidden",
      className
    )}
    {...props}
  />
));
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";

// SidebarMenuSubItem component
export const SidebarMenuSubItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(
  ({ className, ...props }, ref) => (
    <li
      ref={ref}
      data-sidebar="menu-sub-item"
      className={cn("px-2 group-data-[collapsible=icon]:hidden", className)}
      {...props}
    />
  )
);
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";

// SidebarTrigger component
export const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7", className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeft />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";
