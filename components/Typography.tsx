// components/Typography.tsx
import React from "react";
import clsx from "clsx";

interface TypographyProps {
  variant?: "title" | "heading" | "body" | "caption" | "highlight";
  color?: "primary" | "secondary" | "warning" | "success" | "error";
  className?: string;
  children: React.ReactNode;
}

const Typography: React.FC<TypographyProps> = ({
  variant = "body",
  color = "primary",
  className,
  children,
}) => {
  const baseStyles = {
    title: "text-3xl font-bold",
    heading: "text-2xl font-semibold",
    body: "text-base font-normal",
    caption: "text-sm font-light",
    highlight: "text-lg font-semibold",
  };

  const colorStyles = {
    primary: "text-gray-900", // Main text color
    secondary: "text-gray-600", // Subdued text color
    warning: "text-yellow-600", // Warning color
    success: "text-green-600", // Success color
    error: "text-red-600", // Error color
  };

  return (
    <span
      className={clsx(
        baseStyles[variant],
        colorStyles[color],
        className // Custom class names if needed
      )}
    >
      {children}
    </span>
  );
};

export default Typography;
