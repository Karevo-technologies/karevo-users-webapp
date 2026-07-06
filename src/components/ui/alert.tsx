import * as React from 'react'

import { cn } from '../../lib/utils'


export function Alert({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="alert"
      className={cn(
        'relative w-full rounded-lg border border-slate-200 p-4 text-slate-950 [&>svg~*]:pl-7 dark:border-slate-800 dark:text-slate-50',
        className,
      )}
      {...props}
    />
  )
}

export function AlertTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h5 className={cn('mb-1 font-medium leading-none tracking-tight', className)} {...props} />
  )
}

export function AlertDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <div className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />
  )
}

