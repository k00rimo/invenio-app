import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { useSearchParams } from "react-router"
import ToggleGroupFilter from "./ToggleGroupFilter"
import InputFilter from "./InputFilter"
import * as Options from "@/lib/deposition/formOptions" 

type RecordsListFilterProps = {
  className?: string
}

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
    <aside className={cn("space-y-4 p-4 rounded-sm min-w-[260px] w-full max-w-xs h-fit", className)}>
      <div className="flex items-center justify-between px-1">
        <h3 className="font-heading3 text-lg">Filters</h3>
      </div>
      <Separator />
      
      <div className="flex items-center justify-between">
        <Label htmlFor="view-all-versions" className="font-input cursor-pointer hover:text-foreground transition-colors">
          View all versions
        </Label>
        <Switch 
            id="view-all-versions" 
            checked={isViewAllVersions}
            onCheckedChange={handleViewAllVersionsChange}
        />
      </div>

      <Accordion type="multiple" className="w-full space-y-2">
        <AccordionItem value="general" className="border-b-0">
          <AccordionTrigger className="py-1">
            <span className="font-input">General</span>
          </AccordionTrigger>
          <AccordionContent className="pt-0 space-y-1">
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
            
            <ToggleGroupFilter 
                title="Access Rights"
                paramKey="access"
                options={withCounts(Options.accessOptions)}
            />

            <ToggleGroupFilter 
                title="License"
                paramKey="license"
                options={withCounts(Options.licenseOptions)}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="system" className="border-b-0">
          <AccordionTrigger className="py-1">
             <span className="font-input">System Info</span>
          </AccordionTrigger>
          <AccordionContent className="pt-2 space-y-1">
            
            <InputFilter 
                title="Software / Engine" 
                paramKey="software" 
                placeholder="e.g. GROMACS..." 
            />

            <InputFilter 
                title="Force Field" 
                paramKey="force_field" 
                placeholder="e.g. CHARMM36m..."
            />

            <InputFilter 
                title="Parametrization" 
                paramKey="parametrization" 
                placeholder="e.g. Semi-empirical..."
            />

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

            <InputFilter 
                title="Atom Count (Min)" 
                paramKey="min_atoms" 
                placeholder="e.g. 10000..."
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="experiments" className="border-b-0">
          <AccordionTrigger className="py-1">
            <span className="font-input">Simulation Params</span>
          </AccordionTrigger>
          <AccordionContent className="pt-2 space-y-1">
            <ToggleGroupFilter 
                title="Type"
                paramKey="sim_type"
                options={withCounts(Options.simulationTypeOptions)}
            />

            <ToggleGroupFilter 
                title="Ensemble"
                paramKey="ensemble"
                options={withCounts(Options.statisticalEnsembleOptions)}
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
            
            <ToggleGroupFilter 
                title="Thermostat Algo"
                paramKey="thermostat_algo"
                options={withCounts(Options.tcouplOptions)}
            />

             <ToggleGroupFilter 
                title="Barostat Algo"
                paramKey="barostat_algo"
                options={withCounts(Options.pcouplOptions)}
            />

            <ToggleGroupFilter 
                title="Constraints"
                paramKey="constraints"
                options={withCounts(Options.constraintAlgorithmOptions)}
            />

            <ToggleGroupFilter 
                title="Free Energy Calc"
                paramKey="free_energy"
                options={withCounts(Options.freeEnergyCalculationOptions)}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  )
}

export default RecordsListFilter
