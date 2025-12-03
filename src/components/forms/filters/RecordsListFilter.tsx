// src/components/records-list-filter.tsx
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useSearchParams } from "react-router"
import ToggleGroupFilter from "./ToggleGroupFilter"
import InputFilter from "./InputFilter"
import * as Options from "@/lib/deposition/formOptions" 

type RecordsListFilterProps = {
  className?: string
}

// Helper to safely map options if they exist, or return empty array to prevent crash
const withCounts = (options: { value: string, label: string }[] | undefined) => {
    if (!options) return []
    return options.map(opt => ({ ...opt, count: 0 }))
}

const RecordsListFilter = ({ className }: RecordsListFilterProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleViewAllVersionsChange = (checked: boolean) => {
      const newParams = new URLSearchParams(searchParams);
      if (checked) {
          newParams.set("view_all_versions", "true");
      } else {
          newParams.delete("view_all_versions");
      }
      newParams.set("page", "1");
      setSearchParams(newParams, { replace: true });
  };

  const isViewAllVersions = searchParams.get("view_all_versions") === "true";

  return (
    <aside className={cn("space-y-4 p-4 rounded-sm min-w-[280px] w-full max-w-xs h-fit", className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-heading3 text-lg">Filters</h3>
      </div>
      <Separator />
      
      <div className="space-y-1">
        {/* ==========================
            SECTION 1: GENERAL
           ========================== */}
        <div className="flex items-center justify-between py-2 px-1">
          <Label htmlFor="view-all-versions" className="text-sm font-normal cursor-pointer">
            View all versions
          </Label>
          <Switch 
              id="view-all-versions" 
              checked={isViewAllVersions}
              onCheckedChange={handleViewAllVersionsChange}
          />
        </div>
        <Separator className="my-2" />

        <InputFilter 
            title="Creators" 
            paramKey="creator" 
            placeholder="Name or ORCID..." 
        />
         <InputFilter 
            title="Affiliations" 
            paramKey="affiliation" 
            placeholder="University or Inst..." 
        />
        <InputFilter 
            title="Tags" 
            paramKey="tag" 
            placeholder="e.g. membrane, protein..." 
            splitByComma={true}
        />

        {/* ==========================
            SECTION 2: SYSTEM INFO
           ========================== */}
        <Separator className="my-4" />
        <h4 className="px-1 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            System Composition
        </h4>

        {/* Mapped from schema: systemInformation.simulationEngine.name */}
        <InputFilter 
            title="Software / Engine" 
            paramKey="software" 
            placeholder="e.g. GROMACS, LAMMPS..." 
        />

        {/* Mapped from schema: systemInformation.forceField */}
        <InputFilter 
            title="Force Field" 
            paramKey="force_field" 
            placeholder="e.g. CHARMM36m..."
        />

        {/* Mapped from schema: systemInformation.solventModel / proteinModel */}
        <InputFilter 
            title="Solvent Model" 
            paramKey="solvent" 
            placeholder="e.g. TIP3P..."
        />
        <InputFilter 
            title="Protein Model" 
            paramKey="protein" 
            placeholder="e.g. AMBER99SB..."
        />

        {/* Mapped from schema: systemInformation.systemSize */}
        <InputFilter 
            title="Atom Count (Min)" 
            paramKey="min_atoms" 
            placeholder="e.g. 10000..."
        />

        {/* ==========================
            SECTION 3: EXPERIMENT
           ========================== */}
        <Separator className="my-4" />
        <h4 className="px-1 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Simulation Params
        </h4>

        {/* Mapped from schema: experiments.length */}
        <InputFilter 
            title="Sim. Length (ns)" 
            paramKey="length" 
            placeholder="Min length..."
        />

         {/* Mapped from schema: experiments.timeStep */}
         <InputFilter 
            title="Time Step (fs)" 
            paramKey="timestep" 
            placeholder="e.g. 2..."
        />

        {/* Mapped from schema: experiments.thermostat.tcoupl (kept as common filter) */}
        <InputFilter 
            title="Temperature (K)" 
            paramKey="temp" 
            placeholder="e.g. 300, 310..."
            splitByComma={true} 
        />
        <ToggleGroupFilter 
            title="Thermostat"
            paramKey="thermostat"
            options={withCounts(Options.tcouplOptions)}
        />

         {/* Mapped from schema: experiments.barostat.pcoupl */}
         <InputFilter 
            title="Pressure (bar)" 
            paramKey="pressure" 
            placeholder="e.g. 1..."
            splitByComma={true}
        />
         <ToggleGroupFilter 
            title="Barostat"
            paramKey="barostat"
            options={withCounts(Options.pcouplOptions)}
        />

        {/* Mapped from schema: experiments.constraintScheme */}
        <ToggleGroupFilter 
            title="Constraints"
            paramKey="constraints"
            options={withCounts(Options.constraintAlgorithmOptions)}
        />
      </div>
    </aside>
  )
}

export default RecordsListFilter
