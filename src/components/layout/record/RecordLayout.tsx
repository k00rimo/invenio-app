import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import RecordSidebar from "./recordDetailSidebar/RecordSidebar";
import type { ProjectMD } from "@/types/mdpositTypes";
import RecordBreadcrumbs from "./RecordBreadcrumb";

const RecordLayout = ({
  record,
  children,
}: {
  record: ProjectMD;
  children?: React.ReactNode;
}) => {
  return (
    <div className="relative flex-1 h-full flex flex-col">
      <SidebarProvider defaultOpen={true}>
        <RecordSidebar record={record} />
        <main className="flex-1 flex flex-col">
          <RecordBreadcrumbs />
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
};

export default RecordLayout;
