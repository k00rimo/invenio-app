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
  simulationTypeOptions,
  statisticalEnsembleOptions,
  freeEnergyCalculationOptions,
} from "@/lib/deposition/formOptions";
import { MoleculeArray } from "../MoleculeArray";
import { StringArrayInput } from "../StringArrayInput";
import { Separator } from "@/components/ui/separator";

export function MainInfo() {
  const { control } = useFormContext<DepositFormData>();

  return (
    <div className="space-y-8">
      <FormField
        control={control}
        name="mainInformation.simulationType"
        render={({ field }) => (
          <FormItem>
            <FormLabel required>Simulation Type</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a simulation type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {simulationTypeOptions.map((option) => (
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
        name="mainInformation.forceField"
        render={({ field }) => (
          <FormItem>
            <FormLabel required>Force Field</FormLabel>
            <FormControl>
              <Input
                variant={"deposition"}
                placeholder="e.g., CHARMM36"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="mainInformation.simulationLength"
        render={({ field }) => (
          <FormItem>
            <FormLabel required>Simulation Length (ns)</FormLabel>
            <FormControl>
              <Input
                variant={"deposition"}
                type="number"
                placeholder="100"
                {...field}
              />
            </FormControl>
            <FormDescription>Length in nanoseconds.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="mainInformation.simulationTimeStep"
        render={({ field }) => (
          <FormItem>
            <FormLabel required>Simulation Time Step (ps)</FormLabel>
            <FormControl>
              <Input
                variant={"deposition"}
                type="number"
                placeholder="2"
                {...field}
              />
            </FormControl>
            <FormDescription>Time step in picoseconds.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="mainInformation.statisticalEnsemble"
        render={({ field }) => (
          <FormItem>
            <FormLabel required>Statistical Ensemble</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select an ensemble" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {statisticalEnsembleOptions.map((option) => (
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
        name="mainInformation.boxSizeAndShape"
        render={({ field }) => (
          <FormItem>
            <FormLabel required>
              Size and Shape of simulation box (nm degree)
            </FormLabel>
            <FormControl>
              <Input
                variant={"deposition"}
                type="number"
                placeholder="10.5"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Last line of a coordinate file.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="mainInformation.freeEnergyCalculation"
        render={({ field }) => (
          <FormItem>
            <FormLabel required>Free Energy Calculation</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {freeEnergyCalculationOptions.map((option) => (
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

      <div className="space-y-4">
        <FormField
          control={control}
          name="mainInformation.umbrellaSampling"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Umbrella Sampling Used</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value === "true")}
                value={
                  field.value === undefined ? "" : String(field.value)
                }
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Specify if umbrella sampling was used in this simulation.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="mainInformation.awhAdaptiveBiasing"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>AWH Adaptive Biasing Used</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value === "true")}
                value={
                  field.value === undefined ? "" : String(field.value)
                }
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Specify if AWH adaptive biasing was used in this simulation.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Separator />

      <StringArrayInput
        name="mainInformation.referenceTemperature"
        label="Reference Temperature (K)"
        placeholder="e.g., 300"
        itemLabel="Temperature"
        inputType="number"
        required
      />

      <Separator />

      <MoleculeArray />
    </div>
  );
}
