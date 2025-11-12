"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
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

export function FundingArray() {
  const { control } = useFormContext<DepositFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "basicInfo.fundingReference",
  });

  return (
    <div className="space-y-4">
      <FormLabel>
        Funding References
      </FormLabel>
      <FormDescription>
        Add any funding sources (optional) related to this research.
      </FormDescription>

      <ul className="space-y-6">
        {fields.map((field, index) => (
          <li
            key={field.id}
            className="flex flex-col gap-6 rounded-lg border bg-muted/30 p-4 md:p-6"
          >
            <div className="grid grid-cols-2 gap-x-6 gap-y-8">
              <FormField
                control={control}
                name={`basicInfo.fundingReference.${index}.funderName`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Funder Name</FormLabel>
                    <FormControl>
                      <Input
                        variant="deposition"
                        placeholder="e.g., National Science Foundation"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`basicInfo.fundingReference.${index}.funderIdentifier`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Funder Identifier</FormLabel>
                    <FormControl>
                      <Input
                        variant="deposition"
                        placeholder="e.g., 10.13039/100000001"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`basicInfo.fundingReference.${index}.awardNumber`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Award Number</FormLabel>
                    <FormControl>
                      <Input
                        variant="deposition"
                        placeholder="e.g., CHE-123456"
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
                  onClick={() => remove(index)}
                  className="self-end"
                  aria-label={`Remove funding reference ${index + 1}`}
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
          append(
            { funderName: "", funderIdentifier: "", awardNumber: "" },
            { shouldFocus: true },
          )
        }
        leftIcon={
          <PlusIcon className="h-4 w-4" />
        }
      >
        Add Funding Reference
      </Button>
    </div>
  );
}
