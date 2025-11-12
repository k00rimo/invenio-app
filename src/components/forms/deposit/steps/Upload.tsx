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
import type { DepositFormData } from "@/lib/validators/depositSchema";
import { Textarea } from "@/components/ui/textarea";
import { StringArrayInput } from "../StringArrayInput";
import { Separator } from "@/components/ui/separator";


export function Upload() {
  const { control } = useFormContext<DepositFormData>();

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <FormLabel>Upload Files</FormLabel>
        <div className="flex h-48 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
          <p className="text-gray-500">
            [File Dropzone Component Would Go Here]
          </p>
        </div>
        <FormDescription>
          Upload your TPR, ZIP, or other simulation files.
        </FormDescription>
      </div>

      <Separator />

      <div className="space-y-4">
        <FormLabel sectionHeading>File Metadata</FormLabel>
        <FormDescription>
          Provide metadata for the primary file you&apos;ve uploaded.
        </FormDescription>
      </div>
      
      <FormField
        control={control}
        name="fileIdentification.fileName"
        render={({ field }) => (
          <FormItem>
            <FormLabel required>File Name</FormLabel>
            <FormControl>
              <Input
                variant={"deposition"}
                placeholder="e.g., simulation_run_01.tpr"
                {...field}
              />
            </FormControl>
            <FormDescription>
              The primary name of the uploaded file or dataset.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="fileIdentification.fileDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>File Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Description of this specific file..."
                rows={3}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="fileIdentification.simulationYear"
        render={({ field }) => (
          <FormItem>
            <FormLabel required>Simulation Year</FormLabel>
            <FormControl>
              <Input
                variant={"deposition"}
                type="number"
                placeholder={String(new Date().getFullYear())}
                {...field}
              />
            </FormControl>
            <FormDescription>
              The year the simulation was performed.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="fileIdentification.doi"
        render={({ field }) => (
          <FormItem>
            <FormLabel>DOI</FormLabel>
            <FormControl>
              <Input
                variant={"deposition"}
                placeholder="10.1234/file.5678"
                {...field}
              />
            </FormControl>
            <FormDescription>
              A DOI specifically for this file (if it exists).
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <StringArrayInput
        name="fileIdentification.fileAuthors"
        label="File Authors"
        description="Names of authors specific to this file. Add one per field."
        placeholder="e.g., Doe, J."
        itemLabel="Author"
        required
      />
    </div>
  );
}
