"use client"

import { useState, useTransition } from "react"
import { IconBuilding, IconUser, IconLoader2 } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { createAgencyAction, joinAsUserAction } from "./actions"

type AccountType = "agency" | "user" | null

export function OnboardingForm() {
  const [selected, setSelected] = useState<AccountType>(null)
  const [agencyName, setAgencyName] = useState("")
  const [isPending, startTransition] = useTransition()

  const handleSubmit = () => {
    startTransition(async () => {
      if (selected === "agency") {
        const fd = new FormData()
        fd.append("agencyName", agencyName)
        await createAgencyAction(fd)
      } else {
        await joinAsUserAction()
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setSelected("agency")}
          className={cn(
            "flex flex-col items-start gap-3 rounded-xl border p-6 text-left transition-all hover:border-primary/60 hover:bg-accent/40",
            selected === "agency"
              ? "border-primary bg-accent/60 ring-1 ring-primary"
              : "border-border bg-card"
          )}
        >
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <IconBuilding className="size-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold">Create an Agency</p>
            <p className="mt-1 text-sm text-muted-foreground">
              You manage Meta ad accounts and want to onboard your team. You&apos;ll
              connect a Meta Business account and control what data each team member sees.
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setSelected("user")}
          className={cn(
            "flex flex-col items-start gap-3 rounded-xl border p-6 text-left transition-all hover:border-primary/60 hover:bg-accent/40",
            selected === "user"
              ? "border-primary bg-accent/60 ring-1 ring-primary"
              : "border-border bg-card"
          )}
        >
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <IconUser className="size-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold">Join as a User</p>
            <p className="mt-1 text-sm text-muted-foreground">
              You&apos;ll be assigned to an agency by your agency admin. You can view
              the ad accounts and campaign data your admin gives you access to.
            </p>
          </div>
        </button>
      </div>

      {selected === "agency" && (
        <div className="space-y-2">
          <Label htmlFor="agencyName">Agency Name</Label>
          <Input
            id="agencyName"
            placeholder="e.g. Acme Media Group"
            value={agencyName}
            onChange={(e) => setAgencyName(e.target.value)}
            disabled={isPending}
          />
        </div>
      )}

      {selected && (
        <Button
          onClick={handleSubmit}
          disabled={isPending || (selected === "agency" && !agencyName.trim())}
          className="w-full"
          size="lg"
        >
          {isPending && <IconLoader2 className="mr-2 size-4 animate-spin" />}
          {selected === "agency" ? "Create Agency & Continue" : "Continue to Dashboard"}
        </Button>
      )}
    </div>
  )
}
