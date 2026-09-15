# Button

## button-demo

```tsx
import { ArrowUpIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2 md:flex-row">
      <Button variant="outline">Button</Button>
      <Button variant="outline" size="icon" aria-label="Submit">
        <ArrowUpIcon />
      </Button>
    </div>
  )
}
```

## button-default

```tsx
import { Button } from "@/components/ui/button"

export default function ButtonDefault() {
  return <Button>Button</Button>
}
```

## button-secondary

```tsx
import { Button } from "@/components/ui/button"

export default function ButtonSecondary() {
  return <Button variant="secondary">Secondary</Button>
}
```

## button-destructive

```tsx
import { Button } from "@/components/ui/button"

export default function ButtonDestructive() {
  return <Button variant="destructive">Destructive</Button>
}
```

## button-outline

```tsx
import { Button } from "@/components/ui/button"

export default function ButtonOutline() {
  return <Button variant="outline">Outline</Button>
}
```

## button-ghost

```tsx
import { Button } from "@/components/ui/button"

export default function ButtonGhost() {
  return <Button variant="ghost">Ghost</Button>
}
```

## button-link

```tsx
import { Button } from "@/components/ui/button"

export default function ButtonLink() {
  return <Button variant="link">Link</Button>
}
```

## button-with-icon

```tsx
import { IconGitBranch } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"

export default function ButtonWithIcon() {
  return (
    <Button variant="outline" size="sm">
      <IconGitBranch /> New Branch
    </Button>
  )
}
```

## button-loading

```tsx
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export default function ButtonLoading() {
  return (
    <Button size="sm" variant="outline" disabled>
      <Spinner />
      Submit
    </Button>
  )
}
```

## button-icon

```tsx
import { CircleFadingArrowUpIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function ButtonIcon() {
  return (
    <Button variant="outline" size="icon">
      <CircleFadingArrowUpIcon />
    </Button>
  )
}
```

## button-as-child

```tsx
import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function ButtonAsChild() {
  return (
    <Button asChild>
      <Link href="/login">Login</Link>
    </Button>
  )
}
```

## button-rounded

```tsx
import { ArrowUpIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function ButtonRounded() {
  return (
    <div className="flex flex-col gap-8">
      <Button variant="outline" size="icon" className="rounded-full">
        <ArrowUpIcon />
      </Button>
    </div>
  )
}
```

## button-size

```tsx
import { ArrowUpRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function ButtonSize() {
  return (
    <div className="flex flex-col items-start gap-8 sm:flex-row">
      <div className="flex items-start gap-2">
        <Button size="sm" variant="outline">
          Small
        </Button>
        <Button size="icon-sm" aria-label="Submit" variant="outline">
          <ArrowUpRightIcon />
        </Button>
      </div>
      <div className="flex items-start gap-2">
        <Button variant="outline">Default</Button>
        <Button size="icon" aria-label="Submit" variant="outline">
          <ArrowUpRightIcon />
        </Button>
      </div>
      <div className="flex items-start gap-2">
        <Button variant="outline" size="lg">
          Large
        </Button>
        <Button size="icon-lg" aria-label="Submit" variant="outline">
          <ArrowUpRightIcon />
        </Button>
      </div>
    </div>
  )
}
```
