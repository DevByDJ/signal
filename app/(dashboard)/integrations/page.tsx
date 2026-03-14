"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { IconChevronRight, IconSearch } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import { MetaConnectButton } from "@/components/integrations/meta-connect-button"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Integration {
  id: string
  name: string
  description: string
  /** Initials or short label shown in the icon placeholder */
  iconLabel: string
  iconBg: string
  category: string
  functional: boolean
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const INTEGRATIONS: Integration[] = [
  // Ads & Analytics
  {
    id: "meta-ads",
    name: "Meta Ads",
    description: "Facebook & Instagram ad performance",
    iconLabel: "f",
    iconBg: "bg-blue-600",
    category: "ADS & ANALYTICS",
    functional: true,
  },
  {
    id: "google-ads",
    name: "Google Ads",
    description: "Search, display & YouTube campaigns",
    iconLabel: "G",
    iconBg: "bg-white border border-border",
    category: "ADS & ANALYTICS",
    functional: false,
  },
  {
    id: "tiktok-ads",
    name: "TikTok Ads",
    description: "Short-form video advertising",
    iconLabel: "T",
    iconBg: "bg-black",
    category: "ADS & ANALYTICS",
    functional: false,
  },
  // Social Media
  {
    id: "instagram",
    name: "Instagram",
    description: "Post scheduling & analytics",
    iconLabel: "I",
    iconBg: "bg-gradient-to-br from-purple-500 to-pink-500",
    category: "SOCIAL MEDIA",
    functional: false,
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    description: "B2B social & lead gen",
    iconLabel: "L",
    iconBg: "bg-blue-700",
    category: "SOCIAL MEDIA",
    functional: false,
  },
  // Email
  {
    id: "sendgrid",
    name: "SendGrid",
    description: "Transactional & marketing email at scale",
    iconLabel: "S",
    iconBg: "bg-sky-500",
    category: "EMAIL",
    functional: false,
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    description: "Email marketing & audience management",
    iconLabel: "M",
    iconBg: "bg-yellow-400",
    category: "EMAIL",
    functional: false,
  },
  // SMS & Phone
  {
    id: "twilio",
    name: "Twilio",
    description: "SMS, voice calls & WhatsApp messaging",
    iconLabel: "T",
    iconBg: "bg-red-500",
    category: "SMS & PHONE",
    functional: false,
  },
  {
    id: "openphone",
    name: "OpenPhone",
    description: "Business phone with shared inbox",
    iconLabel: "O",
    iconBg: "bg-violet-500",
    category: "SMS & PHONE",
    functional: false,
  },
  // CRM & Automation
  {
    id: "zapier",
    name: "Zapier",
    description: "Automate workflows with 5,000+ apps",
    iconLabel: "Z",
    iconBg: "bg-orange-500",
    category: "CRM & AUTOMATION",
    functional: false,
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "CRM, marketing & sales platform",
    iconLabel: "HS",
    iconBg: "bg-orange-600",
    category: "CRM & AUTOMATION",
    functional: false,
  },
  {
    id: "gohighlevel",
    name: "GoHighLevel",
    description: "All-in-one marketing & CRM platform",
    iconLabel: "G",
    iconBg: "bg-emerald-600",
    category: "CRM & AUTOMATION",
    functional: false,
  },
  // Payments
  {
    id: "stripe",
    name: "Stripe",
    description: "Online payments & subscriptions",
    iconLabel: "S",
    iconBg: "bg-indigo-600",
    category: "PAYMENTS",
    functional: false,
  },
  {
    id: "square",
    name: "Square",
    description: "Point-of-sale & payment processing",
    iconLabel: "Sq",
    iconBg: "bg-black",
    category: "PAYMENTS",
    functional: false,
  },
]

const CATEGORY_ORDER = [
  "ADS & ANALYTICS",
  "SOCIAL MEDIA",
  "EMAIL",
  "SMS & PHONE",
  "CRM & AUTOMATION",
  "PAYMENTS",
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function IntegrationIcon({ integration }: { integration: Integration }) {
  return (
    <div
      className={`flex size-10 shrink-0 items-center justify-center rounded-lg text-white text-sm font-bold ${integration.iconBg}`}
    >
      {integration.iconLabel}
    </div>
  )
}

function PlaceholderConnectButton() {
  return (
    <button
      disabled
      className="flex items-center gap-0.5 text-sm text-muted-foreground opacity-50 cursor-not-allowed"
    >
      Connect <IconChevronRight className="size-3.5" />
    </button>
  )
}

function IntegrationRow({
  integration,
  isConnected,
}: {
  integration: Integration
  isConnected: boolean
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
      <IntegrationIcon integration={integration} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{integration.name}</span>
          {isConnected && (
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-500">
              <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
              Connected
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{integration.description}</p>
      </div>
      <div className="shrink-0">
        {integration.functional ? (
          <MetaConnectButton />
        ) : (
          <PlaceholderConnectButton />
        )}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function IntegrationsPage() {
  const { data: session } = useSession()
  const [search, setSearch] = useState("")

  const isMetaConnected = !!session?.accessToken

  const activeIntegrations = INTEGRATIONS.filter(
    (i) => i.functional && isMetaConnected
  )

  const filtered = INTEGRATIONS.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase())
  )

  const byCategory = CATEGORY_ORDER.reduce<Record<string, Integration[]>>(
    (acc, cat) => {
      acc[cat] = filtered.filter((i) => i.category === cat)
      return acc
    },
    {}
  )

  return (
    <div className="flex flex-col gap-6 py-4 px-4 md:py-6 lg:px-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Integrations</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Connect your tools in minutes — no technical knowledge required.
          </p>
        </div>
        {activeIntegrations.length > 0 && (
          <span className="text-sm font-medium text-emerald-500">
            {activeIntegrations.length} active
          </span>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search integrations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Active section */}
      {activeIntegrations.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Active
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {activeIntegrations.map((integration) => (
              <IntegrationRow
                key={integration.id}
                integration={integration}
                isConnected={true}
              />
            ))}
          </div>
        </section>
      )}

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Available
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Category sections */}
      {CATEGORY_ORDER.map((category) => {
        const items = byCategory[category]
        if (!items || items.length === 0) return null
        return (
          <section key={category} className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {category}
            </h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {items.map((integration) => (
                <IntegrationRow
                  key={integration.id}
                  integration={integration}
                  isConnected={integration.functional && isMetaConnected}
                />
              ))}
            </div>
          </section>
        )
      })}

      {/* Empty search state */}
      {filtered.length === 0 && (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No integrations match &ldquo;{search}&rdquo;
        </p>
      )}
    </div>
  )
}
