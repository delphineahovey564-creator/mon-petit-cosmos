import * as React from "react";
import type { LucideIcon } from "lucide-react";

type Props = {
  label: string;
  icon?: LucideIcon;
  rightSlot?: React.ReactNode;
  containerClass?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Field = React.forwardRef<HTMLInputElement, Props>(
  ({ label, icon: Icon, rightSlot, containerClass = "", className = "", ...rest }, ref) => {
    const [focused, setFocused] = React.useState(false);
    return (
      <div className={containerClass}>
        <label className="block text-[13px] font-bold text-edu-dark mb-1.5">{label}</label>
        <div
          className="flex items-center gap-2.5 h-14 px-4 rounded-xl bg-white border-[1.5px] transition-colors"
          style={{ borderColor: focused ? "#FF6B35" : "#E5E7EB" }}
        >
          {Icon && <Icon size={20} color="#9CA3AF" />}
          <input
            ref={ref}
            onFocus={(e) => { setFocused(true); rest.onFocus?.(e); }}
            onBlur={(e) => { setFocused(false); rest.onBlur?.(e); }}
            className={`flex-1 bg-transparent outline-none font-semibold text-[15px] text-edu-dark placeholder:text-edu-subtle ${className}`}
            {...rest}
          />
          {rightSlot}
        </div>
      </div>
    );
  },
);
Field.displayName = "Field";