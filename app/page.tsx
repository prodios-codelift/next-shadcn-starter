import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { HouseIcon } from 'lucide-react'

import HealthStatus from '@/components/health-status'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { PageContainer } from '@/components/ui/page-container'
import { PageHeader } from '@/components/ui/page-header'
import { getQueryClient, trpc } from '@/trpc/server'

export default async function Page() {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(trpc.health.hello.queryOptions())

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PageContainer>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Home</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <PageHeader
          icon={<HouseIcon />}
          title="Project ready"
          description="You may now add components and start building."
          extraContent={<Button>Button</Button>}
        />
        <HealthStatus />
        <p className="font-mono text-xs text-muted-foreground">
          Press <kbd>d</kbd> to toggle dark mode
        </p>
      </PageContainer>
    </HydrationBoundary>
  )
}
