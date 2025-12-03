import { useCallback, useEffect, useState } from "react";
import { type DepositFormData } from "@/lib/validators/depositSchema";

const STORAGE_KEY = "deposit_form_draft";

export function useDepositPersistence(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  methods: any
) {
  const [hasSavedData, setHasSavedData] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (Object.keys(parsed).length > 0) {
          setHasSavedData(true);
        }
      } catch (e) {
        console.error("Failed to parse saved deposit draft", e);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const saveDraft = useCallback(() => {
    const data = methods.getValues();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error("Failed to save draft", e);
      return false;
    }
  }, [methods]);

  const restoreDraft = useCallback(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      try {
        const parsed = JSON.parse(data) as DepositFormData;
        methods.reset(parsed); 
        setHasSavedData(false);
      } catch (e) {
        console.error("Failed to restore draft", e);
      }
    }
  }, [methods]);

  const discardDraft = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHasSavedData(false);
  }, []);

  return {
    hasSavedData,
    saveDraft,
    restoreDraft,
    discardDraft,
  };
}
