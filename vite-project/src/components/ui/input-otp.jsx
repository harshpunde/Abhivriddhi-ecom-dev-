import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { Minus } from "lucide-react";

import { cn } from "../../lib/utils";

// Main Input
function InputOTP({
  className,
  containerClassName,
  ...props
}) {
  return (
    <OTPInput
      containerClassName={cn(
        "flex items-center gap-2",
        containerClassName
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  );
}

// Group
function InputOTPGroup({ className, ...props }) {
  return (
    <div
      className={cn("flex items-center", className)}
      {...props}
    />
  );
}

// Slot
function InputOTPSlot({
  index,
  className,
  ...props
}) {
  const context = React.useContext(OTPInputContext);
  const slot = context?.slots?.[index];

  const char = slot?.char;
  const isActive = slot?.isActive;
  const hasFakeCaret = slot?.hasFakeCaret;

  return (
    <div
      className={cn(
        "relative flex h-10 w-10 items-center justify-center border text-sm transition-all",
        "first:rounded-l-md last:rounded-r-md",
        isActive && "border-blue-500 ring-2 ring-blue-200",
        className
      )}
      {...props}
    >
      {char}

      {hasFakeCaret && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-4 w-px bg-black animate-pulse" />
        </div>
      )}
    </div>
  );
}

// Separator
function InputOTPSeparator(props) {
  return (
    <div role="separator" {...props}>
      <Minus className="w-4 h-4 text-gray-400" />
    </div>
  );
}

export {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
};