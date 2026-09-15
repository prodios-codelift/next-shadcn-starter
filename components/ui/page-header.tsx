import type { ReactNode } from 'react'

import { cn, type WithBasicProps } from '@/lib/utils'

type PageHeaderProps = WithBasicProps<{
  title: ReactNode
  description: ReactNode
  icon?: ReactNode
  extraContent?: ReactNode
}>

export function PageHeader({
  title,
  description,
  icon,
  extraContent,
  className,
  style,
}: PageHeaderProps) {
  return (
    <div
      data-slot="page-header"
      className={cn(
        'flex flex-col gap-4 max-sm:gap-3 sm:flex-row sm:items-start sm:justify-between',
        className,
      )}
      style={style}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        {icon ? (
          <div className="mt-1 text-muted-foreground [&_svg]:size-5">
            {icon}
          </div>
        ) : null}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground max-sm:text-xl">
            {title}
          </h1>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </div>
      {extraContent ? (
        <div className="w-full sm:w-auto">{extraContent}</div>
      ) : null}
    </div>
  )
}
