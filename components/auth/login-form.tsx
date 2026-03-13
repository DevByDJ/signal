"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Facebook, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const [loading, setLoading] = useState(false);

  const handleSignIn = () => {
    setLoading(true);
    signIn("facebook", { callbackUrl: "/dashboard" });
  };

  return (
    <>
      <Button
        onClick={handleSignIn}
        disabled={loading}
        className={cn(
          "w-full bg-[#1877F2] hover:bg-[#1877F2]/90 text-white border-0",
          "h-10 gap-2"
        )}
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Facebook className="size-4" />
        )}
        {loading ? "Signing in..." : "Continue with Facebook"}
      </Button>
    </>
  );
}
