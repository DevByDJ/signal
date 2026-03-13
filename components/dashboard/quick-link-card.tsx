import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface QuickLinkCardProps {
  title: string
  description: string
  href: string
  icon: React.ReactNode
}

export function QuickLinkCard({
  title,
  description,
  href,
  icon,
}: QuickLinkCardProps) {
  return (
    <Link href={href} className="block">
      <Card
        className={cn(
          "transition-colors hover:bg-muted/50 hover:ring-foreground/10"
        )}
      >
        <CardContent className="flex items-start gap-3 p-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            {icon}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium">{title}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
