import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(0,0,0,0.2),inset_4px_4px_8px_rgba(255,255,255,0.4)] hover:translate-y-[1px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,0.1)]",
                destructive:
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
                outline:
                    "border-4 border-input bg-background hover:bg-accent hover:text-accent-foreground",
                secondary:
                    "bg-secondary text-secondary-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(0,0,0,0.2),inset_4px_4px_8px_rgba(255,255,255,0.4)] hover:translate-y-[1px]",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
                clay: "bg-white text-primary shadow-[8px_8px_16px_0px_rgba(165,180,252,0.4),inset_-4px_-4px_8px_0px_rgba(0,0,0,0.05),inset_4px_4px_8px_0px_rgba(255,255,255,0.8)] hover:shadow-[4px_4px_8px_0px_rgba(165,180,252,0.4),inset_-2px_-2px_4px_0px_rgba(0,0,0,0.05),inset_2px_2px_4px_0px_rgba(255,255,255,0.8)]"
            },
            size: {
                default: "h-12 px-6 py-2",
                sm: "h-10 rounded-xl px-4",
                lg: "h-14 rounded-2xl px-10 text-lg",
                icon: "h-12 w-12",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
