import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import React from "react"

type AccordionFilterWrapperProps = {
  title: string
  children: React.ReactNode
  className?: string
  defaultOpen?: boolean
}

/**
 * A reusable wrapper component that places filter options inside a collapsible accordion.
 * This helps to keep the UI clean, especially when dealing with numerous filter categories.
 */
const AccordionFilterWrapper = ({
  title,
  children,
  className,
  defaultOpen = false,
}: AccordionFilterWrapperProps) => {
  const accordionValue = "filter-item"

  return (
    <Accordion
      type="single"
      collapsible
      className={cn("w-full rounded-md", className)}
      defaultValue={defaultOpen ? accordionValue : undefined}
    >
      <AccordionItem value={accordionValue} className="border-b-0">
        <AccordionTrigger className="py-1 text-sm font-input hover:no-underline">
          {title}
        </AccordionTrigger>
        <AccordionContent className="pt-2.5 px-2.5">
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default AccordionFilterWrapper
