import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { extractDoiFromCitation } from "@/lib/citation";

import MolStarPlaceholder from "./MolStarPlaceholder";
import type { ProjectMD } from "@/types/mdpositTypes";
import { formatISODateString } from "@/lib/formatters";

const RecordSidebar = ({ record }: { record: ProjectMD }) => {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";

  return (
    <Sidebar collapsible="icon" innerClassName="justify-between">
      <SidebarHeader className="sticky top-0 bg-sidebar z-10">
        <div
          className={cn("flex gap-4", {
            ["flex-row"]: isExpanded,
            ["flex-col items-start"]: !isExpanded,
          })}
        >
          <SidebarTrigger />
          <span
            className={cn("text-2xl font-medium", {
              ["[writing-mode:sideways-lr]"]: !isExpanded,
            })}
          >
            Metadata
          </span>
        </div>
      </SidebarHeader>
      {isExpanded && (
        <SidebarContent className="pt-4">
          <SidebarGroup>
            <MolStarPlaceholder height={300} />
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Published</SidebarGroupLabel>
            <SidebarGroupContent>
              {record.published ? "Yes" : "No"}
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Description</SidebarGroupLabel>
            <SidebarGroupContent>
              {record.metadata.DESCRIPTION}
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>DOI</SidebarGroupLabel>
            <SidebarGroupContent>
              {extractDoiFromCitation(record.metadata?.CITATION) ??
                "Unavailable"}
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Creation Date</SidebarGroupLabel>
            <SidebarGroupContent>
              {formatISODateString(record.creationDate)}
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Update Date</SidebarGroupLabel>
            <SidebarGroupContent>
              {formatISODateString(record.updateDate)}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      )}
    </Sidebar>
  );
};

export default RecordSidebar;
