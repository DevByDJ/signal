"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { IconBrandApple, IconBrandGoogle, IconLoader2 } from "@tabler/icons-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function LoginForm() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  // ── Email sign-in ──────────────────────────────────────────
  const [signInEmail, setSignInEmail] = useState("")
  const [signInPassword, setSignInPassword] = useState("")

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading("email-signin")
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: signInEmail,
      password: signInPassword,
    })
    if (error) {
      toast.error(error.message)
      setLoading(null)
    } else {
      router.push("/dashboard")
      router.refresh()
    }
  }

  // ── Email sign-up ──────────────────────────────────────────
  const [signUpName, setSignUpName] = useState("")
  const [signUpEmail, setSignUpEmail] = useState("")
  const [signUpPassword, setSignUpPassword] = useState("")

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading("email-signup")
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: signUpEmail,
      password: signUpPassword,
      options: {
        data: { full_name: signUpName },
      },
    })
    if (error) {
      toast.error(error.message)
      setLoading(null)
    } else {
      toast.success("Check your email to confirm your account!")
      setLoading(null)
    }
  }

  // ── OAuth ──────────────────────────────────────────────────
  const handleOAuth = async (provider: "google" | "apple") => {
    setLoading(provider)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      toast.error(error.message)
      setLoading(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* OAuth buttons */}
      <div className="flex flex-col gap-3">
        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={() => handleOAuth("google")}
          disabled={!!loading}
        >
          {loading === "google" ? (
            <IconLoader2 className="size-4 animate-spin" />
          ) : (
            <IconBrandGoogle className="size-4" />
          )}
          Continue with Google
        </Button>
        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={() => handleOAuth("apple")}
          disabled={!!loading}
        >
          {loading === "apple" ? (
            <IconLoader2 className="size-4 animate-spin" />
          ) : (
            <IconBrandApple className="size-4" />
          )}
          Continue with Apple
        </Button>
      </div>

      {/* Divider */}
      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-card px-2 text-muted-foreground">
          or continue with email
        </span>
      </div>

      {/* Email tabs */}
      <Tabs defaultValue="signin">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign in</TabsTrigger>
          <TabsTrigger value="signup">Sign up</TabsTrigger>
        </TabsList>

        {/* Sign in */}
        <TabsContent value="signin">
          <form onSubmit={handleSignIn} className="flex flex-col gap-4 pt-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="signin-email">Email</Label>
              <Input
                id="signin-email"
                type="email"
                placeholder="you@example.com"
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="signin-password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="signin-password"
                type="password"
                placeholder="••••••••"
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={!!loading}>
              {loading === "email-signin" ? (
                <IconLoader2 className="size-4 animate-spin" />
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </TabsContent>

        {/* Sign up */}
        <TabsContent value="signup">
          <form onSubmit={handleSignUp} className="flex flex-col gap-4 pt-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="signup-name">Full name</Label>
              <Input
                id="signup-name"
                type="text"
                placeholder="Jane Smith"
                value={signUpName}
                onChange={(e) => setSignUpName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                placeholder="Min. 8 characters"
                minLength={8}
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={!!loading}>
              {loading === "email-signup" ? (
                <IconLoader2 className="size-4 animate-spin" />
              ) : (
                "Create account"
              )}
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      <p className="text-center text-xs text-muted-foreground">
        By continuing, you agree to our{" "}
        <Link href="/terms" className="underline hover:text-foreground">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline hover:text-foreground">
          Privacy Policy
        </Link>
      </p>
    </div>
  )
}
