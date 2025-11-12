"use client";

import {
  useFormContext,
  useFieldArray,
  type FieldValues,
  type ArrayPath,
  type Path,
  get,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
  FormField,
} from "@/components/ui/form";
import { PlusIcon, Trash2Icon } from "lucide-react";

interface StringArrayInputProps<T extends FieldValues> {
  name: ArrayPath<T>;
  label: string;
  required?: boolean;
  description?: string;
  placeholder: string;
  itemLabel: string;
  inputType?: "text" | "number";
}

export function StringArrayInput<T extends FieldValues>({
  name,
  label,
  required = false,
  description,
  placeholder,
  itemLabel,
  inputType = "text",
}: StringArrayInputProps<T>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const arrayError = get(errors, name);

  return (
    <div className="space-y-4">
      <FormLabel required={required}>{label}</FormLabel>
      {description && <FormDescription>{description}</FormDescription>}
      <ul className="space-y-3">
        {fields.map((field, index) => (
          <li key={field.id} className="flex items-center gap-2">
            <FormField
              control={control}
              name={`${name}.${index}` as Path<T>}
              render={({ field: controllerField }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      variant="deposition"
                      type={inputType}
                      placeholder={placeholder}
                      {...controllerField}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => remove(index)}
              aria-label={`Remove ${itemLabel} ${index + 1}`}
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          append((inputType === "number" ? 0 : "") as any, {
            shouldFocus: true,
          })
        }
        leftIcon={
          <PlusIcon className="h-4 w-4" />
        }
      >
        Add {itemLabel}
      </Button>

      {arrayError?.message && typeof arrayError.message === "string" && (
        <p className="text-sm font-medium text-destructive">
          {arrayError.message}
        </p>
      )}
    </div>
  );
}
