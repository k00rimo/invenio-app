import { useCallback, useEffect, useState } from "react";
import { type DepositFormData } from "@/lib/validators/depositSchema";

const STORAGE_KEY = "deposit_form_draft";

export function useDepositPersistence(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  methods: any
) {
  const [hasSavedData, setHasSavedData] = useState(false);
  const [savedDraftTitle, setSavedDraftTitle] = useState<string | null>(null);

  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (Object.keys(parsed).length > 0) {
          setHasSavedData(true);

          const title = parsed.administrative?.title;
          if (title) {
            setSavedDraftTitle(title);
          }
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
      setSavedDraftTitle(data.administrative?.title || null);
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
        setSavedDraftTitle(null);
      } catch (e) {
        console.error("Failed to restore draft", e);
      }
    }
  }, [methods]);

  const discardDraft = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHasSavedData(false);
    setSavedDraftTitle(null);
  }, []);

  return {
    hasSavedData,
    savedDraftTitle,
    saveDraft,
    restoreDraft,
    discardDraft,
  };
}
