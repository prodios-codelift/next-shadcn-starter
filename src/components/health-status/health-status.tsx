'use client'

import { useQuery } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { match } from 'ts-pattern'

import { ErrorMessage } from '@/components/ui/error-message'
import { Skeleton } from '@/components/ui/skeleton'
import { useTRPC } from '@/trpc/client'

export default function HealthStatus() {
  const trpc = useTRPC()
  const healthQuery = useQuery(trpc.health.hello.queryOptions())

  return match(healthQuery)
    .returnType<ReactNode>()
    .with({ status: 'pending' }, () => <Skeleton className="h-4 w-40" />)
    .with({ status: 'success' }, ({ data }) => (
      <p className="text-sm text-muted-foreground">{data.message}</p>
    ))
    .with({ status: 'error' }, ({ error, refetch }) => (
      <ErrorMessage
        title="Unable to reach tRPC"
        error={error}
        onReset={() => void refetch()}
        showBackHomeLink={false}
      />
    ))
    .otherwise(() => null)
}
