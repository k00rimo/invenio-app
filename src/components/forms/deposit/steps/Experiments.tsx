"use client";

import { get, useFieldArray, useFormContext } from "react-hook-form";
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
} from "@/lib/deposition/formOptions"; // Adjust path if necessary
import { StringArrayInput } from "../StringArrayInput"; // Adjust path to where this component lives
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import FileUploader from "@/components/shared/FileUploader";

export function Experiments() {
  const { control, watch, formState: { errors } } = useFormContext<DepositFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "experiments.experiments",
  });

  // Watch names to update Accordion titles dynamically
  const watchedExperiments = watch("experiments.experiments");

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <p className="text-sm text-muted-foreground">
          Define your simulation runs. You can add multiple experiments (e.g.,
          Equilibration, Production).
        </p>
      </div>

      <Accordion type="multiple" className="w-full space-y-4">
        {fields.map((field, index) => {
          const experimentName =
            watchedExperiments?.[index]?.name || `Experiment ${index + 1}`;

          const errorForThisItem = get(errors, `experiments.experiments.${index}`);
          const hasError = !!errorForThisItem;

          return (
            <AccordionItem
              key={field.id}
              value={field.id}
              className={cn(
                "border px-4 data-[state=open]:bg-muted/10 last:border-b",
                hasError && "border-destructive/50 bg-destructive/10"
              )}
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="font-semibold text-lg">
                  {index + 1}. {experimentName}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6 space-y-8 mx-1">
                {/* 1. Experiment Identity & Files */}
                <div className="space-y-6">
                  <div className="flex flex-col gap-6">
                    <FormField
                      control={control}
                      name={`experiments.experiments.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Experiment Name</FormLabel>
                          <FormControl>
                            <Input
                              variant="deposition"
                              placeholder="e.g., NVT Equilibration"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`experiments.experiments.${index}.restraintsApplied`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 bg-background">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Restraints Applied</FormLabel>
                            <FormDescription>
                              Were position restraints used?
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <FormLabel required>Experiment Files</FormLabel>
                    
                    <FileUploader 
                      name={`experiments.experiments.${index}.experimentFiles`}
                      label={`Upload .tpr, .trj, .mdp for "${experimentName}"`}
                      accept={{
                        'application/octet-stream': ['.tpr', '.trj', '.mdp', '.mp4'],
                      }}
                    />

                    <FormField
                      control={control}
                      name={`experiments.experiments.${index}.experimentFiles`}
                      render={() => <FormMessage />}
                    />
                  </div>
                </div>

                <Separator />

                {/* 2. Thermostat Settings (Nested Object) */}
                <div className="space-y-4">
                  <FormLabel className="text-base font-semibold">
                    Thermostat
                  </FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FormField
                      control={control}
                      name={`experiments.experiments.${index}.thermostat.tcoupl`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2">
                          <FormLabel>Coupling Algorithm</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-fit p-2">
                                <SelectValue placeholder="Select tcoupl" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {tcouplOptions.map((option) => (
                                <SelectItem
                                  key={option.label}
                                  value={option.value}
                                >
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
                      name={`experiments.experiments.${index}.thermostat.nsttcouple`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2">
                          <FormLabel>nsttcouple (steps)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              variant="deposition"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="md:col-span-2 lg:col-span-1">
                      <StringArrayInput
                        name={`experiments.experiments.${index}.thermostat.tauT`}
                        label="tau-t (ps)"
                        placeholder="e.g. 0.1"
                        itemLabel="Val"
                        inputType="number"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* 3. Barostat Settings (Nested Object) */}
                <div className="space-y-4">
                  <FormLabel className="text-base font-semibold">
                    Barostat
                  </FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FormField
                      control={control}
                      name={`experiments.experiments.${index}.barostat.pcoupl`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Coupling Algorithm</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger size={"md"}>
                                <SelectValue placeholder="Select pcoupl" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {pcouplOptions.map((option) => (
                                <SelectItem
                                  key={option.label}
                                  value={option.value}
                                >
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
                      name={`experiments.experiments.${index}.barostat.pcoupltype`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Coupling Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger size={"md"}>
                                <SelectValue placeholder="Select Type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {pcouplTypeOptions.map((option) => (
                                <SelectItem
                                  key={option.label}
                                  value={option.value}
                                >
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
                      name={`experiments.experiments.${index}.barostat.tauP`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>tau-p (ps)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              variant="deposition"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`experiments.experiments.${index}.barostat.refcoordScaling`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ref Coord Scaling</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger size={"md"}>
                                <SelectValue placeholder="Select Scaling" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {refcoordScalingOptions.map((option) => (
                                <SelectItem
                                  key={option.label}
                                  value={option.value}
                                >
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

                <Separator />

                {/* 4. Simulation Parameters & Cutoffs */}
                <div className="space-y-4">
                  <FormLabel className="text-base font-semibold">
                    Parameters & Cutoffs
                  </FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FormField
                      control={control}
                      name={`experiments.experiments.${index}.timeStep`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Time Step (fs)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              variant="deposition"
                              placeholder="2"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`experiments.experiments.${index}.length`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Length (ns)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              variant="deposition"
                              placeholder="100"
                              {...field}
                            />
                          </FormControl>
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
                          <FormControl>
                            <Input
                              type="number"
                              variant="deposition"
                              placeholder="10"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name={`experiments.experiments.${index}.constraintScheme`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Constraint Scheme</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger size={"md"}>
                                <SelectValue placeholder="Select Scheme" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {constraintAlgorithmOptions.map((option) => (
                                <SelectItem
                                  key={option.label}
                                  value={option.value}
                                >
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
                      name={`experiments.experiments.${index}.cutoffs.vdw`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>VdW Cutoff (nm)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              variant="deposition"
                              placeholder="1.2"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`experiments.experiments.${index}.cutoffs.coulomb`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Coulomb Cutoff (nm)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              variant="deposition"
                              placeholder="1.2"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
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
                    disabled={fields.length === 1}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove Experiment
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      <Button
        type="button"
        variant="outline"
        onClick={() =>
          append({
            name: "",
            experimentFiles: [],
            // Initialize nested objects to avoid undefined errors
            thermostat: { tauT: [] }, 
            barostat: {},
            cutoffs: { vdw: 0, coulomb: 0 },
            timeStep: -1,
            length: -1,
            outputCadence: undefined,
            restraintsApplied: false,
          })
        }
        className="w-full border-dashed py-6"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Experiment
      </Button>
    </div>
  );
}
