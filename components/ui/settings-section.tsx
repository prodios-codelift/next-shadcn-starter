import type { PropsWithChildren } from 'react'

import { cn, type WithBasicProps } from '@/lib/utils'

type SettingsSectionProps = WithBasicProps<
  PropsWithChildren<{
    title: string
    description: string
  }>
>

export function SettingsSection({
  title,
  description,
  children,
  className,
  style,
}: SettingsSectionProps) {
  return (
    <section
      className={cn(
        'grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)] lg:gap-16 xl:gap-20',
        className,
      )}
      style={style}
    >
      <div className="flex flex-col gap-1.5">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  )
}
