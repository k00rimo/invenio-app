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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { objectIdentifiersType } from "@/lib/deposition/formOptions";

export function IdentifierArray() {
  const { control } = useFormContext<DepositFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "administrative.objectIdentifiers",
  });

  return (
    <div className="space-y-4">
      <FormLabel required>
        Object Identifiers
      </FormLabel>
      <FormDescription>
        Add persistent identifiers (e.g., DOI).
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
                name={`administrative.objectIdentifiers.${index}.identifier`}
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
                name={`administrative.objectIdentifiers.${index}.identifierType`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Identifier Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger size={"md"}>
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {objectIdentifiersType.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

      <Controller
        control={control}
        name="administrative.objectIdentifiers"
        render={({ fieldState: { error } }) =>
          error ? (
            <p className="text-sm text-destructive">{error.message}</p>
          ) : <></>
        }
      />
    </div>
  );
}
