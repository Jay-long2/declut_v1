import React from "react"

type Variant = "primary" | "outline" | "destructive" | "ghost"
type Size = "sm" | "md" | "lg"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children?: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  const base = "inline-flex items-center justify-center font-medium rounded"
  const variants: Record<Variant, string> = {
    primary: "bg-black text-white hover:bg-gray-800",
    outline: "border border-gray-300 bg-transparent text-gray-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    ghost: "bg-transparent text-gray-700",
  }
  const sizes: Record<Size, string> = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  }

  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`.trim()

  return (
    <button className={cls} {...props}>
      {children}
    </button>
  )
}

export default Button
