"use client";

import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import type { DepositFormData } from "@/lib/validators/depositSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { PlusIcon, Trash2Icon } from "lucide-react";

export function MoleculeArray() {
  const { control } = useFormContext<DepositFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "mainInformation.molecules",
  });

  return (
    <div className="space-y-4">
      <FormLabel
        required
      >
        Molecules
      </FormLabel>
      <FormDescription>
        List of molecules included in the simulation.
      </FormDescription>
      <ul className="space-y-6">
        {fields.map((field, index) => (
          <li
            key={field.id}
            className="flex flex-col gap-6 rounded-lg border bg-muted/30 p-4 md:p-6"
          >
            <div className="grid grid-cols-3 gap-x-6 gap-y-8">
              {/* Molecule Name */}
              <FormField
                control={control}
                name={`mainInformation.molecules.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Molecule Name</FormLabel>
                    <FormControl>
                      <Input
                        variant="deposition"
                        placeholder="e.g., Water, Protein"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Molecule Count */}
              <FormField
                control={control}
                name={`mainInformation.molecules.${index}.count`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Count</FormLabel>
                    <FormControl>
                      <Input
                        variant="deposition"
                        type="number"
                        placeholder="1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="w-full flex justify-end">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="self-end"
                  onClick={() => remove(index)}
                  aria-label={`Remove molecule ${index + 1}`}
                >
                  <Trash2Icon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          append({ name: "", count: 1 }, { shouldFocus: true })
        }
        leftIcon={
          <PlusIcon className="h-4 w-4" />
        }
      >
        Add Molecule
      </Button>

      <Controller
        control={control}
        name="mainInformation.molecules"
        render={({ fieldState: { error } }) =>
          error ? (
            <p className="text-sm font-medium text-destructive">
              {error.message}
            </p>
          ) : (
            <></>
          )
        }
      />
    </div>
  );
}
