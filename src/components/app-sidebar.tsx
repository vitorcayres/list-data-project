import * as React from "react";
import {
  IconDatabase,
  IconInnerShadowTop,
  IconUsers,
} from "@tabler/icons-react";

import { NavDocuments } from "../components/nav-documents";
import { NavUser } from "../components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../components/ui/sidebar";
import { useAuth } from "../contexts/AuthProvider";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  const data = {
    user: {
      name: "Bem-vindo!",
      email: user,
      avatar: "/avatars/shadcn.jpg",
    },
    documents: [
      {
        name: "Dashboard",
        url: "/dashboard",
        icon: IconDatabase,
      },
      {
        name: "Clientes",
        url: "/customers",
        icon: IconUsers,
      },
    ],
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Painel Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavDocuments items={data.documents} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
