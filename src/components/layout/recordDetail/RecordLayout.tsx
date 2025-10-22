import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import RecordSidebar from "./RecordSidebar";

const RecordLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="relative flex-1 h-full flex flex-col">
      <SidebarProvider defaultOpen={true}>
        <RecordSidebar />
        <main className="flex-1 flex flex-col">{children}</main>
      </SidebarProvider>
    </div>
  );
};

export default RecordLayout;
