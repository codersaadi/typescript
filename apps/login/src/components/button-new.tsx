import { clsx } from "clsx";
import { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef, ReactNode } from "react";
import { Spinner } from "./spinner";

export enum ButtonSizes {
  XSmall = "XSmall",
  Small = "Small",
  Medium = "Medium",
  Large = "Large",
}

export enum ButtonVariants {
  Primary = "Primary",
  Secondary = "Secondary",
  Destructive = "Destructive",
  Ghost = "Ghost",
}

export enum ButtonColors {
  Neutral = "Neutral",
  Primary = "Primary",
  Warn = "Warn",
}

export type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  size?: ButtonSizes;
  variant?: ButtonVariants;
  color?: ButtonColors;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
  fullWidth?: boolean;
};

const sizeClasses = {
  [ButtonSizes.XSmall]: "px-2 h-[28px] text-xs",
  [ButtonSizes.Small]: "px-4 h-[36px] text-sm",
  [ButtonSizes.Medium]: "px-6 h-[42px] text-base",
  [ButtonSizes.Large]: "px-8 h-[48px] text-lg",
};

export const getButtonClasses = ({
  size,
  variant,
  color,
  fullWidth,
  disabled,
  loading,
}: {
  size: ButtonSizes;
  variant: ButtonVariants;
  color: ButtonColors;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
}) =>
  clsx(
    "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
    {
      "w-full": fullWidth,
      "opacity-50 cursor-not-allowed": disabled || loading,
      [sizeClasses[size]]: true,
      
      // Primary variant
      "bg-primary-light-500 text-primary-light-contrast-500 hover:bg-primary-light-400 focus:ring-primary-light-500 dark:bg-primary-dark-500 dark:text-primary-dark-contrast-500 dark:hover:bg-primary-dark-400 dark:focus:ring-primary-dark-500":
        variant === ButtonVariants.Primary && color === ButtonColors.Primary,
      
      // Secondary variant
      "border-2 border-primary-light-500 text-primary-light-500 hover:bg-primary-light-50 focus:ring-primary-light-500 dark:border-primary-dark-500 dark:text-primary-dark-500 dark:hover:bg-primary-dark-50 dark:focus:ring-primary-dark-500":
        variant === ButtonVariants.Secondary && color === ButtonColors.Primary,
      
      // Ghost variant
      "text-primary-light-500 hover:bg-primary-light-50 focus:ring-primary-light-500 dark:text-primary-dark-500 dark:hover:bg-primary-dark-50 dark:focus:ring-primary-dark-500":
        variant === ButtonVariants.Ghost && color === ButtonColors.Primary,
      
      // Destructive variants
      "bg-warn-light-500 text-white hover:bg-warn-light-400 focus:ring-warn-light-500":
        variant === ButtonVariants.Destructive,
    }
  );

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = "",
      variant = ButtonVariants.Primary,
      size = ButtonSizes.Medium,
      color = ButtonColors.Primary,
      icon,
      iconPosition = "left",
      loading = false,
      fullWidth = false,
      disabled = false,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`${getButtonClasses({
        size,
        variant,
        color,
        fullWidth,
        disabled,
        loading,
      })} ${className}`}
      {...props}
      aria-busy={loading}
    >
      {loading && (
        <Spinner
          className={clsx("mr-2", {
            "h-3 w-3": size === ButtonSizes.XSmall,
            "h-4 w-4": size === ButtonSizes.Small,
            "h-5 w-5": size === ButtonSizes.Medium,
            "h-6 w-6": size === ButtonSizes.Large,
          })}
        />
      )}
      {!loading && icon && iconPosition === "left" && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {!loading && icon && iconPosition === "right" && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  )
);