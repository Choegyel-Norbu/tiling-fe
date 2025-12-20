import React from 'react';
import { cn } from '../../lib/utils';

export function PageHeader({ title, description, className, children }) {
  return (
    <section className={cn(
      "relative py-12 md:py-16 w-full flex flex-col items-center justify-center border-b border-slate-200",
      className
    )}>
       {/* Content */}
       <div className="container mx-auto px-4 text-center max-w-4xl">
         <div className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-sm text-accent mb-4">
            <span className="flex h-2 w-2 rounded-full bg-accent mr-2"></span>
            TrueLine Tiling
         </div>

         <h1 className="text-xl font-bold text-slate-900 mb-3 tracking-tight leading-tight">
           {title}
         </h1>
         
         {description && (
           <p className="text-sm text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
             {description}
           </p>
         )}
         
         {children && (
           <div className="mt-6">
             {children}
           </div>
         )}
       </div>
    </section>
  );
}

