import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useProjectAnalysisOptions } from "@/hooks";
import { useMemo } from "react";
import { getAnalysisLabel } from "../utils";
import { Spinner } from "@/components/ui/spinner";

interface VariantSelectProps {
  recordId: string;
  baseId: string;
  replicaNumber?: number;
  variants: string[];
  value?: string;
  onChange: (next: string) => void;
}

const VariantSelect = ({
  recordId,
  baseId,
  replicaNumber,
  variants,
  value,
  onChange,
}: VariantSelectProps) => {
  const {
    data: variantOptions,
    isPending,
    isError,
    error,
  } = useProjectAnalysisOptions(recordId, baseId, replicaNumber);

  const variantLabelMap: Map<string, string> = useMemo(() => {
    const map = new Map<string, string>();
    if (!variantOptions) {
      return map;
    }

    for (const option of variantOptions) {
      map.set(option.analysis, option.name);
    }
    return map;
  }, [variantOptions]);

  if (isError) {
    return (
      <div className="text-destructive text-sm">
        <span>Failed to load variant options:</span>
        <span>{error instanceof Error ? error.message : "Unknown error"}</span>
      </div>
    );
  }

  return (
    <Select
      value={
        isPending
          ? undefined
          : value && variants.includes(value)
          ? value
          : variants[0]
      }
      onValueChange={onChange}
      disabled={isPending}
    >
      <SelectTrigger
        className={cn(
          buttonVariants({ variant: "outline" }),
          "w-auto justify-between px-6 has-[>svg]:px-6",
          {
            "flex items-center gap-2 text-muted-foreground": isPending,
          }
        )}
      >
        {isPending && <Spinner className="h-4 w-4" />}
        <SelectValue
          placeholder={isPending ? "Loading variants..." : "Select variant"}
        />
      </SelectTrigger>
      {!isPending && (
        <SelectContent>
          {variants.map((variant) => (
            <SelectItem key={variant} value={variant}>
              {variantLabelMap.get(variant) ?? getAnalysisLabel(variant)}
            </SelectItem>
          ))}
        </SelectContent>
      )}
    </Select>
  );
};

export default VariantSelect;
