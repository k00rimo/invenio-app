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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { DepositFormData } from "@/lib/validators/depositSchema";
import {
  licenseOptions,
  accessOptions,
} from "@/lib/deposition/formOptions";
import { CreatorArray } from "../CreatorArray";
import { FundingArray } from "../FundingArray";
import { IdentifierArray } from "../IdentifierArray";
import { Separator } from "@/components/ui/separator";
import { StringArrayInput } from "../StringArrayInput";

export function Administrative() {
  const { control } = useFormContext<DepositFormData>();

  return (
    <div className="space-y-8">
      <FormField
        control={control}
        name="administrative.title"
        render={({ field }) => (
          <FormItem>
            <FormLabel required>Title</FormLabel>
            <FormControl>
              <Input
                variant={"deposition"}
                placeholder="e.g., Simulation of Protein-Ligand Binding"
                {...field}
              />
            </FormControl>
            <FormDescription>
              The main title for this deposition.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="administrative.description"
        render={({ field }) => (
          <FormItem>
            <FormLabel required>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="A description of the simulation"
                rows={5}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="administrative.license"
        render={({ field }) => (
          <FormItem>
            <FormLabel required>License</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger size={"md"}>
                  <SelectValue placeholder="Select a license" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {licenseOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              The license under which this dataset will be shared.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="administrative.access"
        render={({ field }) => (
          <FormItem>
            <FormLabel required>Access</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger size={"md"}>
                  <SelectValue placeholder="Select access rights" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {accessOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <span className="flex items-center gap-1">
                      {<option.icon />}
                      {option.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Who will be able to access this dataset?
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <Separator />
      
      <StringArrayInput
        name="administrative.affiliations"
        label="Affiliations"
        placeholder="Masaryk University"
        itemLabel="Affiliation"
        required
      />

      <Separator />

      <StringArrayInput
        name="administrative.tags"
        label="Tags"
        placeholder="Field"
        itemLabel="Tag"
        required
      />

      <Separator />

      <CreatorArray />
      <Separator />

      <FundingArray />
      <Separator />

      <IdentifierArray />
    </div>
  );
}
