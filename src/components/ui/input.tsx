import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="w-full space-y-2">
                {label && <label className="text-sm font-medium text-white/70 ml-1">{label}</label>}
                <div className="relative group">
                    <input
                        ref={ref}
                        className={cn(
                            "flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/30",
                            "focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50",
                            "hover:border-white/20 transition-all duration-300",
                            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && <p className="text-red-400 text-xs ml-1">{error}</p>}
            </div>
        );
    }
);
Input.displayName = "Input";
