import React from "react"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

export const Card: React.FC<CardProps> = ({ children, className = "", ...props }) => {
  return (
    <div className={`bg-white shadow rounded p-4 ${className}`} {...props}>
      {children}
    </div>
  )
}

export default Card
