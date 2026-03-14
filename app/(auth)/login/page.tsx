import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left — brand panel */}
      <div className="relative hidden flex-col justify-between bg-zinc-900 p-10 lg:flex">
        {/* Logo */}
        <div className="flex items-center gap-2 text-white">
          <div className="flex size-8 items-center justify-center rounded-md bg-white/10">
            <svg
              viewBox="0 0 24 24"
              className="size-5 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"
              />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight">Signal</span>
        </div>

        {/* Tagline */}
        <div className="space-y-2">
          <blockquote className="text-2xl font-semibold leading-snug text-white">
            "Stop guessing. Start knowing. Signal brings clarity to every campaign."
          </blockquote>
          <p className="text-sm text-zinc-400">
            Ad operations, simplified.
          </p>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex size-7 items-center justify-center rounded-md bg-foreground text-background">
              <svg
                viewBox="0 0 24 24"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"
                />
              </svg>
            </div>
            <span className="text-base font-semibold">Signal</span>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to your Signal account to continue
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  )
}
