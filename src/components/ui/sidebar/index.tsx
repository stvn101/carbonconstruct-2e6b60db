
// Export sidebar base
export { Sidebar } from "./sidebar-base";

// Export sidebar context
export { SidebarProvider, useSidebar } from "./sidebar-context";

// Export sidebar menu
export { 
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  sidebarMenuButtonVariants 
} from "./sidebar-menu";

// Export types
export type { SidebarContext, SidebarProviderProps, SidebarMenuButtonProps, SidebarMenuActionProps } from "./types";

// Export other components from the components file
export {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenuBadge,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "./components";
