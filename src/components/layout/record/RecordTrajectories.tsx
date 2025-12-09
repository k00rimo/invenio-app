import { useState } from "react";
import type { ProjectMD } from "@/types/mdpositTypes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Box } from "lucide-react";

interface RecordTrajectoriesProps {
  recordData: ProjectMD;
}

const RecordTrajectories = ({ recordData }: RecordTrajectoriesProps) => {
  const { metadata } = recordData;
  const [selectedDomain, setSelectedDomain] = useState<string>("Overall");

  return (
    <div className="space-y-6 p-6">
      {/* 3D Molecule Viewer Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Box className="h-5 w-5" />
            3D Molecular Viewer
          </CardTitle>
          <CardDescription>
            Interactive molecular dynamics trajectory visualization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Domain Selection */}
          <div>
            <label className="text-sm font-medium mb-3 block">
              Select Domain
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedDomain("Overall")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedDomain === "Overall"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                Overall
              </button>
              {metadata.DOMAINS &&
                metadata.DOMAINS.length > 0 &&
                metadata.DOMAINS.map((domain, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedDomain(domain)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedDomain === domain
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    {domain}
                  </button>
                ))}
            </div>
          </div>

          <Separator />

          {/* 3D Viewer */}
          <div className="flex items-center justify-center bg-muted rounded-lg aspect-video border-2 border-dashed border-muted-foreground/25">
            <div className="text-center space-y-2">
              <Box className="h-12 w-12 mx-auto text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                3D Viewer Component Placeholder
              </p>
              <p className="text-xs text-muted-foreground/75">
                Molecular visualization will be displayed here
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecordTrajectories;
