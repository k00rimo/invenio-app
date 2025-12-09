import {
  administrativeFields,
  systemInfoFields,
  type DepositFormData,
} from "@/lib/validators/depositSchema";

import { Administrative } from "@/components/forms/deposit/steps/Administrative";
import { SystemInformation } from "@/components/forms/deposit/steps/SystemInformation";
import { Experiments } from "@/components/forms/deposit/steps/Experiments";
import { Submit } from "@/components/forms/deposit/steps/Submit";
import type { JSX } from "react";

export interface StepConfig {
  id: number;
  name: string;
  component: (props: { handleStepClick?: (stepId: number) => void }) => JSX.Element;
  schemaKey: keyof DepositFormData | null;
  allFields: string[];
}

export const steps: StepConfig[] = [
  {
    id: 1,
    name: "Administrative",
    component: Administrative,
    schemaKey: "administrative",
    allFields: administrativeFields, 
  },
  {
    id: 2,
    name: "System Information",
    component: SystemInformation,
    schemaKey: "systemInformation",
    allFields: systemInfoFields, 
  },
  {
    id: 3,
    name: "Experiments",
    component: Experiments,
    schemaKey: "experiments",
    allFields: ["experiments"], // Special handling in Review component likely needed for arrays
  },
  {
    id: 4,
    name: "Review & Submit",
    component: Submit,
    schemaKey: null,
    allFields: [],
  },
];

export const schemaKeyToStepIdMap = new Map<string, number>(
  steps
    .filter((step) => step.schemaKey)
    .map((step) => [step.schemaKey as string, step.id]),
);
