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
import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import type { DepositFormData } from "@/lib/validators/depositSchema";
import { Separator } from "@/components/ui/separator";
import FileUploader from "@/components/shared/FileUploader";

export function SystemInformation() {
  const { control } = useFormContext<DepositFormData>();

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <FormLabel required>System Files</FormLabel>
        
        <FileUploader 
          name="systemInformation.systemFiles"
          label="Upload .gro, .top, or .pdb files"
          accept={{
            'application/octet-stream': ['.gro', '.top', '.pdb', '.mp4'], 
            // Add standard mime types if known, otherwise generic extension mapping works in modern browsers
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <FormField
            control={control}
            name="systemInformation.solventModel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Solvent Model</FormLabel>
                <FormControl>
                  <Input
                    variant="deposition"
                    placeholder="e.g., TIP3P"
                    {...field}
                  />
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
                  <Input
                    variant="deposition"
                    placeholder="e.g., Amber99sb"
                    {...field}
                  />
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
                  <Input
                    variant="deposition"
                    placeholder="e.g., GAFF"
                    {...field}
                  />
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <FormField
            control={control}
            name="systemInformation.boxSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Box Volume (nm³)</FormLabel>
                <FormControl>
                  <Input
                    variant="deposition"
                    type="number"
                    placeholder="Optional"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <FormLabel>Box Dimensions (nm)</FormLabel>
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={control}
              name="systemInformation.boxDimensions.x"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      variant="deposition"
                      type="number"
                      placeholder="X"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="systemInformation.boxDimensions.y"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      variant="deposition"
                      type="number"
                      placeholder="Y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="systemInformation.boxDimensions.z"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      variant="deposition"
                      type="number"
                      placeholder="Z"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* --- Force Field & Simulation Engine --- */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Methodology</h3>
          <p className="text-sm text-muted-foreground">
            Force fields and engine details.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="systemInformation.forceField"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Force Field</FormLabel>
                <FormControl>
                  <Input
                    variant="deposition"
                    placeholder="e.g., CHARMM36m"
                    {...field}
                  />
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
                  <Input
                    variant="deposition"
                    placeholder="e.g., CGenFF"
                    {...field}
                  />
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
                    <Input
                      variant="deposition"
                      placeholder="e.g., GROMACS"
                      {...field}
                    />
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
                    <Input
                      variant="deposition"
                      placeholder="e.g., 2023.1"
                      {...field}
                    />
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
                    <Input
                      variant="deposition"
                      placeholder="e.g., GPU/CUDA"
                      {...field}
                    />
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
