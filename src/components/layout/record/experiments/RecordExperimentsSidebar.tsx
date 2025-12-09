import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";

const SortOptions = {
  ALPHABETICAL: "alphabetical",
  REVERSE_ALPHABETICAL: "reverse-alphabetical",
  DATE: "date",
  REVERSE_DATE: "reverse-date",
} as const;

type SortOptionsType = (typeof SortOptions)[keyof typeof SortOptions];

interface RecordExperimentsSidebarProps {
  mds: string[];
  replicaId?: string;
  id?: string;
}

const RecordExperimentsSidebar = ({
  mds,
  replicaId,
  id,
}: RecordExperimentsSidebarProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOption, setSortOption] = useState<SortOptionsType>(
    SortOptions.ALPHABETICAL
  );

  const filteredReplicas = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    if (!normalized) return mds ?? [];
    return (mds ?? []).filter((replica) =>
      replica.toLowerCase().includes(normalized)
    );
  }, [mds, searchTerm]);

  return (
    <aside className="flex flex-col gap-6 w-96 bg-primary-light p-4 rounded-xl">
      <span className="text-2xl font-semibold">Experiments</span>
      <Input
        className="border-primary bg-white"
        id="search"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        placeholder="Search experiments"
      />
      <Select
        value={sortOption}
        onValueChange={(value: SortOptionsType) => setSortOption(value)}
      >
        <SelectTrigger className="rounded-sm h-10">
          <SelectValue placeholder="Sort experiments" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="alphabetical">Alphabetical (A-Z)</SelectItem>
          <SelectItem value="reverse-alphabetical">
            Alphabetical (Z-A)
          </SelectItem>
          <SelectItem value="date">Newest</SelectItem>
          <SelectItem value="reverse-date">Oldest</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex flex-col flex-1 gap-2 overflow-y-auto">
        {filteredReplicas.length === 0 && (
          <p className="p-4 text-sm text-muted-foreground">
            No experiments match your search.
          </p>
        )}
        {filteredReplicas.map((replica) => {
          const isActive = replica === replicaId;
          return (
            <Link
              key={replica}
              to={`/records/${id}/experiments/${encodeURIComponent(replica)}`}
              className={cn(
                "flex items-center justify-between p-3 rounded-sm transition-colors group",
                isActive ? "bg-primary-medium" : "hover:bg-primary-medium-hover"
              )}
            >
              <span className="font-mono text-sm break-all">{replica}</span>
              <ChevronRight
                size="20"
                className={cn(
                  "text-black transition-opacity",
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}
              />
            </Link>
          );
        })}
      </div>
    </aside>
  );
};

export default RecordExperimentsSidebar;
