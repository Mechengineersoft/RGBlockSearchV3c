import React from "react";
import { Input } from "./input";
import { Button } from "./button";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          className={cn("pr-10", className)}
          ref={ref}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-red-500" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
          <span className="sr-only">
            {showPassword ? "Hide password" : "Show password"}
          </span>
        </Button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";