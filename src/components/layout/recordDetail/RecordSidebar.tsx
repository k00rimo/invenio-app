import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { FileText, BarChart3, Layers, Download } from "lucide-react";
import { useParams, useLocation, Link } from "react-router";

const RecordSidebar = () => {
  const { id } = useParams();
  const location = useLocation();

  const isActive = (url: string) => location.pathname === url;

  const items = [
    {
      title: "Overview",
      url: `/records/${id}/overview`,
      icon: FileText,
    },
    {
      title: "Analyses",
      url: `/records/${id}/analyses`,
      icon: BarChart3,
    },
    {
      title: "Trajectories",
      url: `/records/${id}/trajectories`,
      icon: Layers,
    },
    {
      title: "Downloads",
      url: `/records/${id}/downloads`,
      icon: Download,
    },
  ];

  return (
    <Sidebar collapsible="icon" innerClassName="justify-between">
      <SidebarHeader className="sticky top-0">
        <SidebarMenu>
          {items.map((item) => {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={
                    isActive(item.url)
                      ? "bg-[var(--primary-medium)] hover:bg-[var(--primary-medium)]"
                      : ""
                  }
                >
                  <Link to={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarHeader>
      <SidebarFooter className="sticky bottom-0">
        <div className="flex items-center justify-end">
          <SidebarTrigger />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default RecordSidebar;
