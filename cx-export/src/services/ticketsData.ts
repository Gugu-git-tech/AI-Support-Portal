export type Priority = "Low" | "Medium" | "High";
export type TicketStatus = "Open" | "In Progress" | "Resolved";
export type Department =
  | "Engineering"
  | "Sales"
  | "Marketing"
  | "Finance"
  | "HR"
  | "Customer Success"
  | "Operations";
export type RequestType =
  | "Bug Report"
  | "Feature Request"
  | "Account Issue"
  | "Billing"
  | "Integration"
  | "General Inquiry";

export interface TicketRequest {
  fullName: string;
  email: string;
  department: Department;
  requestType: RequestType;
  priority: Priority;
  description: string;
  fileName?: string;
}

export interface Ticket {
  id: string;
  fullName: string;
  email: string;
  category: Department;
  requestType: RequestType;
  priority: Priority;
  status: TicketStatus;
  createdAt: string;
  rawInput: string;
  validatedJson: Record<string, unknown>;
}

export const departments: Department[] = [
  "Engineering",
  "Sales",
  "Marketing",
  "Finance",
  "HR",
  "Customer Success",
  "Operations",
];

export const requestTypes: RequestType[] = [
  "Bug Report",
  "Feature Request",
  "Account Issue",
  "Billing",
  "Integration",
  "General Inquiry",
];

export const priorities: Priority[] = ["Low", "Medium", "High"];
export const statuses: TicketStatus[] = ["Open", "In Progress", "Resolved"];

export const mockTickets: Ticket[] = [
  {
    id: "TCK-2041",
    fullName: "Priya Shah",
    email: "priya.shah@northwind.io",
    category: "Engineering",
    requestType: "Bug Report",
    priority: "High",
    status: "Open",
    createdAt: "2026-06-02T08:42:00Z",
    rawInput:
      "hey team — zendesk sync broke again this morning, tickets from EU region not flowing into the bpo queue. urgent — exec demo at 3pm.",
    validatedJson: {
      ticket_id: "TCK-2041",
      intent: "integration_failure",
      product_area: "zendesk_sync",
      region: "EU",
      severity: "high",
      sla_breach_risk: true,
      suggested_owner: "engineering.integrations",
    },
  },
  {
    id: "TCK-2038",
    fullName: "Marcus Lee",
    email: "marcus@helix-labs.com",
    category: "Customer Success",
    requestType: "Account Issue",
    priority: "Medium",
    status: "In Progress",
    createdAt: "2026-06-02T07:18:00Z",
    rawInput:
      "our CSM left and nobody can access the workspace dashboard. need ownership transferred to me asap pls",
    validatedJson: {
      ticket_id: "TCK-2038",
      intent: "ownership_transfer",
      product_area: "workspace_admin",
      severity: "medium",
      suggested_owner: "customer_success.ops",
    },
  },
  {
    id: "TCK-2035",
    fullName: "Hannah Becker",
    email: "hbecker@orbital.de",
    category: "Finance",
    requestType: "Billing",
    priority: "Low",
    status: "Resolved",
    createdAt: "2026-06-01T21:02:00Z",
    rawInput: "invoice #4421 has wrong VAT, please reissue.",
    validatedJson: {
      ticket_id: "TCK-2035",
      intent: "invoice_correction",
      invoice_id: "4421",
      issue: "vat_mismatch",
      severity: "low",
    },
  },
  {
    id: "TCK-2030",
    fullName: "Diego Alvarez",
    email: "diego@solstice.mx",
    category: "Sales",
    requestType: "Feature Request",
    priority: "Medium",
    status: "Open",
    createdAt: "2026-06-01T16:45:00Z",
    rawInput:
      "would love a way to export pipeline data to bigquery without zapier in the middle",
    validatedJson: {
      ticket_id: "TCK-2030",
      intent: "feature_request",
      product_area: "data_export",
      target_integration: "bigquery",
      severity: "medium",
    },
  },
  {
    id: "TCK-2027",
    fullName: "Sara N'Diaye",
    email: "sara@flux.fr",
    category: "Marketing",
    requestType: "General Inquiry",
    priority: "Low",
    status: "Resolved",
    createdAt: "2026-06-01T11:30:00Z",
    rawInput: "how do i change the sender domain for campaign emails?",
    validatedJson: {
      ticket_id: "TCK-2027",
      intent: "how_to",
      product_area: "email_sender_domain",
      severity: "low",
    },
  },
  {
    id: "TCK-2024",
    fullName: "Tomáš Novák",
    email: "tomas@apex-cz.com",
    category: "Operations",
    requestType: "Integration",
    priority: "High",
    status: "In Progress",
    createdAt: "2026-06-01T09:12:00Z",
    rawInput:
      "webhook retries are hammering our endpoint — getting 30 requests/sec when one should be enough. please rate limit",
    validatedJson: {
      ticket_id: "TCK-2024",
      intent: "rate_limit_request",
      product_area: "webhooks",
      observed_rps: 30,
      severity: "high",
    },
  },
  {
    id: "TCK-2019",
    fullName: "Yuki Tanaka",
    email: "yuki.t@kanso.jp",
    category: "HR",
    requestType: "Account Issue",
    priority: "Medium",
    status: "Open",
    createdAt: "2026-05-31T22:58:00Z",
    rawInput: "sso via okta keeps logging me out every 15 mins. should be 8h.",
    validatedJson: {
      ticket_id: "TCK-2019",
      intent: "sso_session_misconfig",
      provider: "okta",
      expected_ttl_hours: 8,
      severity: "medium",
    },
  },
];