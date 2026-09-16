import { TextLoader } from '@/components/ui/text-loader'

export default async function Page() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="font-medium">Wireframe App</div>
      <div className="text-sm text-muted-foreground">
        Building wireframe. Please wait<TextLoader>...</TextLoader>
      </div>
    </div>
  )
}
