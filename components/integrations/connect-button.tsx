"use client";

import { Button } from "@/components/ui/button";

interface ConnectButtonProps {
  connected: boolean;
  integrationName: string;
  onConnect?: () => void;
}

export function ConnectButton({
  connected,
  integrationName,
  onConnect,
}: ConnectButtonProps) {
  const handleClick = () => {
    if (onConnect) {
      onConnect();
    } else {
      console.log(
        connected ? `Disconnect ${integrationName}` : `Connect ${integrationName}`
      );
    }
  };

  if (connected) {
    return (
      <Button variant="outline" onClick={handleClick} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
        Disconnect
      </Button>
    );
  }

  return (
    <Button variant="default" onClick={handleClick}>
      Connect
    </Button>
  );
}
