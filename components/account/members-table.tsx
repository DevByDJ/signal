"use client"

import { useState, useTransition } from "react"
import { IconTrash, IconLoader2, IconPencil } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import {
  updateMemberAccountsAction,
  removeMemberAction,
} from "@/app/(dashboard)/account/actions"
import type { AgencyMember } from "@/types"
import type { FBAdAccount } from "@/lib/facebook"

interface MembersTableProps {
  members: AgencyMember[]
  adAccounts: FBAdAccount[]
}

export function MembersTable({ members, adAccounts }: MembersTableProps) {
  const [editingMember, setEditingMember] = useState<AgencyMember | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isPending, startTransition] = useTransition()

  const openEdit = (member: AgencyMember) => {
    setEditingMember(member)
    setSelectedIds(member.assigned_account_ids ?? [])
  }

  const handleSaveAccounts = () => {
    if (!editingMember) return
    startTransition(async () => {
      try {
        await updateMemberAccountsAction(editingMember.id, selectedIds)
        toast.success("Account access updated.")
        setEditingMember(null)
      } catch {
        toast.error("Failed to update access.")
      }
    })
  }

  const handleRemove = (memberId: string) => {
    startTransition(async () => {
      try {
        await removeMemberAction(memberId)
        toast.success("Member removed.")
      } catch {
        toast.error("Failed to remove member.")
      }
    })
  }

  const toggleAccount = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )

  if (members.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No members yet. Invite someone to get started.
      </p>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Ad Account Access</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => {
            const accountCount = member.assigned_account_ids?.length ?? 0
            const hasAllAccess = !member.assigned_account_ids

            return (
              <TableRow key={member.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">
                      {member.profile?.full_name ?? "Unknown"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {member.profile?.email ?? member.user_id}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  {hasAllAccess ? (
                    <Badge
                      variant="outline"
                      className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                    >
                      All accounts
                    </Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {accountCount} account{accountCount !== 1 ? "s" : ""}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(member.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEdit(member)}
                      disabled={isPending}
                    >
                      <IconPencil className="size-4" />
                      <span className="sr-only">Edit access</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(member.id)}
                      disabled={isPending}
                      className="text-destructive hover:text-destructive"
                    >
                      {isPending ? (
                        <IconLoader2 className="size-4 animate-spin" />
                      ) : (
                        <IconTrash className="size-4" />
                      )}
                      <span className="sr-only">Remove member</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {/* Edit access dialog */}
      <Dialog
        open={!!editingMember}
        onOpenChange={(o) => !o && setEditingMember(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Account Access</DialogTitle>
            <DialogDescription>
              Choose which ad accounts{" "}
              <strong>{editingMember?.profile?.full_name ?? "this member"}</strong>{" "}
              can view. Leave all unchecked to grant access to all accounts.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-64 overflow-y-auto space-y-2 rounded-md border p-3">
            {adAccounts.map((account) => {
              const numericId = account.id.replace(/^act_/, "")
              return (
                <div key={account.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`edit-account-${numericId}`}
                    checked={selectedIds.includes(numericId)}
                    onCheckedChange={() => toggleAccount(numericId)}
                    disabled={isPending}
                  />
                  <label
                    htmlFor={`edit-account-${numericId}`}
                    className="text-sm cursor-pointer leading-none"
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
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingMember(null)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveAccounts} disabled={isPending}>
              {isPending && (
                <IconLoader2 className="mr-2 size-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
