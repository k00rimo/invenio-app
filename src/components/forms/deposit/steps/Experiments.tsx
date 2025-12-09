"use client";

import React, { memo } from "react";
import { get, useFieldArray, useFormContext, useWatch } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import type { DepositFormData } from "@/lib/validators/depositSchema";
import {
  tcouplOptions,
  pcouplOptions,
  pcouplTypeOptions,
  constraintAlgorithmOptions,
  refcoordScalingOptions,
  simulationTypeOptions,
  statisticalEnsembleOptions,
  commModeOptions,
  vdwTypeOptions,
  vdwModifierOptions,
  dispcorrOptions,
  coulombTypeOptions,
  coulombModifierOptions,
  pbcOptions,
  cutoffSchemeOptions,
  freeEnergyCalculationOptions
} from "@/lib/deposition/formOptions";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import FileUploader from "@/components/shared/FileUploader";
import { experimentDefaultValues } from "@/lib/constants/depositSchema";

// --- Matrix Helper Component ---
const MatrixInput = memo(({ value, onChange, placeholder }: { value: number[][] | undefined, onChange: (val: number[][]) => void, placeholder?: string }) => {
  const [text, setText] = React.useState(() => {
    if (!value) return "";
    return value.map(row => row.join(" ")).join(", ");
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setText(val);
    try {
      if(!val.trim()) {
        onChange([]);
        return;
      }
      const rows = val.split(",").map(row => 
        row.trim().split(/\s+/).map(num => {
            const n = Number(num);
            return isNaN(n) ? 0 : n;
        })
      );
      onChange(rows);
    } catch {
      // Keep user typing
    }
  };

  return (
    <Input 
      variant="deposition" 
      value={text} 
      onChange={handleChange} 
      placeholder={placeholder || "e.g. 4.5e-5 (Isotropic)"} 
    />
  );
});

const ExperimentHeaderTitle = ({ index }: { index: number }) => {
  const { control } = useFormContext<DepositFormData>();
  const name = useWatch({
    control,
    name: `experiments.experiments.${index}.name`,
  });

  return (
    <span className="font-semibold text-lg truncate">
      {index + 1}. {name || `Experiment ${index + 1}`}
    </span>
  );
};

export function Experiments() {
  const { control } = useFormContext<DepositFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "experiments.experiments",
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <p className="text-sm text-muted-foreground">
          Define your simulation runs. You can add multiple experiments (e.g.,
          Equilibration, Production).
        </p>
      </div>

      <Accordion type="multiple" className="w-full space-y-4">
        {fields.map((field, index) => (
          <ExperimentItem 
            key={field.id} 
            fieldId={field.id} 
            index={index} 
            remove={remove}
            canRemove={fields.length > 1} 
          />
        ))}
      </Accordion>

      <Button
        type="button"
        variant="outline"
        onClick={() => append(experimentDefaultValues)}
        className="w-full border-dashed py-6"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Experiment
      </Button>
    </div>
  );
}

const ExperimentItem = memo(function ExperimentItem({ 
  fieldId, 
  index, 
  remove, 
  canRemove 
}: { 
  fieldId: string; 
  index: number; 
  remove: (index: number) => void;
  canRemove: boolean;
}) {
  const { control, formState: { errors } } = useFormContext<DepositFormData>();
  const hasError = !!get(errors, `experiments.experiments.${index}`);

  return (
    <AccordionItem
      value={fieldId}
      className={cn(
        "border px-4 data-[state=open]:bg-muted/10 last:border-b",
        hasError && "border-destructive/50 bg-destructive/10"
      )}
    >
      <AccordionTrigger className="hover:no-underline py-4 truncate">
        <ExperimentHeaderTitle index={index} />
      </AccordionTrigger>
      
      <AccordionContent className="pt-4 pb-6 space-y-8 mx-1">
        
        {/* === SECTION 1: GENERAL & FILES === */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <FormField
              control={control}
              name={`experiments.experiments.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Experiment Name</FormLabel>
                  <FormControl>
                    <Input variant="deposition" placeholder="e.g., NVT Equilibration" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`experiments.experiments.${index}.simulationType`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Simulation Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger size={"md"}><SelectValue placeholder="Select type" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {simulationTypeOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
             <FormField
              control={control}
              name={`experiments.experiments.${index}.ensemble`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ensemble</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger size={"md"}><SelectValue placeholder="Select ensemble" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statisticalEnsembleOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-2">
            <FormLabel required>Experiment Files</FormLabel>
            <FileUploader 
              name={`experiments.experiments.${index}.experimentFiles`}
              label={`Upload .tpr, .trj, .mdp`}
              accept={{ 'application/octet-stream': ['.tpr', '.trj', '.mdp', '.mp4'] }}
            />
            <FormField
              control={control}
              name={`experiments.experiments.${index}.experimentFiles`}
              render={() => <FormMessage />}
            />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <FormField
              control={control}
              name={`experiments.experiments.${index}.length`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Length (ns)</FormLabel>
                  <FormControl><Input type="number" variant="deposition" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={control}
              name={`experiments.experiments.${index}.timeStep`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Time Step (ps)</FormLabel>
                  <FormControl><Input type="number" variant="deposition" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={control}
              name={`experiments.experiments.${index}.outputCadence`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Output Cadence (ps)</FormLabel>
                  <FormControl><Input type="number" variant="deposition" {...field} /></FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* === SECTION 2: PHYSICS (Thermostat & Barostat) === */}
        <div className="flex flex-col gap-8">
            <div className="space-y-4">
                <FormLabel className="text-base font-semibold">Thermostat</FormLabel>
                <FormField
                    control={control}
                    name={`experiments.experiments.${index}.thermostat.tcoupl`}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Coupling Algorithm</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger size={"md"}><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                            <SelectContent>{tcouplOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                        </Select>
                        </FormItem>
                    )}
                />
                 <FormField
                      control={control}
                      name={`experiments.experiments.${index}.thermostat.nsttcouple`}
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>nsttcouple (steps)</FormLabel>
                              <FormControl><Input type="number" variant="deposition" {...field} /></FormControl>
                          </FormItem>
                      )}
                />
                
                <div className="space-y-2 pt-2">
                    <FormLabel className="text-sm">Coupling Groups</FormLabel>
                    <TemperatureGroups nestIndex={index} control={control} />
                </div>
            </div>

            <div className="space-y-4">
                <FormLabel className="text-base font-semibold">Barostat</FormLabel>
                <div className="grid grid-cols-1 gap-4">
                     <FormField
                        control={control}
                        name={`experiments.experiments.${index}.barostat.pcoupl`}
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Coupling</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger size={"md"}><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                                <SelectContent>{pcouplOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                            </Select>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name={`experiments.experiments.${index}.barostat.pcoupltype`}
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger size={"md"}><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                                <SelectContent>{pcouplTypeOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                            </Select>
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={control}
                        name={`experiments.experiments.${index}.barostat.tauP`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>tau-p (ps)</FormLabel>
                                <FormControl><Input type="number" variant="deposition" {...field} /></FormControl>
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={control}
                        name={`experiments.experiments.${index}.barostat.refcoordScaling`}
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Ref Scaling</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger size={"md"}><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                                <SelectContent>{refcoordScalingOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                            </Select>
                            </FormItem>
                        )}
                    />
                </div>
                 <FormField
                      control={control}
                      name={`experiments.experiments.${index}.barostat.compressibility`}
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Compressibility [bar^-1]</FormLabel>
                              <FormControl>
                                <MatrixInput value={field.value} onChange={field.onChange} placeholder="e.g. 4.5e-5" />
                              </FormControl>
                              <FormDescription className="text-xs">Matrix or scalar value</FormDescription>
                          </FormItem>
                      )}
                />
                 <FormField
                      control={control}
                      name={`experiments.experiments.${index}.barostat.refPressure`}
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Reference Pressure [bar]</FormLabel>
                              <FormControl>
                                <MatrixInput value={field.value} onChange={field.onChange} placeholder="e.g. 1.0" />
                              </FormControl>
                          </FormItem>
                      )}
                />
            </div>
        </div>

        <Separator />

        {/* === SECTION 3: INTERACTIONS === */}
        <div className="flex flex-col gap-8">
            <div className="space-y-4">
                <h4 className="font-medium text-sm text-foreground/80 uppercase tracking-wider border-b pb-2">Electrostatics</h4>
                <FormField
                    control={control}
                    name={`experiments.experiments.${index}.electrostatics.coulombType`}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Coulomb Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger size={"md"}><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>{coulombTypeOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                        </Select>
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name={`experiments.experiments.${index}.electrostatics.coulombModifier`}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Modifier</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger size={"md"}><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>{coulombModifierOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                        </Select>
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                        control={control}
                        name={`experiments.experiments.${index}.electrostatics.rcoulomb`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cut-off</FormLabel>
                                <FormControl><Input type="number" variant="deposition" {...field} /></FormControl>
                            </FormItem>
                        )}
                  />
                   <FormField
                        control={control}
                        name={`experiments.experiments.${index}.electrostatics.epsilonR`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Eps-R</FormLabel>
                                <FormControl><Input type="number" variant="deposition" {...field} /></FormControl>
                            </FormItem>
                        )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <FormField
                        control={control}
                        name={`experiments.experiments.${index}.electrostatics.epsilonRf`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Eps-RF</FormLabel>
                                <FormControl><Input type="number" variant="deposition" {...field} /></FormControl>
                            </FormItem>
                        )}
                  />
                   <FormField
                        control={control}
                        name={`experiments.experiments.${index}.electrostatics.fourierspacing`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Grid (nm)</FormLabel>
                                <FormControl><Input type="number" variant="deposition" {...field} /></FormControl>
                            </FormItem>
                        )}
                  />
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="font-medium text-sm text-foreground/80 uppercase tracking-wider border-b pb-2">Van der Waals</h4>
                <FormField
                    control={control}
                    name={`experiments.experiments.${index}.vanDerWaals.vdwType`}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>VdW Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger size={"md"}><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>{vdwTypeOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                        </Select>
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name={`experiments.experiments.${index}.vanDerWaals.vdwModifier`}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Modifier</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger size={"md"}><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>{vdwModifierOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                        </Select>
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={control}
                        name={`experiments.experiments.${index}.vanDerWaals.rvdw`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cut-off</FormLabel>
                                <FormControl><Input type="number" variant="deposition" {...field} /></FormControl>
                            </FormItem>
                        )}
                  />
                    <FormField
                        control={control}
                        name={`experiments.experiments.${index}.vanDerWaals.rvdwSwitch`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Switch</FormLabel>
                                <FormControl><Input type="number" variant="deposition" {...field} /></FormControl>
                            </FormItem>
                        )}
                  />
                </div>
                <FormField
                    control={control}
                    name={`experiments.experiments.${index}.vanDerWaals.dispcorr`}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Dispersion Correction</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger size={"md"}><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>{dispcorrOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                        </Select>
                        </FormItem>
                    )}
                />
            </div>

            <div className="space-y-4">
                <h4 className="font-medium text-sm text-foreground/80 uppercase tracking-wider border-b pb-2">Constraints & Neighbour</h4>
                <FormField
                    control={control}
                    name={`experiments.experiments.${index}.constraints.algorithm`}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Constraint Algo</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger size={"md"}><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>{constraintAlgorithmOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                        </Select>
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={control}
                      name={`experiments.experiments.${index}.constraints.lincsIter`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Iter</FormLabel>
                          <FormControl><Input type="number" variant="deposition" {...field} /></FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`experiments.experiments.${index}.constraints.lincsOrder`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Order</FormLabel>
                          <FormControl><Input type="number" variant="deposition" {...field} /></FormControl>
                        </FormItem>
                      )}
                    />
                </div>

                <Separator className="my-2"/>

                <FormField
                    control={control}
                    name={`experiments.experiments.${index}.neighbourList.pbc`}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>PBC</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger size={"md"}><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>{pbcOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                        </Select>
                        </FormItem>
                    )}
                />
                  <FormField
                    control={control}
                    name={`experiments.experiments.${index}.neighbourList.cutoffScheme`}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Cutoff Scheme</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger size={"md"}><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>{cutoffSchemeOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                        </Select>
                        </FormItem>
                    )}
                />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={control}
                        name={`experiments.experiments.${index}.neighbourList.rlist`}
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>rlist (nm)</FormLabel>
                            <FormControl><Input type="number" variant="deposition" {...field} /></FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name={`experiments.experiments.${index}.neighbourList.nstlist`}
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>nstlist</FormLabel>
                            <FormControl><Input type="number" variant="deposition" {...field} /></FormControl>
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        </div>

        <Separator />
        
        {/* === SECTION 4: ADVANCED === */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-foreground/80 uppercase tracking-wider">Advanced / Free Energy</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField
                control={control}
                name={`experiments.experiments.${index}.commMode`}
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>COM Mode</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger size={"md"}><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                        <SelectContent>{commModeOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                    </Select>
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name={`experiments.experiments.${index}.nstcomm`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>nstcomm</FormLabel>
                        <FormControl><Input type="number" variant="deposition" placeholder="100" {...field} /></FormControl>
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name={`experiments.experiments.${index}.randomSeed`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Random Seed</FormLabel>
                        <FormControl><Input type="number" variant="deposition" placeholder="-1" {...field} /></FormControl>
                    </FormItem>
                )}
            />
              <FormField
                control={control}
                name={`experiments.experiments.${index}.freeEnergyCalculation`}
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Free Energy Calc</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger size={"md"}><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                        <SelectContent>{freeEnergyCalculationOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                    </Select>
                    </FormItem>
                )}
            />
          </div>

          <div className="flex flex-col gap-4 pt-2">
            <FormField
                control={control}
                name={`experiments.experiments.${index}.restraintsApplied`}
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-3 border rounded-md">
                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <FormLabel className="font-normal cursor-pointer">Restraints Applied</FormLabel>
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name={`experiments.experiments.${index}.umbrellaSampling`}
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-3 border rounded-md">
                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <FormLabel className="font-normal cursor-pointer">Umbrella Sampling</FormLabel>
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name={`experiments.experiments.${index}.awhAdaptiveBiasing`}
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-3 border rounded-md">
                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <FormLabel className="font-normal cursor-pointer">AWH Adaptive Biasing</FormLabel>
                    </FormItem>
                )}
            />
          </div>
        </div>

        {/* Remove Button */}
        <div className="flex justify-end pt-4">
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => remove(index)}
            disabled={!canRemove}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Remove Experiment
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
});

// Sub-component for Thermostat Groups Field Array
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TemperatureGroups({ nestIndex, control }: { nestIndex: number; control: any }) {
    const { fields, append, remove } = useFieldArray({
      control,
      name: `experiments.experiments.${nestIndex}.thermostat.groups`,
    });
  
    return (
      <div className="space-y-3">
        {fields.map((item, k) => (
          <div key={item.id} className="flex items-end gap-2">
            <FormField
              control={control}
              name={`experiments.experiments.${nestIndex}.thermostat.groups.${k}.name`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className={cn("text-xs text-muted-foreground", k != 0 && "hidden")}>Group Name</FormLabel>
                  <FormControl><Input variant={"deposition"} placeholder="Protein" className="h-9" {...field} /></FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`experiments.experiments.${nestIndex}.thermostat.groups.${k}.tauT`}
              render={({ field }) => (
                <FormItem className="w-24">
                  <FormLabel className={cn("text-xs text-muted-foreground", k != 0 && "hidden")}>tau-t</FormLabel>
                  <FormControl><Input variant={"deposition"} type="number" placeholder="0.1" className="h-9" {...field} /></FormControl>
                </FormItem>
              )}
            />
             <FormField
              control={control}
              name={`experiments.experiments.${nestIndex}.thermostat.groups.${k}.refT`}
              render={({ field }) => (
                <FormItem className="w-24">
                  <FormLabel className={cn("text-xs text-muted-foreground", k != 0 && "hidden")}>Ref T (K)</FormLabel>
                  <FormControl><Input variant={"deposition"} type="number" placeholder="300" className="h-9" {...field} /></FormControl>
                </FormItem>
              )}
            />
            <Button type="button" variant="ghost" size="icon" className="h-9 w-8 text-destructive" onClick={() => remove(k)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full border-dashed"
          onClick={() => append({ name: "", tauT: undefined, refT: undefined })}
        >
          <Plus className="mr-2 h-3 w-3" /> Add Group
        </Button>
      </div>
    );
}
