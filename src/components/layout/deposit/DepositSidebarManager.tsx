"use client";

import { useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { DepositSidebar, type StepStatus } from "./DepositSidebar"; // Adjust import path as needed
import { steps } from "@/components/forms/deposit/steps/stepsConfig";
import type { DepositFormData } from "@/lib/validators/depositSchema";

// Helper moved here to isolate logic
const isFieldFilled = (value: unknown): boolean => {
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  if (typeof value === "object" && value !== null) {
    return Object.values(value).some(isFieldFilled);
  }
  return value !== undefined && value !== null && value !== "";
};

interface DepositSidebarManagerProps {
  currentStep: number;
  stepStatusMap: Record<number, StepStatus["status"]>;
  onStepClick: (stepId: number) => void;
  onSaveDraft: () => void;
}

export function DepositSidebarManager({
  stepStatusMap,
  onStepClick,
  onSaveDraft,
}: DepositSidebarManagerProps) {
  const { control } = useFormContext<DepositFormData>();
  
  // Isolate the watcher here. 
  // Only this component re-renders when data changes, not the whole Layout.
  const watchedValues = useWatch({ control });

  const sidebarSteps: StepStatus[] = useMemo(() => {
    return steps.map((step) => {
      const status = stepStatusMap[step.id] || "waiting";

      let completedFields = 0;
      const totalStepFields = step.allFields.length;

      if (step.schemaKey && totalStepFields > 0 && watchedValues) {
        const stepValues = watchedValues[step.schemaKey as keyof DepositFormData];
        if (stepValues) {
          completedFields = step.allFields.filter((field) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const value = (stepValues as any)[field];
            return isFieldFilled(value);
          }).length;
        }
      }

      return {
        id: step.id,
        name: step.name,
        status: status,
        totalFields: totalStepFields,
        completedFields: completedFields,
      };
    });
  }, [stepStatusMap, watchedValues]);

  return (
    <DepositSidebar
      steps={sidebarSteps}
      onStepClick={onStepClick}
      onSaveDraft={onSaveDraft}
    />
  );
}
