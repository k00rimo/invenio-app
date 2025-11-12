import { useSearchParams } from "react-router"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

const RESERVED_PARAMS = new Set(['q', 'sort', 'size', 'page']);

const formatFilterKey = (key: string): string => {
  return key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
};

type ActiveFiltersProps = {
  className?: string;
};

const ActiveFilters = ({ className }: ActiveFiltersProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeFilters: { key: string; value: string; label: string }[] = [];
  const uniqueKeys = new Set(Array.from(searchParams.keys()));

  uniqueKeys.forEach(key => {
    if (!RESERVED_PARAMS.has(key)) {
      const values = searchParams.getAll(key);
      const prettyKey = formatFilterKey(key);
      values.forEach(value => {
        activeFilters.push({
          key,
          value,
          label: `${prettyKey}: ${value}`
        });
      });
    }
  });

  const hasActiveFilters = activeFilters.length > 0;

  const handleRemoveFilter = (key: string, valueToRemove: string) => {
    const newParams = new URLSearchParams(searchParams);
    const allValues = newParams.getAll(key);

    const newValues = allValues.filter(v => v !== valueToRemove);

    newParams.delete(key);
    newValues.forEach(v => newParams.append(key, v));
    
    newParams.set('page', '1'); 

    setSearchParams(newParams);
  };

  const handleClearAll = () => {
    const newParams = new URLSearchParams(searchParams);
    uniqueKeys.forEach(key => {
      if (!RESERVED_PARAMS.has(key)) {
        newParams.delete(key);
      }
    });

    newParams.set('page', '1');

    setSearchParams(newParams);
  };


  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="text-gray-dark">
        Active Filters:
      </span>

      <Badge 
        variant="tag-clear-all" 
        className={cn("flex items-center gap-1.5", !hasActiveFilters && "text-gray-dark")}
        asChild
      >
        <Button
          disabled={!hasActiveFilters}
          type="button"
          variant="outline"
          size="icon"
          className="h-fit"
          onClick={handleClearAll}
          aria-label="Clear all active filters"
        >
          Clear all
        </Button>
      </Badge>
      
      {activeFilters.map(({ key, value, label }, index) => (
        <Badge 
          key={`${key}-${value}-${index}`} 
          variant="tag-normal" 
          className="flex items-center gap-1.5 pl-3"
        >
          {label}
          <Button
            type="button"
            variant={"ghost"}
            size="icon"
            className="h-5 w-5 hover:bg-background"
            onClick={() => handleRemoveFilter(key, value)}
            aria-label={`Remove filter: ${label}`}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </Badge>
      ))}
    </div>
  );
};

export default ActiveFilters;
