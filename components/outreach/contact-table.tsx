"use client";

import { Mail } from "lucide-react";
import type { Contact } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

function getStageBadgeClassName(
  stage: Contact["stage"]
): string {
  switch (stage) {
    case "new_lead":
      return "bg-muted text-muted-foreground";
    case "qualified":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
    case "opportunity":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    case "converted":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    default:
      return "";
  }
}

function formatStage(stage: Contact["stage"]): string {
  return stage
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface ContactTableProps {
  contacts: Contact[];
}

export function ContactTable({ contacts }: ContactTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Contact</TableHead>
          <TableHead>Stage</TableHead>
          <TableHead>Source</TableHead>
          <TableHead>Date Added</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contacts.map((contact) => (
          <TableRow key={contact.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar size="sm">
                  {contact.avatar_url ? (
                    <AvatarImage src={contact.avatar_url} alt={contact.name} />
                  ) : null}
                  <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <span className="font-medium">{contact.name}</span>
                  {contact.email && (
                    <p className="text-xs text-muted-foreground">{contact.email}</p>
                  )}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={cn(getStageBadgeClassName(contact.stage))}
              >
                {formatStage(contact.stage)}
              </Badge>
            </TableCell>
            <TableCell>{contact.source ?? "—"}</TableCell>
            <TableCell>{formatDate(contact.created_at)}</TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <Button variant="ghost" size="sm">
                  View
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="size-4" />
                  Send
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
