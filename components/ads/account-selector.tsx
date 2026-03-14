"use client"

import { useRouter, useSearchParams } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { FBAdAccount } from "@/lib/facebook"

interface AccountSelectorProps {
  accounts: FBAdAccount[]
  selectedId: string
}

export function AccountSelector({ accounts, selectedId }: AccountSelectorProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("accountId", value)
    router.push(`/ads?${params.toString()}`)
  }

  return (
    <Select value={selectedId} onValueChange={handleChange}>
      <SelectTrigger className="w-full sm:w-72">
        <SelectValue placeholder="Select ad account" />
      </SelectTrigger>
      <SelectContent>
        {accounts.map((account) => (
          <SelectItem key={account.id} value={account.id.replace(/^act_/, "")}>
            {account.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
