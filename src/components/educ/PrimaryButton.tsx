import * as React from "react";
import { motion } from "framer-motion";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  fullWidth?: boolean;
};

export function PrimaryButton({ children, fullWidth = true, className = "", disabled, ...rest }: Props) {
  return (
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.97 }}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      disabled={disabled}
      className={`h-14 rounded-[14px] bg-edu-primary text-white font-extrabold text-base shadow-[0px_6px_16px_rgba(255,107,53,0.28)] disabled:opacity-50 disabled:pointer-events-none ${fullWidth ? "w-full" : "px-7"} ${className}`}
      {...(rest as React.ComponentProps<typeof motion.button>)}
    >
      {children}
    </motion.button>
  );
}