import type { Contact } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetricCard } from "@/components/dashboard/metric-card";
import { ContactTable } from "@/components/outreach/contact-table";
import { Plus } from "lucide-react";

const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Mela Cruz",
    email: "mela@example.com",
    phone: null,
    stage: "converted",
    source: "Lead Gen - Spring",
    avatar_url: null,
    created_at: "2025-02-26T00:00:00Z",
    updated_at: "2025-02-26T00:00:00Z",
  },
  {
    id: "2",
    name: "Vivian Torres",
    email: "vivian@example.com",
    phone: null,
    stage: "converted",
    source: "Lead Gen - Spring",
    avatar_url: null,
    created_at: "2025-02-26T00:00:00Z",
    updated_at: "2025-02-26T00:00:00Z",
  },
  {
    id: "3",
    name: "Adriana Acosta",
    email: "adriana@example.com",
    phone: null,
    stage: "qualified",
    source: "Retargeting",
    avatar_url: null,
    created_at: "2025-03-01T00:00:00Z",
    updated_at: "2025-03-01T00:00:00Z",
  },
  {
    id: "4",
    name: "Colleen Murphy",
    email: "colleen@example.com",
    phone: null,
    stage: "opportunity",
    source: "Retargeting",
    avatar_url: null,
    created_at: "2025-03-01T00:00:00Z",
    updated_at: "2025-03-01T00:00:00Z",
  },
  {
    id: "5",
    name: "Deborah Reyes",
    email: "deborah@example.com",
    phone: null,
    stage: "new_lead",
    source: "Lead Gen - Spring",
    avatar_url: null,
    created_at: "2025-03-08T00:00:00Z",
    updated_at: "2025-03-08T00:00:00Z",
  },
  {
    id: "6",
    name: "Jennifer Salas",
    email: "jennifer@example.com",
    phone: null,
    stage: "converted",
    source: "Lead Gen - Spring",
    avatar_url: null,
    created_at: "2025-03-08T00:00:00Z",
    updated_at: "2025-03-08T00:00:00Z",
  },
];

const oneWeekAgo = new Date("2025-03-06T00:00:00Z");

export default async function OutreachPage() {

  const newThisWeek = mockContacts.filter(
    (c) => new Date(c.created_at) >= oneWeekAgo
  ).length;
  const converted = mockContacts.filter((c) => c.stage === "converted").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Outreach</h1>
          <p className="mt-1 text-muted-foreground">
            Email & SMS your leads
          </p>
        </div>
        <Button>
          <Plus className="size-4" />
          Add Contact
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Contacts"
          value={String(mockContacts.length)}
        />
        <MetricCard
          title="New This Week"
          value={String(newThisWeek)}
        />
        <MetricCard
          title="Converted"
          value={String(converted)}
        />
        <MetricCard
          title="Avg Response Time"
          value="2.4h"
        />
      </div>

      <div className="space-y-4">
        <Tabs defaultValue="all">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Input
              type="search"
              placeholder="Search contacts..."
              className="max-w-sm"
            />
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="new_lead">New Lead</TabsTrigger>
              <TabsTrigger value="qualified">Qualified</TabsTrigger>
              <TabsTrigger value="opportunity">Opportunity</TabsTrigger>
              <TabsTrigger value="converted">Converted</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="all" className="mt-4">
            <div className="rounded-lg border">
              <ContactTable contacts={mockContacts} />
            </div>
          </TabsContent>
          <TabsContent value="new_lead" className="mt-4">
            <div className="rounded-lg border">
              <ContactTable
                contacts={mockContacts.filter((c) => c.stage === "new_lead")}
              />
            </div>
          </TabsContent>
          <TabsContent value="qualified" className="mt-4">
            <div className="rounded-lg border">
              <ContactTable
                contacts={mockContacts.filter((c) => c.stage === "qualified")}
              />
            </div>
          </TabsContent>
          <TabsContent value="opportunity" className="mt-4">
            <div className="rounded-lg border">
              <ContactTable
                contacts={mockContacts.filter((c) => c.stage === "opportunity")}
              />
            </div>
          </TabsContent>
          <TabsContent value="converted" className="mt-4">
            <div className="rounded-lg border">
              <ContactTable
                contacts={mockContacts.filter((c) => c.stage === "converted")}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
