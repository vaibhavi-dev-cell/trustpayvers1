// ─── ENUMS ──────────────────────────────────────────

export type UserRole = 'OWNER' | 'COMPLIANCE_OFFICER' | 'AUDITOR' | 'VIEWER'
export type FrameworkStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'READY_FOR_AUDIT' | 'CERTIFIED'
export type PolicyStatus = 'DRAFT' | 'AI_GENERATED' | 'UNDER_REVIEW' | 'APPROVED' | 'ARCHIVED'
export type EvidenceType = 'CLOUDTRAIL_LOG' | 'CONFIG_SNAPSHOT' | 'SECURITY_HUB_FINDING' | 'MANUAL_UPLOAD' | 'POLICY_DOCUMENT' | 'SCREENSHOT'
export type EvidenceStatus = 'COLLECTED' | 'ANCHORED' | 'VERIFIED'
export type ControlStatus = 'NOT_IMPLEMENTED' | 'PARTIAL' | 'IMPLEMENTED' | 'COMPENSATING' | 'NOT_APPLICABLE'
export type AlertSeverity = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type ScanStatus = 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED'
export type RegChangeImpact = 'NONE' | 'MONITOR' | 'ACTION_REQUIRED' | 'URGENT'

// ─── MODELS ─────────────────────────────────────────

export interface Organization {
  id: string
  name: string
  slug: string
  industry: string | null
  size: string | null
  awsAccountId: string | null
  awsRegion: string
  settings: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  organizationId: string
  lastLoginAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface ComplianceFramework {
  id: string
  name: string
  displayName: string
  version: string
  description: string
  controls?: Control[]
}

export interface OrganizationFramework {
  id: string
  organizationId: string
  frameworkId: string
  framework?: ComplianceFramework
  status: FrameworkStatus
  targetDate: Date | null
  score: number
  createdAt: Date
  updatedAt: Date
  controlStatuses?: ControlStatusRecord[]
}

export interface Control {
  id: string
  frameworkId: string
  controlId: string
  title: string
  description: string
  category: string
  autoCollectable: boolean
  awsConfigRules: string[]
}

export interface ControlStatusRecord {
  id: string
  orgFrameworkId: string
  controlId: string
  control?: Control
  status: ControlStatus
  notes: string | null
  lastAssessedAt: Date | null
  updatedAt: Date
}

export interface InfrastructureScan {
  id: string
  organizationId: string
  status: ScanStatus
  startedAt: Date | null
  completedAt: Date | null
  findingsCount: number
  criticalCount: number
  rawFindings: ScanFinding[]
  summary: string | null
  createdAt: Date
}

export interface ScanFinding {
  service: string
  resource: string
  finding: string
  severity: AlertSeverity
  remediation: string
}

export interface Policy {
  id: string
  organizationId: string
  title: string
  framework: string
  category: string
  status: PolicyStatus
  content: string
  version: number
  aiGenerated: boolean
  aiPromptUsed: string | null
  approvedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface Evidence {
  id: string
  organizationId: string
  controlId: string | null
  policyId: string | null
  type: EvidenceType
  status: EvidenceStatus
  title: string
  description: string | null
  contentHash: string
  fileUrl: string | null
  rawData: Record<string, unknown>
  blockchainTx: string | null
  blockchainBlock: number | null
  collectedAt: Date
  anchoredAt: Date | null
}

export interface RegulatoryChange {
  id: string
  title: string
  source: string
  url: string | null
  jurisdiction: string
  frameworks: string[]
  publishedAt: Date
  summary: string
  impact: RegChangeImpact
  actionItems: ActionItem[]
  createdAt: Date
}

export interface ActionItem {
  action: string
  effort: string
  owner: string
  priority: number
}

export interface Alert {
  id: string
  organizationId: string
  title: string
  message: string
  severity: AlertSeverity
  type: string
  metadata: Record<string, unknown>
  isRead: boolean
  isResolved: boolean
  createdAt: Date
}

export interface Report {
  id: string
  organizationId: string
  generatedById: string
  title: string
  framework: string
  type: string
  dateFrom: Date
  dateTo: Date
  fileUrl: string | null
  status: string
  data: Record<string, unknown>
  createdAt: Date
}

export interface AuditLog {
  id: string
  userId: string | null
  action: string
  entityType: string
  entityId: string
  before: Record<string, unknown> | null
  after: Record<string, unknown> | null
  metadata: Record<string, unknown>
  ipAddress: string | null
  createdAt: Date
}

// ─── UI TYPES ───────────────────────────────────────

export interface NavItem {
  title: string
  href: string
  icon: string
  badge?: number
}

export interface KPIData {
  label: string
  value: number
  change: number
  changeLabel: string
  format: 'number' | 'percent' | 'currency'
}

export interface ChartDataPoint {
  name: string
  value: number
  fill?: string
}
