import { cn, type WithBasicProps } from '@/lib/utils'

type TextLoaderProps = WithBasicProps<{
  children: string
  duration?: number
}>

export function TextLoader({
  children,
  duration = 300,
  className,
  style,
}: TextLoaderProps) {
  const cycleMs = duration * Math.max(children.length, 1)

  return (
    <span className={cn('inline-grid align-baseline', className)} style={style}>
      <span
        className="invisible col-start-1 row-start-1 whitespace-pre"
        aria-hidden
      >
        {children}
      </span>
      <span
        className="col-start-1 row-start-1 overflow-hidden whitespace-pre [clip-path:inset(0_100%_0_0)] motion-safe:animate-text-loader motion-reduce:[clip-path:none]"
        style={{ animationDuration: `${cycleMs}ms` }}
      >
        {children}
      </span>
    </span>
  )
}
