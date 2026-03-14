"use client"

import { useTransition } from "react"
import { IconBuilding } from "@tabler/icons-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSidebar } from "@/components/ui/sidebar"
import { setAdminAgencyAction } from "@/app/(dashboard)/account/admin-agency-actions"

interface Agency {
  id: string
  name: string
}

interface AdminAgencySelectorProps {
  agencies: Agency[]
  currentAgencyId: string | null
}

export function AdminAgencySelector({
  agencies,
  currentAgencyId,
}: AdminAgencySelectorProps) {
  const [isPending, startTransition] = useTransition()
  const { open } = useSidebar()

  if (agencies.length === 0) {
    return (
      <div className="flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground">
        <IconBuilding className="size-3.5 shrink-0" />
        {open && <span>No agencies yet</span>}
      </div>
    )
  }

  const handleChange = (agencyId: string) => {
    startTransition(() => setAdminAgencyAction(agencyId))
  }

  return (
    <div className="px-1">
      <Select
        value={currentAgencyId ?? ""}
        onValueChange={handleChange}
        disabled={isPending}
      >
        <SelectTrigger
          className={`h-8 w-full gap-1 text-xs ${!open ? "justify-center px-2" : ""}`}
        >
          <IconBuilding className="size-3.5 shrink-0 text-muted-foreground" />
          {open && (
            <SelectValue placeholder="Select agency…" />
          )}
        </SelectTrigger>
        <SelectContent>
          {agencies.map((a) => (
            <SelectItem key={a.id} value={a.id} className="text-xs">
              {a.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
