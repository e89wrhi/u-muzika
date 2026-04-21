import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export default function DetailWidthWrapper({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        'container',
        'bg-white dark:bg-black p-4 md:p-8 max-w-6xl mx-auto space-y-6',
        className
      )}
    >
      {children}
    </div>
  );
}
