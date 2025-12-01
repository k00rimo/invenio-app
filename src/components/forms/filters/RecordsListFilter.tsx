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

const withCounts = (options: { value: string, label: string }[]) => {
    return options.map(opt => ({ ...opt, count: 0 }))
}

const RecordsListFilter = ({className}: RecordsListFilterProps) => {
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
        {/* -- View All Versions Switch -- */}
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

        {/* -- Top Level Filters -- */}
        <InputFilter 
            title="Creators" 
            paramKey="creator" 
            placeholder="Search creators..." 
        />
        <InputFilter 
            title="Tags" 
            paramKey="tag" 
            placeholder="e.g. membrane, protein..." 
            splitByComma={true}
        />

        {/* -- Main Information -- */}
        <Separator className="my-4" />
        <h4 className="px-1 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Main Information
        </h4>

        <ToggleGroupFilter 
            title="Simulation Type"
            paramKey="simulation_type"
            options={withCounts(Options.simulationTypeOptions)}
            defaultOpen={true}
        />
         <ToggleGroupFilter 
            title="Ensemble"
            paramKey="ensemble"
            options={withCounts(Options.statisticalEnsembleOptions)}
        />
        {/* New Main Info Fields */}
        <InputFilter 
            title="Force Field" 
            paramKey="force_field" 
            placeholder="e.g. CHARMM36m..."
        />
        <InputFilter 
            title="Temperature (K)" 
            paramKey="temp" 
            placeholder="e.g. 300, 310..."
            splitByComma={true} 
        />
         <InputFilter 
            title="Pressure (bar)" 
            paramKey="pressure" 
            placeholder="e.g. 1..."
             splitByComma={true}
        />
        <InputFilter 
            title="Sim. Length (ns)" 
            paramKey="length" 
            placeholder="Min length..."
        />
         <InputFilter 
            title="Time Step (fs)" 
            paramKey="timestep" 
            placeholder="e.g. 2..."
        />
         <InputFilter 
            title="Box Size (nm)" 
            paramKey="box_size" 
            placeholder="Approx. size..."
        />

        <ToggleGroupFilter 
            title="Free Energy Calc."
            paramKey="free_energy"
            options={withCounts(Options.freeEnergyCalculationOptions)}
        />
        {/* Boolean toggles from schema can be mapped to simple Yes/No options */}
        <ToggleGroupFilter 
            title="Umbrella Sampling"
            paramKey="umbrella"
            options={[
                { label: "Yes", value: "true", count: 0 },
                { label: "No", value: "false", count: 0 }
            ]}
        />
         <ToggleGroupFilter 
            title="AWH Biasing"
            paramKey="awh"
            options={[
                { label: "Yes", value: "true", count: 0 },
                { label: "No", value: "false", count: 0 }
            ]}
        />

         {/* -- Detailed Information -- */}
         <Separator className="my-4" />
         <h4 className="px-1 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Detailed Information
        </h4>
        
        <ToggleGroupFilter 
            title="VdW Type"
            paramKey="vdw_type"
            options={withCounts(Options.vdwTypeOptions)}
        />
        <ToggleGroupFilter 
            title="VdW Modifier"
            paramKey="vdw_modifier"
            options={withCounts(Options.vdwModifierOptions)}
        />
        <ToggleGroupFilter 
            title="Dispersion Corr."
            paramKey="disp_corr"
            options={withCounts(Options.dispcorrOptions)}
        />

         <ToggleGroupFilter 
            title="Coulomb Type"
            paramKey="coulomb_type"
            options={withCounts(Options.coulombTypeOptions)}
        />
        <ToggleGroupFilter 
            title="Coulomb Modifier"
            paramKey="coulomb_modifier"
            options={withCounts(Options.coulombModifierOptions)}
        />

         <ToggleGroupFilter 
            title="Thermostat"
            paramKey="thermostat"
            options={withCounts(Options.tcouplOptions)}
        />
         <ToggleGroupFilter 
            title="Barostat"
            paramKey="barostat"
            options={withCounts(Options.pcouplOptions)}
        />
        <ToggleGroupFilter 
            title="Barostat Type"
            paramKey="barostat_type"
            options={withCounts(Options.pcouplTypeOptions)}
        />

        <ToggleGroupFilter 
            title="Constraints"
            paramKey="constraint_algo"
            options={withCounts(Options.constraintAlgorithmOptions)}
        />
         <ToggleGroupFilter 
            title="PBC"
            paramKey="pbc"
            options={withCounts(Options.pbcOptions)}
        />
      </div>
    </aside>
  )
}

export default RecordsListFilter
