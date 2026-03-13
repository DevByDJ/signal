import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConnectButton } from "./connect-button";

export interface IntegrationCardProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  connected: boolean;
  onConnect?: () => void;
}

export function IntegrationCard({
  name,
  description,
  icon,
  connected,
  onConnect,
}: IntegrationCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            {icon}
          </div>
          <div>
            <CardTitle>{name}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
        {connected && (
          <Badge
            variant="outline"
            className="shrink-0 border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          >
            Connected
          </Badge>
        )}
      </CardHeader>
      <CardFooter>
        <ConnectButton
          connected={connected}
          integrationName={name}
          onConnect={onConnect}
        />
      </CardFooter>
    </Card>
  );
}
