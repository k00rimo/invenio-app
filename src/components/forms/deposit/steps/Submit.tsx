"use client";

import { useFormContext } from "react-hook-form";
import { type DepositFormData } from "@/lib/validators/depositSchema";
import { steps } from "@/components/forms/deposit/steps/stepsConfig";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Separator } from "@/components/ui/separator";


function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1") // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
}

function RecursiveObject({ data }: { data: Record<string, unknown> }) {
  if (Object.keys(data).length === 0) {
    return <span className="italic text-gray-500">Empty</span>;
  }

  return (
    <div className="flex flex-col gap-3 border-l-2 border-gray-200 pl-3 dark:border-gray-700">
      {Object.entries(data).map(([key, val]) => (
        <div key={key} className="flex flex-col gap-0.5">
          <span className="font-semibold uppercase tracking-wider text-gray-500">
            {formatLabel(key)}
          </span>
          {/* Recursively call RenderValue to handle the child's type */}
          <div className="text-gray-900 dark:text-gray-100">
             <RenderValue value={val} />
          </div>
        </div>
      ))}
    </div>
  );
}

function RenderValue({ value }: { value: unknown }): React.ReactElement {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  ) {
    return <span className="italic text-gray-500">Not provided</span>;
  }

  if (Array.isArray(value)) {
    // if (typeof value[0] === "string" || typeof value[0] === "number") {
    //   return (
    //     <div className="flex flex-wrap gap-2">
    //       {value.map((item, idx) => (
    //         <Badge key={idx} className="break-all whitespace-normal">{item}</Badge>
    //       ))}
    //     </div>
    //   );
    // }
    return (
      <ul className="list-disc space-y-1 pl-5">
        {value.map((item, idx) => (
          <li key={idx} className="break-all whitespace-normal">
            <RenderValue value={item} />
          </li>
        ))}
      </ul>
    );
  }

  if (typeof value === "object") {
    return <RecursiveObject data={value as Record<string, unknown>} />;
  }

  return <span className="whitespace-pre-wrap wrap-break-word">{String(value)}</span>;
}


function DisplayItem({ label, value }: { label: string; value: unknown }) {
  return (
    <div className="grid grid-cols-3 items-start gap-4 py-3">
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-400">
        {label}
      </span>
      <div className="col-span-2 text-sm text-wrap">
        <RenderValue value={value} />
      </div>
    </div>
  );
}

interface SubmitProps {
  handleStepClick?: (stepId: number) => void;
}

export function Submit({ handleStepClick }: SubmitProps) {
  const { watch } = useFormContext<DepositFormData>();
  const allData = watch();

  const reviewSteps = steps.filter((step) => step.schemaKey);

  return (
    <div className="space-y-8">

      {reviewSteps.map((step, index) => {
        const { schemaKey, name, id, allFields } = step;
        if (!schemaKey) return null;

        const sectionData = allData[schemaKey];

        if (
          !sectionData ||
          allFields.length === 0 ||
          Object.values(sectionData).every(
            (v) => v === null || v === undefined || v === "" || (Array.isArray(v) && v.length === 0)
          )
        ) {
          return null;
        }

        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-heading3">{name}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleStepClick?.(id)}
                leftIcon={<Pencil />}
              >
                Edit
              </Button>

            </div>

            <div className="divide-y divide-gray-light">
              {allFields.map((fieldKey) => (
                <DisplayItem
                  key={fieldKey}
                  label={formatLabel(fieldKey)}
                  value={sectionData[fieldKey as keyof typeof sectionData]}
                />
              ))}
            </div>

            {index < reviewSteps.length - 1 && (
              <Separator className="bg-gray-dark"/>
            )}
          </div>
        );
      })}
    </div>
  );
}
