"use client"

import { useRef, useState, useTransition } from "react"
import { IconLoader2, IconUserPlus } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { inviteMemberAction } from "@/app/(dashboard)/account/actions"
import type { FBAdAccount } from "@/lib/facebook"

interface InviteMemberDialogProps {
  adAccounts: FBAdAccount[]
}

export function InviteMemberDialog({ adAccounts }: InviteMemberDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  const toggleAccount = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    selectedIds.forEach((id) => fd.append("accountIds", id))

    startTransition(async () => {
      try {
        await inviteMemberAction(fd)
        toast.success("Member invited successfully.")
        setOpen(false)
        setSelectedIds([])
        formRef.current?.reset()
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to invite member.")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <IconUserPlus className="size-4" />
          Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite a team member</DialogTitle>
          <DialogDescription>
            Enter their Signal account email. They must have already signed up.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="colleague@company.com"
              required
              disabled={isPending}
            />
          </div>

          {adAccounts.length > 0 && (
            <div className="space-y-2">
              <Label>Ad Account Access</Label>
              <p className="text-xs text-muted-foreground">
                Leave all unchecked to grant access to all accounts.
              </p>
              <div className="max-h-48 overflow-y-auto space-y-2 rounded-md border p-3">
                {adAccounts.map((account) => {
                  const numericId = account.id.replace(/^act_/, "")
                  return (
                    <div key={account.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`account-${numericId}`}
                        checked={selectedIds.includes(numericId)}
                        onCheckedChange={() => toggleAccount(numericId)}
                        disabled={isPending}
                      />
                      <label
                        htmlFor={`account-${numericId}`}
                        className="text-sm leading-none cursor-pointer"
                      >
                        {account.name}
                        <span className="ml-1 text-xs text-muted-foreground">
                          ({account.currency})
                        </span>
                      </label>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <IconLoader2 className="mr-2 size-4 animate-spin" />}
              Send Invite
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
