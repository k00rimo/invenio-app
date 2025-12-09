"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
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
import { Plus, Trash2 } from "lucide-react";
import type { DepositFormData } from "@/lib/validators/depositSchema";
import { Separator } from "@/components/ui/separator";
import FileUploader from "@/components/shared/FileUploader";
import { StringArrayInput } from "../StringArrayInput";

export function SystemInformation() {
  const { control } = useFormContext<DepositFormData>();

  // Field Array for Molecules
  const {
    fields: moleculeFields,
    append: appendMolecule,
    remove: removeMolecule,
  } = useFieldArray({
    control,
    name: "systemInformation.molecules",
  });

  return (
    <div className="space-y-8">
      {/* --- Files --- */}
      <div className="space-y-2">
        <FormLabel required>System Files</FormLabel>
        <FileUploader 
          name="systemInformation.systemFiles"
          label="Upload .gro, .top, or .pdb files"
          accept={{
            'application/octet-stream': ['.gro', '.top', '.pdb', '.tpr'], 
          }}
        />
        <FormDescription>
          Upload the initial structural source and topology files.
        </FormDescription>
        <FormField
          control={control}
          name="systemInformation.systemFiles"
          render={() => <FormMessage />}
        />
      </div>

      <Separator />

      {/* --- Molecular System Composition --- */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Molecular System Composition</h3>
          <p className="text-sm text-muted-foreground">
            Define the biological and chemical makeup of the system.
          </p>
        </div>

        <FormField
          control={control}
          name="systemInformation.initialStructureSource"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Initial Structural Source</FormLabel>
              <FormControl>
                <Input
                  variant="deposition"
                  placeholder="e.g., PDB: 1ABC, AlphaFold"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Molecules List */}
        <div className="space-y-4">
          <FormLabel>Molecules</FormLabel>
          <div className="space-y-3">
            {moleculeFields.map((field, index) => (
              <div
                key={field.id}
                className="flex flex-col gap-4 rounded-md border p-4 shadow-sm bg-card/50"
              >
                <div className="flex items-start justify-between">
                  <span className="text-sm font-semibold text-muted-foreground">
                    Molecule {index + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                    onClick={() => removeMolecule(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name={`systemInformation.molecules.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Molecule Name</FormLabel>
                        <FormControl>
                          <Input variant="deposition" placeholder="e.g., SOL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`systemInformation.molecules.${index}.count`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Count</FormLabel>
                        <FormControl>
                          <Input type="number" variant="deposition" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* Residues - reusing generic StringArrayInput but scoped to this item */}
                <StringArrayInput
                   name={`systemInformation.molecules.${index}.residues`}
                   label="Residues"
                   placeholder="e.g. ALA"
                   itemLabel="Residue"
                />
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendMolecule({ name: "", count: 1, residues: [] })}
            className="w-full border-dashed"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Molecule
          </Button>
        </div>

        {/* Models */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={control}
            name="systemInformation.solventModel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Solvent Model</FormLabel>
                <FormControl>
                  <Input variant="deposition" placeholder="e.g., TIP3P" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="systemInformation.proteinModel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Protein Model</FormLabel>
                <FormControl>
                  <Input variant="deposition" placeholder="e.g., Amber99sb" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="systemInformation.ligandModel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ligand Model</FormLabel>
                <FormControl>
                  <Input variant="deposition" placeholder="e.g., GAFF" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <Separator />

      {/* --- Size & Dimensions --- */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">System Dimensions</h3>
          <p className="text-sm text-muted-foreground">
            Atom counts and box geometry.
          </p>
        </div>

        <FormField
          control={control}
          name="systemInformation.systemSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>System Size (Atoms)</FormLabel>
              <FormControl>
                <Input
                  variant="deposition"
                  type="number"
                  placeholder="e.g., 50000"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormLabel>Size and Shape of simulation box [nm, degree]</FormLabel>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {["x", "y", "z"].map((dim) => (
               <FormField
               key={dim}
               control={control}
               // eslint-disable-next-line @typescript-eslint/no-explicit-any
               name={`systemInformation.boxDimensions.${dim}` as any}
               render={({ field }) => (
                 <FormItem>
                   <FormControl>
                     <Input variant="deposition" type="number" placeholder={dim.toUpperCase()} {...field} />
                   </FormControl>
                   <FormMessage />
                 </FormItem>
               )}
             />
            ))}
             {["alpha", "beta", "gamma"].map((dim) => (
               <FormField
               key={dim}
               control={control}
               // eslint-disable-next-line @typescript-eslint/no-explicit-any
               name={`systemInformation.boxDimensions.${dim}` as any}
               render={({ field }) => (
                 <FormItem>
                   <FormControl>
                     <Input variant="deposition" type="number" placeholder={dim} {...field} />
                   </FormControl>
                   <FormMessage />
                 </FormItem>
               )}
             />
            ))}
          </div>
          <FormDescription>
            Enter box vectors (X, Y, Z) and angles (alpha, beta, gamma) if applicable.
          </FormDescription>
        </div>
      </div>

      <Separator />

      {/* --- Force Field & Simulation Engine --- */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Methodology</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="systemInformation.forceField"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Force Field</FormLabel>
                <FormControl>
                  <Input variant="deposition" placeholder="e.g., CHARMM36m" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="systemInformation.parametrizationMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Parametrization Method</FormLabel>
                <FormControl>
                  <Input variant="deposition" placeholder="e.g., CGenFF" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="rounded-md bg-muted/40 p-4">
          <FormLabel className="mb-4 block text-base">Simulation Engine</FormLabel>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={control}
              name="systemInformation.simulationEngine.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Name</FormLabel>
                  <FormControl>
                    <Input variant="deposition" placeholder="e.g., GROMACS" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="systemInformation.simulationEngine.version"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Version</FormLabel>
                  <FormControl>
                    <Input variant="deposition" placeholder="e.g., 2023.1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="systemInformation.simulationEngine.build"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Build</FormLabel>
                  <FormControl>
                    <Input variant="deposition" placeholder="e.g., GPU/CUDA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
