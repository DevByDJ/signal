import {
  Share2,
  Search,
  Building2,
  MessageSquare,
  Mail,
  Zap,
  CreditCard,
} from "lucide-react";
import { IntegrationCard } from "@/components/integrations/integration-card";

export default function IntegrationsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Integrations</h1>
        <p className="mt-1 text-muted-foreground">
          Connect your apps and tools
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Connected</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <IntegrationCard
            name="Facebook Ads"
            description="Access your Facebook Ad Manager campaigns, insights, and leads"
            icon={<Share2 className="size-5" />}
            connected={true}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Available Integrations</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <IntegrationCard
            name="Google Ads"
            description="Import campaigns and performance data from Google Ads"
            icon={<Search className="size-5" />}
            connected={false}
          />
          <IntegrationCard
            name="HubSpot"
            description="Sync contacts and deals with your HubSpot CRM"
            icon={<Building2 className="size-5" />}
            connected={false}
          />
          <IntegrationCard
            name="Slack"
            description="Get notifications and alerts in your Slack workspace"
            icon={<MessageSquare className="size-5" />}
            connected={false}
          />
          <IntegrationCard
            name="Mailchimp"
            description="Sync your leads to email marketing campaigns"
            icon={<Mail className="size-5" />}
            connected={false}
          />
          <IntegrationCard
            name="Zapier"
            description="Connect Signal with 5000+ apps via Zapier"
            icon={<Zap className="size-5" />}
            connected={false}
          />
          <IntegrationCard
            name="Stripe"
            description="Track revenue and payment data from your campaigns"
            icon={<CreditCard className="size-5" />}
            connected={false}
          />
        </div>
      </section>
    </div>
  );
}
