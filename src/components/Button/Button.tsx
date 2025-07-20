import React from "react";
import clsx from "clsx";

type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "danger";
    size?: "sm" | "md" | "lg";
    className?: string;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
};

const Button: React.FC<ButtonProps> = ({
                                           children,
                                           onClick,
                                           variant = "primary",
                                           size = "md",
                                           className = "",
                                           disabled = false,
                                           type = "button",
                                       }) => {
    const baseStyles =
        "inline-flex items-center justify-center rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const sizeStyles = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-5 py-3 text-lg",
    };

    const variantStyles = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    };

    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={clsx(
                baseStyles,
                sizeStyles[size],
                variantStyles[variant],
                className
            )}
        >
            {children}
        </button>
    );
};

export default Button;
