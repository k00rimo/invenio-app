"use client";

import { FormProvider, useForm, useWatch, type FieldErrors, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  depositFormSchema,
  type DepositFormData,
} from "@/lib/validators/depositSchema";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DepositSidebar, type StepStatus } from "./DepositSidebar";
import { Button } from "@/components/ui/button";

import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { steps } from "@/components/forms/deposit/steps/stepsConfig"
import ScrollToTop from "@/components/shared/ScrollToTop";
import { useDepositPersistence } from "@/hooks/useDepositPersistance";
import { administrativeDefaultValues, experimentDefaultValues, systemInformationDefaultValues } from "@/lib/constants/depositSchema";

const isFieldFilled = (value: unknown): boolean => {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === "object" && value !== null) {
    return Object.values(value).some(isFieldFilled);
  }

  return value !== undefined && value !== null && value !== "";
};

export function DepositLayout() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [stepStatusMap, setStepStatusMap] = useState<
    Record<number, StepStatus["status"]>
  >(() => {
    const map: Record<number, StepStatus["status"]> = {};
    steps.forEach((step, index) => {
      map[step.id] = index === 0 ? "active" : "waiting";
    });
    return map;
  });

const methods = useForm({
    resolver: zodResolver(depositFormSchema),
    defaultValues: {
      administrative: administrativeDefaultValues,
      systemInformation: systemInformationDefaultValues,
      experiments: {
        experiments: [{ ...experimentDefaultValues }],
      },
    },
    mode: "onSubmit",
  });

  const { hasSavedData, saveDraft, restoreDraft, discardDraft } = useDepositPersistence(methods);

  const { handleSubmit, trigger, control } = methods;

  const watchedValues = useWatch({ control });

  // Derive the full StepStatus array to pass to the sidebar
  const sidebarSteps: StepStatus[] = steps.map((step) => {
    const status = stepStatusMap[step.id] || "waiting";

    let completedFields = 0;
    const totalStepFields = step.allFields.length;

    if (step.schemaKey && totalStepFields > 0 && watchedValues) {
      const stepValues = watchedValues[step.schemaKey as keyof DepositFormData];
      if (stepValues) {
        completedFields = step.allFields.filter((field) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const value = (stepValues as any)[field];
          return isFieldFilled(value); // Use the recursive helper
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


  const navigateToStep = async (
    targetStepIndex: number,
    options: { blockOnInvalid?: boolean } = {},
  ) => {
    const { blockOnInvalid = false } = options;

    // Don't navigate if clicking the same step or if index is out of bounds
    if (
      targetStepIndex === currentStep ||
      targetStepIndex < 0 ||
      targetStepIndex >= steps.length
    ) {
      return;
    }

    // Get configs and state for the *current* step
    const currentStepConfig = steps[currentStep];
    const hasFilledFields = sidebarSteps[currentStep].completedFields > 0;

    // Run Validation on the current step
    let isValid = true;
    if (currentStepConfig.schemaKey && hasFilledFields) {
      isValid = await trigger(
        currentStepConfig.schemaKey as keyof DepositFormData,
        {
          // Only focus on error if we are blocking navigation
          shouldFocus: blockOnInvalid,
        },
      );
    }

    if (blockOnInvalid && !isValid) {
      setStepStatusMap((prevMap) => ({
        ...prevMap,
        [currentStepConfig.id]: "error",
      }));
      return;
    }

    setCurrentStep(targetStepIndex);

    setStepStatusMap((prevMap) => {
      const newMap = { ...prevMap };
      const targetStepId = steps[targetStepIndex].id;

      if (prevMap[targetStepId] !== "completed") {
        newMap[targetStepId] = "active";
      }

      if (currentStepConfig.schemaKey) {
        if (hasFilledFields) {
          newMap[currentStepConfig.id] = isValid ? "completed" : "error";
        } else if (prevMap[currentStepConfig.id] === "active") {
          newMap[currentStepConfig.id] = "waiting";
        }
      }
      return newMap;
    });
  };

  const handleNextClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    navigateToStep(currentStep + 1, { blockOnInvalid: true });
  };

  const handleBackClick = () => {
    navigateToStep(currentStep - 1);
  };

  const handleSidebarClick = (clickedStepId: number) => {
    const clickedStepIndex = steps.findIndex((s) => s.id === clickedStepId);
    if (clickedStepIndex !== -1) {
      navigateToStep(clickedStepIndex);
    }
  };

  const processForm: SubmitHandler<DepositFormData> = (data) => {  {/* TODO: use in the deposition */}
    setStepStatusMap((prevMap) => {
      const newMap = { ...prevMap };
      steps.forEach((step) => {
        newMap[step.id] = "completed";
      });
      return newMap;
    });

    discardDraft();

    console.log("Data: ", data)

    navigate("/deposition-success");
  };

  const onFormError = (errors: FieldErrors) => {
    const errorKeys = Object.keys(errors) as (keyof DepositFormData)[];
    let firstErrorStepIndex = -1;

    setStepStatusMap((prevMap) => {
      const newMap = { ...prevMap };
      steps.forEach((step, i) => {
        if (!step.schemaKey) {
          newMap[step.id] = prevMap[step.id];
          return;
        }

        const stepSchemaKey = step.schemaKey as keyof DepositFormData;

        if (errorKeys.includes(stepSchemaKey)) {
          if (firstErrorStepIndex === -1) {
            firstErrorStepIndex = i;
          }
          newMap[step.id] = "error";
        } else {
          // If no error, mark as completed (since submit was tried)
          newMap[step.id] = "completed";
        }
      });

      // Mark the final 'submit' step as 'active' if submit fails
      const submitStep = steps[steps.length - 1];
      if (submitStep) {
        newMap[submitStep.id] = "active";
      }

      return newMap;
    });

    if (firstErrorStepIndex !== -1) {
      setCurrentStep(firstErrorStepIndex);
    }
  };

  const isLastStep = currentStep === steps.length - 1;
  const ActiveStepComponent = steps[currentStep].component;
  const stepName = steps[currentStep].name;

  return (
    <FormProvider {...methods}>

      <AlertDialog open={hasSavedData}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore unsaved draft?</AlertDialogTitle>
            <AlertDialogDescription>
              We found a previously saved draft of your deposition. 
              Would you like to restore it or start fresh?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={discardDraft} size={"md"}>Start Fresh</AlertDialogCancel>
            <AlertDialogAction onClick={restoreDraft} size={"md"}>Restore Draft</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex min-h-screen">
        <DepositSidebar
          steps={sidebarSteps}
          onStepClick={handleSidebarClick}
          onSaveDraft={saveDraft}
        />

        <main className="flex-1 p-6">
          <form
            onSubmit={handleSubmit(processForm, onFormError)}
            className="space-y-8"
          >
            <h2 className="font-heading2 tracking-tight">{stepName}</h2>

            <div className="w-2xl relative">
              <ActiveStepComponent handleStepClick={handleSidebarClick} />
              <div className="hidden xl:block absolute left-full top-0 ml-8 h-full w-12 pointer-events-none">
                <div className="sticky top-[85vh] pointer-events-auto">
                   <ScrollToTop />
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 w-2xl">
              <Button
                type="button"
                variant="outline"
                size={"md"}
                onClick={handleBackClick}
                disabled={currentStep === 0}
                leftIcon={<ChevronLeftIcon />}
              >
                Back
              </Button>

              {isLastStep ? (
                <Button type="submit" size={"md"} variant={"secondary"}>
                  Submit Deposition
                </Button>
              ) : (
                <Button
                  type="button"
                  size={"md"}
                  onClick={handleNextClick}
                  rightIcon={<ChevronRightIcon />}
                >
                  Next Step
                </Button>
              )}
            </div>
          </form>
        </main>
      </div>
    </FormProvider>
  );
}