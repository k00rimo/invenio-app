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

export function IdentifierArray() {
  const { control } = useFormContext<DepositFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "basicInfo.objectIdentifiers",
  });

  return (
    <div className="space-y-4">
      <FormLabel>
        Object Identifiers
      </FormLabel>
      <FormDescription>
        Add other persistent identifiers (optional) for this dataset (e.g., DOI,
        Handle).
      </FormDescription>

      <ul className="space-y-6">
        {fields.map((field, index) => (
          <li
            key={field.id}
            className="flex flex-col gap-6 rounded-lg border bg-muted/30 p-4 md:p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              <FormField
                control={control}
                name={`basicInfo.objectIdentifiers.${index}.identifier`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Identifier</FormLabel>
                    <FormControl>
                      <Input
                        variant="deposition"
                        placeholder="10.1234/dataset.5678"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`basicInfo.objectIdentifiers.${index}.identifierType`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Identifier Type</FormLabel>
                    <FormControl>
                      <Input
                        variant="deposition"
                        placeholder="e.g., DOI, Handle, ARK"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="self-end"
              onClick={() => remove(index)}
              aria-label={`Remove identifier ${index + 1}`}
            >
              <Trash2Icon className="h-4 w-4" />
            </Button>
          </li>
        ))}
      </ul>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          append(
            { identifier: "", identifierType: "" },
            { shouldFocus: true },
          )
        }
        leftIcon={
          <PlusIcon className="h-4 w-4" />
        }
      >
        Add Identifier
      </Button>
    </div>
  );
}
