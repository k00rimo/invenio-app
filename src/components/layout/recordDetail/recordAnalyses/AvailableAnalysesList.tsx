import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import { getAnalysisLabel } from "../utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AvailableAnalysesListProps {
  availableAnalyses: string[];
  selectedAnalysis: string | null;
  onSelectAnalysis: (analysis: string) => void;
}

const AvailableAnalysesList = ({
  availableAnalyses,
  selectedAnalysis,
  onSelectAnalysis,
}: AvailableAnalysesListProps) => {
  const [search, setSearch] = useState<string>("");

  // Hide initial variant entries like "-00" and "-01" from the list entirely
  const displayAnalyses = useMemo(
    () => availableAnalyses.filter((a) => !/-\d{2}$/.test(a)),
    [availableAnalyses]
  );

  const filteredAnalyses = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return displayAnalyses;
    return displayAnalyses.filter(
      (analysis) =>
        analysis.toLowerCase().includes(q) ||
        getAnalysisLabel(analysis).toLowerCase().includes(q)
    );
  }, [displayAnalyses, search]);

  return (
    <Card className="shadow-none h-full bg-[var(--primary-light)] p-4">
      <CardHeader className="p-0">
        <CardTitle className="text-base">Available Analyses</CardTitle>
        <CardDescription>
          Search and pick an analysis to preview
        </CardDescription>
      </CardHeader>
      <CardContent className="flex h-full min-h-0 flex-col gap-4 overflow-hidden p-0">
        <Input
          id="analysis-search"
          placeholder="Search analyses..."
          className="bg-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ScrollArea className="flex-1">
          {filteredAnalyses.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">
              No analyses found
            </div>
          ) : (
            <ul className="flex flex-col gap-1">
              {filteredAnalyses.map((analysis: string) => {
                return (
                  <li key={analysis}>
                    <Button
                      size="md"
                      variant="ghost"
                      className={cn(
                        "w-full h-auto justify-start hover:bg-[var(--primary-medium-hover)]",
                        [
                          selectedAnalysis === analysis &&
                            "text-secondary-foreground bg-[var(--primary-medium)]",
                        ]
                      )}
                      aria-selected={selectedAnalysis === analysis}
                      onClick={() => onSelectAnalysis(analysis)}
                    >
                      {getAnalysisLabel(analysis)}
                    </Button>
                  </li>
                );
              })}
            </ul>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AvailableAnalysesList;
