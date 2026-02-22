// components/ui/simple-button.tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SimpleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  isLoading?: boolean;
}

const PrimaryButton = React.forwardRef<HTMLButtonElement, SimpleButtonProps>(
  ({ className, asChild = false, isLoading, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        ref={ref}
        disabled={isLoading || props.disabled}
        className={cn(
          // Base Styles
          "inline-flex items-center justify-center w-full h-12 px-6 transition-colors shrink-0",
          // Typography & Shape
          "text-lg font-semibold text-white rounded-[4px]", 
          // Colors (Your specific hex)
          "bg-[#0d1b2a] hover:bg-[#1b263b] active:bg-[#000814]",
          // States
          "disabled:opacity-50 disabled:cursor-not-allowed outline-none",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="animate-spin" size={20} />
            <span>Processing...</span>
          </div>
        ) : (
          children
        )}
      </Comp>
    )
  }
)

PrimaryButton.displayName = "SimpleButton"

export { PrimaryButton }