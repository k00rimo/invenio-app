import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  [
    "w-full min-w-0 rounded-sm border bg-transparent shadow-xs transition-[color,box-shadow] outline-none",
    "file:border-0 file:bg-transparent file:font-medium file:inline-flex file:text-foreground",
    "placeholder:text-muted-foreground",
    "selection:bg-primary selection:text-primary-foreground",
    "dark:bg-input/30",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
    "focus-visible:border-primary focus-visible:ring-primary-light focus-visible:ring-[3px]",
    "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
  ],
  {
    variants: {
      variant: {
        default: [
          "border-gray-dark",
        ],
        deposition: [
          "border-primary rounded-xs"
        ],
      },
      size: {
        lg: [
          "h-14 pl-4 pr-2.5 py-6",
          "text-base md:text-sm",
          "file:h-7 file:text-sm",
        ],
        default: [
          "h-10 px-3 py-2",
          "text-sm",
          "file:h-6 file:text-xs",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, size, ...props }, ref) => {
    return (
      <input
        type={type}
        data-slot="input"
        className={cn(inputVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }
