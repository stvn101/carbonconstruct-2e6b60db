
export { Sidebar } from "./sidebar-base";
export { SidebarProvider, useSidebar } from "./sidebar-context";
export { 
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  sidebarMenuButtonVariants 
} from "./sidebar-menu";
export type { SidebarContext, SidebarProviderProps, SidebarMenuButtonProps, SidebarMenuActionProps } from "./types";

// Re-export other components from the original sidebar
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
