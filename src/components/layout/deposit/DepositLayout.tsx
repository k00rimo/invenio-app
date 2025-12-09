"use client";

import { FormProvider, useForm, type FieldErrors, type SubmitHandler } from "react-hook-form";
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
import { type StepStatus } from "./DepositSidebar"; 
import { DepositSidebarManager } from "./DepositSidebarManager"; 
import { Button } from "@/components/ui/button";

import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeftIcon, ChevronRightIcon, Loader2 } from "lucide-react";

import { steps } from "@/components/forms/deposit/steps/stepsConfig";
import ScrollToTop from "@/components/shared/ScrollToTop";
import { useDepositPersistence } from "@/hooks/useDepositPersistance";
import { administrativeDefaultValues, experimentDefaultValues, systemInformationDefaultValues } from "@/lib/constants/depositSchema";
import { depositData } from "@/api/deposition";
import { toast } from "sonner";

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

  const { hasSavedData, savedDraftTitle, saveDraft, restoreDraft, discardDraft } = useDepositPersistence(methods);
  const { handleSubmit, trigger, formState: { isSubmitting } } = methods;

  const navigateToStep = async (
    targetStepIndex: number,
    options: { blockOnInvalid?: boolean } = {},
  ) => {
    const { blockOnInvalid = false } = options;

    if (
      targetStepIndex === currentStep ||
      targetStepIndex < 0 ||
      targetStepIndex >= steps.length
    ) {
      return;
    }

    const currentStepConfig = steps[currentStep];
    const prevStatus = stepStatusMap[currentStepConfig.id];
    
    let isValid = true;
    if (currentStepConfig.schemaKey && prevStatus !== "waiting") {
       isValid = await trigger(
        currentStepConfig.schemaKey as keyof DepositFormData,
        { shouldFocus: blockOnInvalid }
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
         newMap[currentStepConfig.id] = isValid ? "completed" : "error";
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
    if (isSubmitting) return; 

    const clickedStepIndex = steps.findIndex((s) => s.id === clickedStepId);
    if (clickedStepIndex !== -1) {
      navigateToStep(clickedStepIndex);
    }
  };

  const processForm: SubmitHandler<DepositFormData> = async (data) => {
    try {
      await depositData(data);

      setStepStatusMap((prevMap) => {
        const newMap = { ...prevMap };
        steps.forEach((step) => {
          newMap[step.id] = "completed";
        });
        return newMap;
      });

      discardDraft();
      navigate("/deposition-success");

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Submission Failed");
    }
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
          if (firstErrorStepIndex === -1) firstErrorStepIndex = i;
          newMap[step.id] = "error";
        } else {
          newMap[step.id] = "completed";
        }
      });
      const submitStep = steps[steps.length - 1];
      if (submitStep) newMap[submitStep.id] = "active";
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
            <AlertDialogDescription className="space-y-2">
              {savedDraftTitle && (
                <span className="block mt-1 font-subheadline text-foreground">
                  Draft: "{savedDraftTitle}"
                </span>
              )}

              <span>
                We found a previously saved draft of your deposition. 
                Would you like to restore it or start fresh?
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={discardDraft} size={"md"}>Start Fresh</AlertDialogCancel>
            <AlertDialogAction onClick={restoreDraft} size={"md"}>Restore Draft</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex min-h-screen">
        <DepositSidebarManager 
            currentStep={currentStep}
            stepStatusMap={stepStatusMap}
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
                disabled={currentStep === 0 || isSubmitting} 
                leftIcon={<ChevronLeftIcon />}
              >
                Back
              </Button>

              {isLastStep ? (
                <Button 
                  type="submit" 
                  size={"md"} 
                  variant={"secondary"}
                  // UI Feedback for loading state [!code ++]
                  disabled={isSubmitting} 
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? "Submitting..." : "Submit Deposition"}
                </Button>
              ) : (
                <Button
                  type="button"
                  size={"md"}
                  onClick={handleNextClick}
                  rightIcon={<ChevronRightIcon />}
                  disabled={isSubmitting} // Disable next if currently submitting (edge case)
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
