import { ComponentProps } from "react"

type Variant = "primary" | "secondary"
type Size = "md" 

interface ButtonProps extends ComponentProps<"button">{
    variant: Variant,
    size: Size,
    isLoading?: boolean
}

const baseStyle = "flex items-center justify-center rounded-md font-medium transition-colors cursor-pointer "

const variantStyle: Record<Variant ,string> = {
    primary: "bg-action-primary text-action-primary-text hover:bg-action-primary-hover",
    secondary: "bg-action-secondary text-action-secondary-text hover:bg-action-secondary-hover"
}

const sizeStyle: Record<Size ,string> = {
    md: "px-3 py-1.5"
}

const Button = ({
    variant,
    size,
    isLoading = false,
    disabled,
    children,
    className = "",
    ...props
}: ButtonProps) => {

    const classes = `${baseStyle}} ${sizeStyle[size]} ${variantStyle[variant]} ${className}`.trim()

    // todo isloading spinner oder sowas
    return (<button 
        className={`${classes}`}
        disabled={disabled || isLoading}
        {...props}
    >
        {children}
    </button>)
}

export default Button