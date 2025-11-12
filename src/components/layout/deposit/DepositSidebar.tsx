import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { XCircle, CheckIcon, Edit3Icon, Edit2Icon, SaveIcon } from "lucide-react";
import { toast } from "sonner";

export type StepStatus = {
  id: number;
  name: string;
  status: "waiting" | "active" | "completed" | "error";
  totalFields: number;
  completedFields: number;
};

interface DepositSidebarProps {
  steps: StepStatus[];
  onStepClick: (stepId: number) => void;
}

const statusBaseClassName = "text-background hover:text-foreground";

const statusConfig = {
  completed: {
    icon: CheckIcon,
    className: cn(statusBaseClassName, "bg-green-dark"),
  },
  active: {
    icon: Edit3Icon,
    className: cn(statusBaseClassName, "bg-orange-medium text-foreground"),
  },
  error: {
    icon: XCircle,
    className: cn(statusBaseClassName, "bg-red-dark"),
  },
  waiting: {
    icon: Edit2Icon,
    className: cn(statusBaseClassName),
  },
};

export function DepositSidebar({ steps, onStepClick }: DepositSidebarProps) {
  const totalMeaningfulSteps = steps.length - 1;
  const completedMeaningfulSteps = steps
    .slice(0, totalMeaningfulSteps) // Get all steps except the last one
    .filter((s) => s.status === "completed").length;

  const progressValue =
    totalMeaningfulSteps > 0
      ? (completedMeaningfulSteps / totalMeaningfulSteps) * 100
      : 0;

  return (
    <aside className="w-[350px] bg-gradient-deposit-sidebar border-r p-6 px-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading3 text-white">Deposition steps</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size={"icon"}
                variant={"outline"}
                className="border-0"
                aria-label="Save data"
                onClick={() => 
                  toast.success("Data saved", {
                    position: "top-center"
                  }
                )}
              >
                <SaveIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent variant="light">
              <p>Save data</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      

      <div className="mt-6 space-y-1">
        <Progress
          value={progressValue}
          className="h-2" // Standard shadcn progress
          aria-label={`${Math.round(progressValue)}% complete`}
        />
        <p className="text-sm text-white/90">
          {completedMeaningfulSteps} of {totalMeaningfulSteps} steps completed
        </p>
      </div>

      <nav className="mt-6">
        <ul className="space-y-2">
          {steps.map((step, index) => {
            const config = statusConfig[step.status];
            // const Icon = config.icon;

            return (
              <li key={step.id}>
                <Button
                  variant="ghost"
                  size={"md"}
                  onClick={() => onStepClick(step.id)}
                  disabled={false} // All steps are clickable
                  aria-current={step.status === "active" ? "step" : undefined}
                  className={cn(
                    config.className,
                    index >= totalMeaningfulSteps && "bg-transparent text-white hover:text-black",
                    "w-full justify-between"
                  )}
                >
                  <div className="w-full flex items-center justify-between">
                    <span className="text-base font-medium">{step.name}</span>
                    {step.totalFields > 0 && (
                      <span className="text-xs font-subheading">
                        {step.completedFields}/{step.totalFields}
                      </span>
                    )}
                  </div>
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

