import { Input } from "@/components/ui/input";
import { useSearchParams } from "react-router";
import { useState, type KeyboardEvent } from "react";
import AccordionFilterWrapper from "./AccordionFilterWrapper";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

type InputFilterProps = {
  title: string;
  paramKey: string;
  placeholder?: string;
  splitByComma?: boolean; // If true, "tag1, tag2" becomes two separate filters
  defaultOpen?: boolean;
};

const InputFilter = ({
  title,
  paramKey,
  placeholder = "Enter value...",
  splitByComma = true,
  defaultOpen = false,
}: InputFilterProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState("");

  const commitFilters = () => {
    if (!inputValue.trim()) return;

    const newParams = new URLSearchParams(searchParams);
    const valuesToAdd = splitByComma
      ? inputValue.split(",").map((s) => s.trim()).filter(Boolean)
      : [inputValue.trim()];

    valuesToAdd.forEach((val) => {
       if (!newParams.getAll(paramKey).includes(val)) {
           newParams.append(paramKey, val);
       }
    });

    newParams.set("page", "1");
    setSearchParams(newParams, { replace: true });
    setInputValue(""); // Clear input on success
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitFilters();
    }
  };

  return (
    <AccordionFilterWrapper title={title} defaultOpen={defaultOpen}>
      <div className="flex w-full items-center space-x-2">
        <Input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          variant={"deposition"}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commitFilters}
          className="h-8 text-sm"
        />
        <Button
            type="button"
            variant="secondary"
            size="icon"
            className="h-8 w-8"
            onClick={commitFilters}
            disabled={!inputValue.trim()}
            aria-label={`Add ${title} filter`}
        >
            <PlusIcon className="h-4 w-4" />
        </Button>
      </div>
    </AccordionFilterWrapper>
  );
};

export default InputFilter;
