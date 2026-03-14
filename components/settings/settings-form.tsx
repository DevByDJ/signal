"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { z } from "zod"
import { User, Megaphone, Bell, AlertTriangle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().optional(),
})

interface SettingsFormProps {
  user: {
    name: string | null
    email: string | null
    image: string | null
  }
}

export function SettingsForm({ user }: SettingsFormProps) {
  const [profileName, setProfileName] = useState(user.name ?? "")
  const [profileBio, setProfileBio] = useState("")
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)

  const [adAccountId, setAdAccountId] = useState("")
  const [adAccountLoading, setAdAccountLoading] = useState(false)

  const [emailNotifications, setEmailNotifications] = useState(true)
  const [campaignAlerts, setCampaignAlerts] = useState(true)
  const [weeklyReports, setWeeklyReports] = useState(false)
  const [costAlerts, setCostAlerts] = useState(true)
  const [notificationsLoading, setNotificationsLoading] = useState(false)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileError(null)
    const result = profileSchema.safeParse({ name: profileName, bio: profileBio })
    if (!result.success) {
      setProfileError(result.error.issues[0]?.message ?? "Validation failed")
      return
    }
    setProfileLoading(true)
    try {
      // TODO: Persist to API/Supabase
      await new Promise((r) => setTimeout(r, 500))
    } finally {
      setProfileLoading(false)
    }
  }

  const handleAdAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAdAccountLoading(true)
    try {
      // TODO: Persist to API/Supabase
      await new Promise((r) => setTimeout(r, 500))
    } finally {
      setAdAccountLoading(false)
    }
  }

  const handleNotificationsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setNotificationsLoading(true)
    try {
      // TODO: Persist to API/Supabase
      await new Promise((r) => setTimeout(r, 500))
    } finally {
      setNotificationsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setDeleteLoading(true)
    try {
      // TODO: Implement account deletion
      await new Promise((r) => setTimeout(r, 500))
      setDeleteDialogOpen(false)
    } finally {
      setDeleteLoading(false)
    }
  }

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "?"

  return (
    <Tabs defaultValue="profile">
      <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
        <TabsTrigger value="profile" className="gap-2">
          <User className="size-4" />
          Profile
        </TabsTrigger>
        <TabsTrigger value="ad-account" className="gap-2">
          <Megaphone className="size-4" />
          Ad Account
        </TabsTrigger>
        <TabsTrigger value="notifications" className="gap-2">
          <Bell className="size-4" />
          Notifications
        </TabsTrigger>
        <TabsTrigger value="danger" className="gap-2">
          <AlertTriangle className="size-4" />
          Danger Zone
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="mt-6">
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar size="lg" className="size-16">
              <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.name ?? "User"}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user.email ?? ""}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profileBio}
                onChange={(e) => setProfileBio(e.target.value)}
                placeholder="Tell us a little about yourself"
                rows={4}
              />
            </div>
            {profileError && (
              <p className="text-sm text-destructive">{profileError}</p>
            )}
            <Button type="submit" disabled={profileLoading}>
              {profileLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </TabsContent>

      <TabsContent value="ad-account" className="mt-6">
        <form onSubmit={handleAdAccountSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Facebook Ad Account</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Connect and manage your Facebook advertising account.
            </p>
          </div>
          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="facebook-user-id">Facebook User ID</Label>
              <Input
                id="facebook-user-id"
                value="Manage via Integrations page"
                readOnly
                className="bg-muted"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => signIn("facebook")}
            >
              Re-authorize Facebook
            </Button>
            <div className="space-y-2">
              <Label htmlFor="ad-account-id">Ad Account ID</Label>
              <Input
                id="ad-account-id"
                value={adAccountId}
                onChange={(e) => setAdAccountId(e.target.value)}
                placeholder="act_123456789"
              />
              <p className="text-xs text-muted-foreground">
                Your Facebook ad account ID (e.g. act_123456789)
              </p>
            </div>
            <Button type="submit" disabled={adAccountLoading}>
              {adAccountLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Ad Account"
              )}
            </Button>
          </div>
        </form>
      </TabsContent>

      <TabsContent value="notifications" className="mt-6">
        <form onSubmit={handleNotificationsSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Notification Preferences</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Choose how you want to be notified.
            </p>
          </div>
          <div className="space-y-4 max-w-2xl">
            <Card>
              <CardContent className="flex flex-row items-center justify-between py-4">
                <div className="space-y-0.5">
                  <CardTitle className="text-base">Email notifications</CardTitle>
                  <CardDescription>
                    Get emailed when leads come in
                  </CardDescription>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-row items-center justify-between py-4">
                <div className="space-y-0.5">
                  <CardTitle className="text-base">Campaign alerts</CardTitle>
                  <CardDescription>
                    Get notified when a campaign stops
                  </CardDescription>
                </div>
                <Switch
                  checked={campaignAlerts}
                  onCheckedChange={setCampaignAlerts}
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-row items-center justify-between py-4">
                <div className="space-y-0.5">
                  <CardTitle className="text-base">Weekly reports</CardTitle>
                  <CardDescription>
                    Receive a weekly performance summary
                  </CardDescription>
                </div>
                <Switch
                  checked={weeklyReports}
                  onCheckedChange={setWeeklyReports}
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-row items-center justify-between py-4">
                <div className="space-y-0.5">
                  <CardTitle className="text-base">Cost alerts</CardTitle>
                  <CardDescription>
                    Alert when CPL exceeds target
                  </CardDescription>
                </div>
                <Switch
                  checked={costAlerts}
                  onCheckedChange={setCostAlerts}
                />
              </CardContent>
            </Card>
            <Button type="submit" disabled={notificationsLoading}>
              {notificationsLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Preferences"
              )}
            </Button>
          </div>
        </form>
      </TabsContent>

      <TabsContent value="danger" className="mt-6">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Delete Account</CardTitle>
            <CardDescription>
              Permanently delete your account and all associated data. This
              action cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive">Delete Account</Button>
              </DialogTrigger>
              <DialogContent showCloseButton>
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                  <DialogDescription>
                    This will permanently delete your account and all associated
                    data. This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter showCloseButton>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete Account"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
