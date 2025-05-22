
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-green-600 text-white hover:bg-green-700",
        warning: "bg-amber-500 text-white hover:bg-amber-600",
        info: "bg-blue-500 text-white hover:bg-blue-600",
        green: "bg-green-600 text-white hover:bg-green-700",
        "green-outline": "border border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950",
      },
      size: {
        default: "h-10 px-4 py-2 sm:h-9",
        sm: "h-9 rounded-md px-3 sm:h-8",
        lg: "h-11 rounded-md px-8 sm:h-10",
        icon: "h-10 w-10 sm:h-9 sm:w-9",
        mobile: "h-12 px-5 py-2.5 text-base", // New mobile-friendly size
      },
      fullWidth: {
        true: "w-full",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
    compoundVariants: [
      {
        size: ["default", "sm", "lg"],
        className: "min-h-[44px] sm:min-h-0" // Ensure touch-friendly targets on mobile
      }
    ]
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  fullWidth?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, fullWidth, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
