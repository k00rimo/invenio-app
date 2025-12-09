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

export function CreatorArray() {
  const { control } = useFormContext<DepositFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "administrative.creators",
  });

  return (
    <div className="space-y-4">
      <FormLabel required>Creators</FormLabel>
      <FormDescription>
        Add one or more creators for this deposition.
      </FormDescription>
      <ul className="space-y-4">
        {fields.map((field, index) => (
          <li
            key={field.id}
            className="flex flex-col gap-6 rounded-lg border bg-muted/30 p-4 md:p-6"
          >
            <div className="grid grid-cols-2 gap-x-6 gap-y-8">
              <FormField
                control={control}
                name={`administrative.creators.${index}.name`}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel required>Creator Name</FormLabel>
                    <FormControl>
                      <Input
                        variant="deposition"
                        placeholder="Dr. Jane Doe"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`administrative.creators.${index}.affiliation`}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel required>Affiliation</FormLabel>
                    <FormControl>
                      <Input
                        variant="deposition"
                        placeholder="University of Science"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            
              <FormField
                control={control}
                name={`administrative.creators.${index}.orcid`}
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>ORCID</FormLabel>
                    <FormControl>
                      <Input
                        variant="deposition"
                        placeholder="0000-0002-1825-0097"
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
                  aria-label={`Remove creator ${index + 1}`}
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
          append({ name: "", affiliation: "", orcid: "" }, { shouldFocus: true })
        }
        leftIcon={
          <PlusIcon className="h-4 w-4" />
        }
      >
        Add Creator
      </Button>

      <Controller
        control={control}
        name="administrative.creators"
        render={({ fieldState: { error } }) =>
          error ? (
            <p className="text-sm text-destructive">{error.message}</p>
          ) : <></>
        }
      />
    </div>
  );
}
