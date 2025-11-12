"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { DepositFormData } from "@/lib/validators/depositSchema";
import {
  commModeOptions,
  constraintAlgorithmOptions,
  vdwTypeOptions,
  vdwModifierOptions,
  dispcorrOptions,
  pcouplOptions,
  pcouplTypeOptions,
  refcoordScalingOptions,
  tcouplOptions,
  pbcOptions,
  cutoffSchemeOptions,
  coulombTypeOptions,
  coulombModifierOptions,
} from "@/lib/deposition/formOptions";
import { StringArrayInput } from "../StringArrayInput";

export function DetailedInfo() {
  const { control } = useFormContext<DepositFormData>();

  return (
    <div className="space-y-12">
      <p className="text-sm text-muted-foreground">
        Provide detailed simulation parameters. All fields in this step are
        optional but recommended for reproducibility.
      </p>

      <div className="space-y-4">
        <div>
          <FormLabel className="text-base font-semibold text-foreground">
            General Parameters
          </FormLabel>
          <FormDescription className="mt-1">
            Parameters related to the center of mass motion.
          </FormDescription>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 pt-2">
          <FormField
            control={control}
            name="detailedInformation.nstcomm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>nstcomm (steps)</FormLabel>
                <FormControl>
                  <Input variant={"deposition"} type="number" {...field}/>
                </FormControl>
                <FormDescription>
                  Frequency for center of mass motion removal.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="detailedInformation.commMode"
            render={({ field }) => (
              <FormItem className="w-full flex flex-col">
                <FormLabel>comm-mode</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select comm-mode" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {commModeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <FormLabel className="text-base font-semibold text-foreground">
            Constraints
          </FormLabel>
          <FormDescription className="mt-1">
            Settings for constraint algorithms like LINCS or PME.
          </FormDescription>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 pt-2">
          <FormField
            control={control}
            name="detailedInformation.constraintAlgorithm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>constraint-algorithm</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select algorithm" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {constraintAlgorithmOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="detailedInformation.lincsIter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>lincs-iter</FormLabel>
                <FormControl>
                  <Input variant={"deposition"} type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="detailedInformation.lincsOrder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>lincs-order</FormLabel>
                <FormControl>
                  <Input variant={"deposition"} type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="detailedInformation.fourierspacing"
            render={({ field }) => (
              <FormItem>
                <FormLabel>fourierspacing (nm)</FormLabel>
                <FormControl>
                  <Input variant={"deposition"} type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <FormLabel className="text-base font-semibold text-foreground">
            van der Waals Interactions
          </FormLabel>
          <FormDescription className="mt-1">
            Define the non-bonded VdW parameters.
          </FormDescription>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 pt-2">
          <FormField
            control={control}
            name="detailedInformation.vanDerWaals.vdwType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>vdw-type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select VdW type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {vdwTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="detailedInformation.vanDerWaals.vdwModifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>vdw-modifier</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select VdW modifier" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {vdwModifierOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="detailedInformation.vanDerWaals.dispcorr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>dispcorr</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select dispcorr" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {dispcorrOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="detailedInformation.vanDerWaals.rvdw"
            render={({ field }) => (
              <FormItem>
                <FormLabel>rvdw (nm)</FormLabel>
                <FormControl>
                  <Input variant={"deposition"} type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="detailedInformation.vanDerWaals.rvdwSwitch"
            render={({ field }) => (
              <FormItem>
                <FormLabel>rvdw-switch (nm)</FormLabel>
                <FormControl>
                  <Input variant={"deposition"} type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <FormLabel className="text-base font-semibold text-foreground">
            Electrostatic Interactions
          </FormLabel>
          <FormDescription className="mt-1">
            Parameters for calculating electrostatic forces.
          </FormDescription>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 pt-2">
          <FormField
            control={control}
            name="detailedInformation.electrostatic.coulombtype"
            render={({ field }) => (
              <FormItem>
                <FormLabel>coulombtype</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select coulomb type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {coulombTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="detailedInformation.electrostatic.coulombModifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>coulomb-modifier</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select coulomb modifier" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {coulombModifierOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="detailedInformation.electrostatic.rcoulomb"
            render={({ field }) => (
              <FormItem>
                <FormLabel>rcoulomb (nm)</FormLabel>
                <FormControl>
                  <Input variant={"deposition"} type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="detailedInformation.electrostatic.epsilonR"
            render={({ field }) => (
              <FormItem>
                <FormLabel>epsilon-r</FormLabel>
                <FormControl>
                  <Input variant={"deposition"} type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="detailedInformation.electrostatic.epsilonRf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>epsilon-rf</FormLabel>
                <FormControl>
                  <Input variant={"deposition"} type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <FormLabel className="text-base font-semibold text-foreground">
            Barostat
          </FormLabel>
          <FormDescription className="mt-1">
            Settings for pressure coupling.
          </FormDescription>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 pt-2">
          <FormField
            control={control}
            name="detailedInformation.barostat.pcoupl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>pcoupl</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pcoupl" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {pcouplOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="detailedInformation.barostat.pcoupltype"
            render={({ field }) => (
              <FormItem>
                <FormLabel>pcoupltype</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pcoupltype" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {pcouplTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="detailedInformation.barostat.refcoordScaling"
            render={({ field }) => (
              <FormItem>
                <FormLabel>refcoord-scaling</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select refcoord-scaling" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {refcoordScalingOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="detailedInformation.barostat.tauP"
            render={({ field }) => (
              <FormItem>
                <FormLabel>tau-p (ps)</FormLabel>
                <FormControl>
                  <Input variant={"deposition"} type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <FormLabel className="text-base font-semibold text-foreground">
            Thermostat
          </FormLabel>
          <FormDescription className="mt-1">
            Settings for temperature coupling.
          </FormDescription>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 pt-2">
          <FormField
            control={control}
            name="detailedInformation.thermostat.tcoupl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>tcoupl</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tcoupl" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tcouplOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="detailedInformation.thermostat.nsttcouple"
            render={({ field }) => (
              <FormItem>
                <FormLabel>nsttcouple</FormLabel>
                <FormControl>
                  <Input variant={"deposition"} type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* TODO: tc-grps is a nested object, simplifying for now */}

          <div className="md:col-span-2 lg:col-span-3">
            <StringArrayInput
              name="detailedInformation.thermostat.tauT"
              label="tau-t (ps)"
              description="Time constant for temperature coupling. Add one value per group."
              placeholder="e.g., 0.1"
              itemLabel="Value"
              inputType="number"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <FormLabel className="text-base font-semibold text-foreground">
            Neighbour List
          </FormLabel>
          <FormDescription className="mt-1">
            Parameters for neighbour searching and periodic boundary conditions.
          </FormDescription>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 pt-2">
          <FormField
            control={control}
            name="detailedInformation.neighbourList.pbc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>pbc</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select PBC" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {pbcOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="detailedInformation.neighbourList.cutoffScheme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>cutoff-scheme</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select cutoff scheme" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {cutoffSchemeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="detailedInformation.neighbourList.nstlist"
            render={({ field }) => (
              <FormItem>
                <FormLabel>nstlist</FormLabel>
                <FormControl>
                  <Input variant={"deposition"} type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="detailedInformation.neighbourList.rlist"
            render={({ field }) => (
              <FormItem>
                <FormLabel>rlist (nm)</FormLabel>
                <FormControl>
                  <Input variant={"deposition"} type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
