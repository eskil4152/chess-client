import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "default" | "danger" | "pill";
  disabled?: boolean;
  fullWidth?: boolean;
};

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "default",
  disabled,
  fullWidth,
}: ButtonProps) {
  const classes = [
    "btn",
    variant === "danger" ? "btn-danger" : "",
    variant === "pill" ? "btn-pill" : "",
    fullWidth ? "btn-full" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={classes}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
