import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProjectAnalysisOptions } from "@/hooks";
import { useEffect, type FC } from "react";

type VariantSelectorProps = {
  recordId: string;
  selectedAnalysis: string;
  selectedReplica: string;
  selectedVariant?: string;
  onSelectVariant: (variant: string | undefined) => void;
};

const VariantSelector: FC<VariantSelectorProps> = ({
  recordId,
  selectedAnalysis,
  selectedReplica,
  onSelectVariant,
  selectedVariant,
}) => {
  const { data: options, isSuccess } = useProjectAnalysisOptions(
    recordId,
    selectedAnalysis,
    selectedReplica
  );

  useEffect(() => {
    if (isSuccess && options.length > 0) {
      console.log(options);
      onSelectVariant(options[0].analysis);
    }
  }, [isSuccess, options, onSelectVariant]);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Variant</span>
      <Select onValueChange={onSelectVariant} value={selectedVariant}>
        <SelectTrigger>
          <SelectValue placeholder="Choose variant" />
        </SelectTrigger>
        <SelectContent>
          {isSuccess &&
            options.map((opt) => (
              <SelectItem key={opt.analysis} value={opt.analysis}>
                {opt.name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default VariantSelector;
