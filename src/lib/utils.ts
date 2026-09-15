import type { CSSProperties } from 'react'

export { cn } from 'cn'

export type WithBasicProps<T = unknown> = T & {
  className?: string
  style?: CSSProperties
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message
  return 'Something went wrong'
}
