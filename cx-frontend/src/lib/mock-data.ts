// Mock ticket dataset shared across dashboards.
export type TicketStatus = "Open" | "In Progress" | "Pending" | "Escalated" | "Resolved" | "Closed";
export type Priority = "Low" | "Medium" | "High" | "Critical";

export interface Ticket {
  id: string;
  user: string;
  department: string;
  priority: Priority;
  status: TicketStatus;
  subject: string;
  createdAt: string;
  hoursOpen: number;
}

export const departments = [
  "Technical Support",
  "Customer Support",
  "Operations",
  "Finance",
  "HR",
  "Compliance",
];

export const categories = [
  "Bug Report",
  "Feature Request",
  "Account Issue",
  "Billing",
  "General Inquiry",
];

export const priorities: Priority[] = ["Low", "Medium", "High", "Critical"];

export const tickets: Ticket[] = [
  { id: "TKT-1042", user: "Sarah Chen", department: "Technical Support", priority: "High", status: "In Progress", subject: "VPN connection drops intermittently", createdAt: "2025-06-01", hoursOpen: 4 },
  { id: "TKT-1043", user: "Marcus Lee", department: "Customer Support", priority: "Medium", status: "Open", subject: "Cannot reset password", createdAt: "2025-06-02", hoursOpen: 2 },
  { id: "TKT-1044", user: "Aisha Patel", department: "Finance", priority: "Critical", status: "Escalated", subject: "Invoice mismatch on enterprise plan", createdAt: "2025-06-02", hoursOpen: 9 },
  { id: "TKT-1045", user: "Diego Ramos", department: "Operations", priority: "Low", status: "Resolved", subject: "Request for new monitoring widget", createdAt: "2025-05-30", hoursOpen: 24 },
  { id: "TKT-1046", user: "Yuki Tanaka", department: "Compliance", priority: "High", status: "Pending", subject: "GDPR data export request", createdAt: "2025-06-03", hoursOpen: 6 },
  { id: "TKT-1047", user: "Olivia Brown", department: "HR", priority: "Medium", status: "Open", subject: "Employee onboarding access", createdAt: "2025-06-03", hoursOpen: 1 },
  { id: "TKT-1048", user: "Noah Wilson", department: "Technical Support", priority: "Critical", status: "Escalated", subject: "Production database latency spike", createdAt: "2025-06-04", hoursOpen: 8 },
  { id: "TKT-1049", user: "Liam Garcia", department: "Customer Support", priority: "Low", status: "Closed", subject: "How to export reports?", createdAt: "2025-05-28", hoursOpen: 48 },
  { id: "TKT-1050", user: "Emma Müller", department: "Operations", priority: "High", status: "In Progress", subject: "Server rack temperature alert", createdAt: "2025-06-04", hoursOpen: 3 },
  { id: "TKT-1051", user: "Ravi Kumar", department: "Technical Support", priority: "Medium", status: "Open", subject: "API rate limit clarification", createdAt: "2025-06-04", hoursOpen: 5 },
];

export const ticketTrend = [
  { day: "Mon", open: 12, resolved: 9 },
  { day: "Tue", open: 18, resolved: 14 },
  { day: "Wed", open: 15, resolved: 17 },
  { day: "Thu", open: 22, resolved: 20 },
  { day: "Fri", open: 28, resolved: 25 },
  { day: "Sat", open: 10, resolved: 13 },
  { day: "Sun", open: 8, resolved: 9 },
];

export const departmentPerf = departments.map((d, i) => ({
  name: d.split(" ")[0],
  tickets: 40 + i * 12,
  resolved: 30 + i * 9,
}));

export const monthlyPerf = [
  { month: "Jan", score: 78 },
  { month: "Feb", score: 82 },
  { month: "Mar", score: 80 },
  { month: "Apr", score: 88 },
  { month: "May", score: 91 },
  { month: "Jun", score: 94 },
];

export const avatars = [
  { id: "ai", label: "AI Avatar", emoji: "🤖" },
  { id: "engineer", label: "Support Engineer", emoji: "👨‍💻" },
  { id: "cyber", label: "Cybersecurity", emoji: "🛡️" },
  { id: "ops", label: "Operations", emoji: "⚙️" },
  { id: "analyst", label: "Technical Analyst", emoji: "📊" },
];
