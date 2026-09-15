'use client'

import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { cn, getErrorMessage, type WithBasicProps } from '@/lib/utils'

type ErrorMessageProps = WithBasicProps<{
  title: ReactNode
  error?: unknown
  description?: ReactNode
  onReset?: () => void
  resetButtonLabel?: ReactNode
  showBackHomeLink?: boolean
}>

export function ErrorMessage({
  title,
  error,
  description,
  onReset,
  resetButtonLabel = 'Try again',
  showBackHomeLink = true,
  className,
  style,
}: ErrorMessageProps) {
  const resolvedDescription =
    description ?? (error !== undefined ? getErrorMessage(error) : undefined)

  return (
    <Empty className={cn(className)} style={style}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <AlertCircle aria-hidden className="text-destructive" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        {resolvedDescription !== undefined ? (
          <EmptyDescription>{resolvedDescription}</EmptyDescription>
        ) : null}
      </EmptyHeader>
      {onReset || showBackHomeLink ? (
        <EmptyContent>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {onReset ? (
              <Button type="button" variant="outline" onClick={onReset}>
                {resetButtonLabel}
              </Button>
            ) : null}
            {showBackHomeLink ? (
              <Button
                nativeButton={false}
                render={<Link href="/" />}
                variant="ghost"
              >
                Back home
              </Button>
            ) : null}
          </div>
        </EmptyContent>
      ) : null}
    </Empty>
  )
}
