import { LoginForm } from "@/components/auth/login-form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export default function LoginPage() {
  return (
    <Card className="w-full max-w-sm shadow-lg bg-white">
      <CardHeader className="text-center space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Signal</h1>
        <p className="text-sm text-muted-foreground">
          Connect your Facebook Ad Manager to get started
        </p>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
      <CardFooter className="flex flex-col gap-2 border-t border-border/50 bg-transparent pt-4">
        <p className="text-xs text-muted-foreground text-center">
          By continuing, you agree to our{" "}
          <a href="/terms" className="underline hover:text-foreground">
            Terms
          </a>{" "}
          and{" "}
          <a href="/privacy" className="underline hover:text-foreground">
            Privacy Policy
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}
