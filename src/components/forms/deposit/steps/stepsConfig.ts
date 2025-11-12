import {
  basicInfoFields,
  fileIdentificationFields,
  mainInformationFields,
  detailedInformationFields,
  type DepositFormData,
} from "@/lib/validators/depositSchema";

import { BasicInfo } from "@/components/forms/deposit/steps/BasicInfo";
import { Upload } from "@/components/forms/deposit/steps/Upload";
import { MainInfo } from "@/components/forms/deposit/steps/MainInfo";
import { DetailedInfo } from "@/components/forms/deposit/steps/DetailedInfo";
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
    name: "Basic Info",
    component: BasicInfo,
    schemaKey: "basicInfo",
    allFields: basicInfoFields,
  },
  {
    id: 2,
    name: "File & Upload Info",
    component: Upload,
    schemaKey: "fileIdentification",
    allFields: fileIdentificationFields,
  },
  {
    id: 3,
    name: "Main Simulation Info",
    component: MainInfo,
    schemaKey: "mainInformation",
    allFields: mainInformationFields,
  },
  {
    id: 4,
    name: "Detailed Info (Optional)",
    component: DetailedInfo,
    schemaKey: "detailedInformation",
    allFields: detailedInformationFields,
  },
  {
    id: 5,
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
