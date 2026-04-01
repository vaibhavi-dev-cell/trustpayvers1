import type {
  Organization, User, ComplianceFramework, OrganizationFramework,
  Control, ControlStatusRecord, InfrastructureScan, Policy, Evidence,
  RegulatoryChange, Alert, Report, ScanFinding, ControlStatus,
  EvidenceType, EvidenceStatus, AlertSeverity, PolicyStatus, RegChangeImpact
} from '@/types'

// ─── ORGANIZATION ───────────────────────────────────

const demoOrg: Organization = {
  id: 'org_demo_001',
  name: 'Acme Corp',
  slug: 'acme-corp',
  industry: 'Technology',
  size: 'smb',
  awsAccountId: '123456789012',
  awsRegion: 'us-east-1',
  settings: {},
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-12-01'),
}

// ─── USERS ──────────────────────────────────────────

const demoUsers: User[] = [
  { id: 'usr_001', email: 'demo@aegis.dev', name: 'Sarah Chen', role: 'OWNER', organizationId: 'org_demo_001', lastLoginAt: new Date(), createdAt: new Date('2024-01-15'), updatedAt: new Date() },
  { id: 'usr_002', email: 'compliance@aegis.dev', name: 'James Wilson', role: 'COMPLIANCE_OFFICER', organizationId: 'org_demo_001', lastLoginAt: new Date('2024-11-28'), createdAt: new Date('2024-02-01'), updatedAt: new Date() },
  { id: 'usr_003', email: 'auditor@aegis.dev', name: 'Maya Patel', role: 'AUDITOR', organizationId: 'org_demo_001', lastLoginAt: new Date('2024-11-25'), createdAt: new Date('2024-03-10'), updatedAt: new Date() },
]

// ─── FRAMEWORKS ─────────────────────────────────────

const demoFrameworks: ComplianceFramework[] = [
  { id: 'fw_soc2', name: 'SOC2', displayName: 'SOC 2 Type II', version: '2024', description: 'Service Organization Control 2 — Trust Services Criteria for security, availability, processing integrity, confidentiality, and privacy.' },
  { id: 'fw_iso27001', name: 'ISO27001', displayName: 'ISO 27001:2022', version: '2022', description: 'International standard for information security management systems (ISMS).' },
  { id: 'fw_gdpr', name: 'GDPR', displayName: 'GDPR', version: '2018', description: 'General Data Protection Regulation — EU data privacy and protection regulation.' },
  { id: 'fw_pci', name: 'PCI_DSS', displayName: 'PCI DSS v4.0', version: '4.0', description: 'Payment Card Industry Data Security Standard for organizations handling card data.' },
  { id: 'fw_hipaa', name: 'HIPAA', displayName: 'HIPAA', version: '2013', description: 'Health Insurance Portability and Accountability Act — US healthcare data protection.' },
]

// ─── CONTROLS ───────────────────────────────────────

const controlCategories = ['Access Control', 'Data Protection', 'Network Security', 'Incident Response', 'Change Management', 'Risk Assessment', 'Monitoring & Logging', 'Vendor Management']

function generateControls(frameworkId: string, prefix: string, count: number): Control[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `ctrl_${frameworkId}_${i}`,
    frameworkId,
    controlId: `${prefix}.${Math.floor(i / 5) + 1}.${(i % 5) + 1}`,
    title: `${controlCategories[i % controlCategories.length]} - Requirement ${i + 1}`,
    description: `Control requirement for ${controlCategories[i % controlCategories.length].toLowerCase()} ensuring organizational compliance with ${prefix} standards.`,
    category: controlCategories[i % controlCategories.length] as string,
    autoCollectable: i % 3 === 0,
    awsConfigRules: i % 3 === 0 ? [`${prefix.toLowerCase()}-rule-${i}`] : [],
  }))
}

const allControls: Control[] = [
  ...generateControls('fw_soc2', 'CC', 35),
  ...generateControls('fw_iso27001', 'A', 40),
  ...generateControls('fw_gdpr', 'Art', 25),
  ...generateControls('fw_pci', 'Req', 30),
]

// ─── ORG FRAMEWORKS ─────────────────────────────────

const demoOrgFrameworks: OrganizationFramework[] = [
  { id: 'of_1', organizationId: 'org_demo_001', frameworkId: 'fw_soc2', framework: demoFrameworks[0], status: 'IN_PROGRESS', targetDate: new Date('2025-06-30'), score: 72, createdAt: new Date('2024-02-01'), updatedAt: new Date() },
  { id: 'of_2', organizationId: 'org_demo_001', frameworkId: 'fw_iso27001', framework: demoFrameworks[1], status: 'IN_PROGRESS', targetDate: new Date('2025-09-30'), score: 58, createdAt: new Date('2024-03-15'), updatedAt: new Date() },
  { id: 'of_3', organizationId: 'org_demo_001', frameworkId: 'fw_gdpr', framework: demoFrameworks[2], status: 'READY_FOR_AUDIT', targetDate: new Date('2025-03-31'), score: 89, createdAt: new Date('2024-01-20'), updatedAt: new Date() },
  { id: 'of_4', organizationId: 'org_demo_001', frameworkId: 'fw_pci', framework: demoFrameworks[3], status: 'NOT_STARTED', targetDate: new Date('2025-12-31'), score: 24, createdAt: new Date('2024-06-01'), updatedAt: new Date() },
]

// ─── CONTROL STATUSES ───────────────────────────────

function generateControlStatuses(): ControlStatusRecord[] {
  const statuses: ControlStatus[] = ['IMPLEMENTED', 'PARTIAL', 'NOT_IMPLEMENTED', 'COMPENSATING', 'NOT_APPLICABLE']
  const records: ControlStatusRecord[] = []
  
  demoOrgFrameworks.forEach((of) => {
    const controls = allControls.filter(c => c.frameworkId === of.frameworkId)
    controls.forEach((ctrl, i) => {
      const statusWeights = of.score > 70 ? [0.5, 0.25, 0.1, 0.1, 0.05] : of.score > 40 ? [0.2, 0.3, 0.3, 0.1, 0.1] : [0.05, 0.15, 0.6, 0.1, 0.1]
      let rand = Math.random(), cumulative = 0, statusIdx = 0
      for (let j = 0; j < statusWeights.length; j++) {
        cumulative += statusWeights[j] as number
        if (rand <= cumulative) { statusIdx = j; break }
      }
      records.push({
        id: `cs_${of.id}_${i}`,
        orgFrameworkId: of.id,
        controlId: ctrl.id,
        control: ctrl,
        status: statuses[statusIdx] as ControlStatus,
        notes: statusIdx === 2 ? 'Needs implementation — see remediation guide' : null,
        lastAssessedAt: new Date(Date.now() - Math.random() * 30 * 86400000),
        updatedAt: new Date(),
      })
    })
  })
  return records
}

// ─── SCANS ──────────────────────────────────────────

const scanFindings: ScanFinding[] = [
  { service: 'IAM', resource: 'root-account', finding: 'Root account MFA not enabled', severity: 'CRITICAL', remediation: 'Enable MFA on the root account immediately via IAM console → Security credentials → Assign MFA device.' },
  { service: 'S3', resource: 'acme-data-backup', finding: 'S3 bucket has public read access', severity: 'HIGH', remediation: 'Remove public access by updating the bucket policy and enabling S3 Block Public Access settings.' },
  { service: 'EC2', resource: 'sg-0a1b2c3d4e', finding: 'Security group allows SSH (port 22) from 0.0.0.0/0', severity: 'HIGH', remediation: 'Restrict SSH access to known IP ranges or use AWS Systems Manager Session Manager instead.' },
  { service: 'RDS', resource: 'acme-prod-db', finding: 'RDS instance storage not encrypted', severity: 'MEDIUM', remediation: 'Enable encryption at rest — requires creating an encrypted snapshot and restoring from it.' },
  { service: 'CloudTrail', resource: 'management-trail', finding: 'CloudTrail log file validation disabled', severity: 'MEDIUM', remediation: 'Enable log file integrity validation in CloudTrail trail configuration.' },
  { service: 'IAM', resource: 'dev-team-policy', finding: 'IAM policy grants full admin access (*:*)', severity: 'HIGH', remediation: 'Apply least privilege principle — scope permissions to specific services and actions needed.' },
  { service: 'S3', resource: 'acme-logs-2024', finding: 'S3 bucket versioning not enabled', severity: 'LOW', remediation: 'Enable versioning to protect against accidental deletion and overwrites.' },
  { service: 'EC2', resource: 'i-0abc123def', finding: 'EC2 instance has no IAM role attached (uses access keys)', severity: 'MEDIUM', remediation: 'Attach an IAM role to the instance and remove embedded access keys from the application.' },
  { service: 'KMS', resource: 'alias/acme-main', finding: 'KMS key rotation not enabled', severity: 'LOW', remediation: 'Enable automatic key rotation in KMS console — rotates annually with no downtime.' },
  { service: 'SecurityHub', resource: 'standards', finding: '23 failed CIS Benchmark checks', severity: 'HIGH', remediation: 'Review AWS Security Hub CIS findings and remediate critical items first — start with IAM and logging controls.' },
  { service: 'Config', resource: 'rules', finding: '8 non-compliant AWS Config rules detected', severity: 'MEDIUM', remediation: 'Review non-compliant Config rules and remediate underlying resource configurations.' },
  { service: 'S3', resource: 'acme-user-uploads', finding: 'Server-side encryption not default', severity: 'MEDIUM', remediation: 'Enable default encryption (AES-256 or KMS) on the S3 bucket properties.' },
]

const demoScans: InfrastructureScan[] = [
  { id: 'scan_001', organizationId: 'org_demo_001', status: 'COMPLETED', startedAt: new Date(Date.now() - 3600000), completedAt: new Date(Date.now() - 3000000), findingsCount: 12, criticalCount: 1, rawFindings: scanFindings, summary: 'Infrastructure scan completed. Found 12 findings across 6 AWS services. 1 critical issue (root MFA), 4 high-severity items requiring immediate attention (public S3, open SSH, admin IAM, CIS failures), and 7 medium/low items for remediation planning.', createdAt: new Date(Date.now() - 3600000) },
  { id: 'scan_002', organizationId: 'org_demo_001', status: 'COMPLETED', startedAt: new Date(Date.now() - 7 * 86400000), completedAt: new Date(Date.now() - 7 * 86400000 + 600000), findingsCount: 15, criticalCount: 2, rawFindings: scanFindings, summary: 'Previous weekly scan found 15 findings. 2 critical issues resolved since this scan.', createdAt: new Date(Date.now() - 7 * 86400000) },
]

// ─── POLICIES ───────────────────────────────────────

const demoPolicies: Policy[] = [
  { id: 'pol_001', organizationId: 'org_demo_001', title: 'Access Control Policy', framework: 'SOC2', category: 'access_control', status: 'APPROVED', content: '# Access Control Policy\n\n## 1. Purpose\nThis policy establishes requirements for controlling access to Acme Corp information systems and data assets.\n\n## 2. Scope\nThis policy applies to all employees, contractors, and third-party users who access Acme Corp systems.\n\n## 3. Policy Statements\n\n### 3.1 Authentication\n- All users must authenticate using unique credentials\n- Multi-factor authentication (MFA) is required for all privileged accounts\n- MFA is required for remote access to production systems\n- Password requirements: minimum 14 characters, complexity enforced\n\n### 3.2 Authorization\n- Access follows the principle of least privilege\n- Role-based access control (RBAC) is implemented across all systems\n- Access reviews conducted quarterly by department managers\n- Privileged access requires approval from Security team\n\n### 3.3 Account Management\n- Accounts disabled within 24 hours of termination\n- Service accounts require documented business justification\n- Shared accounts are prohibited\n- Dormant accounts (90+ days inactive) are automatically disabled\n\n## 4. Procedures\n- New access requests submitted via ServiceNow\n- Emergency access logged and reviewed within 48 hours\n- Quarterly access certification campaigns\n\n## 5. Violations\nViolations of this policy may result in disciplinary action up to and including termination.\n\n## 6. Review\nThis policy is reviewed annually and updated as needed.', version: 2, aiGenerated: true, aiPromptUsed: 'Generate SOC2 access control policy for a technology SMB', approvedAt: new Date('2024-10-15'), createdAt: new Date('2024-09-01'), updatedAt: new Date('2024-10-15') },
  { id: 'pol_002', organizationId: 'org_demo_001', title: 'Data Protection Policy', framework: 'GDPR', category: 'data_protection', status: 'APPROVED', content: '# Data Protection Policy\n\n## 1. Purpose\nTo ensure Acme Corp processes personal data in compliance with GDPR and applicable data protection laws.\n\n## 2. Data Processing Principles\n- Lawfulness, fairness, and transparency\n- Purpose limitation\n- Data minimization\n- Accuracy\n- Storage limitation\n- Integrity and confidentiality\n- Accountability\n\n## 3. Data Subject Rights\n- Right to access (Art. 15)\n- Right to rectification (Art. 16)\n- Right to erasure (Art. 17)\n- Right to data portability (Art. 20)\n- Right to object (Art. 21)\n\n## 4. Data Breach Procedures\n- Breaches reported to DPO within 4 hours of discovery\n- Supervisory authority notified within 72 hours if risk to rights\n- Data subjects notified without undue delay if high risk\n\n## 5. Review\nAnnual review by Data Protection Officer.', version: 1, aiGenerated: true, aiPromptUsed: 'Generate GDPR data protection policy', approvedAt: new Date('2024-11-01'), createdAt: new Date('2024-10-01'), updatedAt: new Date('2024-11-01') },
  { id: 'pol_003', organizationId: 'org_demo_001', title: 'Incident Response Plan', framework: 'SOC2', category: 'incident_response', status: 'UNDER_REVIEW', content: '# Incident Response Plan\n\n## 1. Purpose\nDefine procedures for identifying, responding to, and recovering from security incidents.\n\n## 2. Incident Classification\n- **P1 Critical**: Data breach, system compromise, ransomware\n- **P2 High**: Unauthorized access attempt, DDoS attack\n- **P3 Medium**: Policy violation, suspicious activity\n- **P4 Low**: Failed login attempts, phishing email received\n\n## 3. Response Procedures\n### Detection & Analysis\n1. Alert triggered via monitoring systems\n2. On-call engineer performs initial triage\n3. Incident classified by severity\n\n### Containment\n1. Isolate affected systems\n2. Preserve evidence\n3. Implement temporary fixes\n\n### Recovery\n1. Restore from clean backups\n2. Patch vulnerabilities\n3. Verify system integrity\n\n### Post-Incident\n1. Conduct retrospective within 5 business days\n2. Update runbooks and procedures\n3. Report to management and stakeholders', version: 1, aiGenerated: false, aiPromptUsed: null, approvedAt: null, createdAt: new Date('2024-11-15'), updatedAt: new Date('2024-11-20') },
  { id: 'pol_004', organizationId: 'org_demo_001', title: 'Vendor Risk Management Policy', framework: 'ISO27001', category: 'vendor_management', status: 'DRAFT', content: '# Vendor Risk Management Policy\n\n## Draft — Under Development\n\nThis policy will establish requirements for assessing and managing risks associated with third-party vendors and service providers.', version: 1, aiGenerated: false, aiPromptUsed: null, approvedAt: null, createdAt: new Date('2024-12-01'), updatedAt: new Date('2024-12-01') },
  { id: 'pol_005', organizationId: 'org_demo_001', title: 'Encryption & Key Management Policy', framework: 'PCI_DSS', category: 'data_protection', status: 'AI_GENERATED', content: '# Encryption & Key Management Policy\n\n## 1. Purpose\nEstablish standards for cryptographic controls and key management to protect cardholder data.\n\n## 2. Encryption Standards\n- AES-256 for data at rest\n- TLS 1.3 for data in transit\n- RSA-2048 minimum for asymmetric encryption\n\n## 3. Key Management\n- Keys rotated annually at minimum\n- Split knowledge and dual control for master keys\n- Key ceremonies documented and witnessed\n- Hardware Security Modules (HSM) for production keys\n\n## 4. Certificate Management\n- Certificates tracked in central inventory\n- 90-day renewal reminder alerts\n- No self-signed certificates in production', version: 1, aiGenerated: true, aiPromptUsed: 'Generate PCI DSS encryption and key management policy', approvedAt: null, createdAt: new Date('2024-12-10'), updatedAt: new Date('2024-12-10') },
]

// ─── EVIDENCE ───────────────────────────────────────

function generateEvidence(): Evidence[] {
  const types: EvidenceType[] = ['CLOUDTRAIL_LOG', 'CONFIG_SNAPSHOT', 'SECURITY_HUB_FINDING', 'MANUAL_UPLOAD', 'POLICY_DOCUMENT']
  const statuses: EvidenceStatus[] = ['COLLECTED', 'ANCHORED', 'VERIFIED']
  const items: Evidence[] = []
  
  const evidenceTemplates = [
    { title: 'IAM Access Review Q4 2024', desc: 'Quarterly access review for all IAM users and roles' },
    { title: 'CloudTrail Logging Verification', desc: 'Evidence that CloudTrail is enabled across all regions' },
    { title: 'S3 Encryption Configuration', desc: 'S3 bucket encryption settings for all production buckets' },
    { title: 'MFA Enforcement Status', desc: 'IAM policy enforcing MFA for all console users' },
    { title: 'Security Group Audit', desc: 'Review of all security groups for overly permissive rules' },
    { title: 'RDS Backup Verification', desc: 'Automated daily backups confirmed for all RDS instances' },
    { title: 'VPC Flow Logs Enabled', desc: 'Network flow logging active on all VPCs' },
    { title: 'KMS Key Rotation Status', desc: 'Annual key rotation enabled on all customer-managed keys' },
    { title: 'Config Rules Compliance', desc: 'AWS Config compliance assessment results' },
    { title: 'GuardDuty Findings Review', desc: 'Monthly review of GuardDuty threat detection findings' },
  ]

  for (let i = 0; i < 50; i++) {
    const tmpl = evidenceTemplates[i % evidenceTemplates.length]!
    const type = types[i % types.length] as EvidenceType
    const status = statuses[Math.min(Math.floor(i / 18), 2)] as EvidenceStatus
    const hash = Array.from({ length: 64 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('')
    
    items.push({
      id: `ev_${String(i).padStart(3, '0')}`,
      organizationId: 'org_demo_001',
      controlId: allControls[i % allControls.length]?.id ?? null,
      policyId: i % 10 === 0 ? demoPolicies[i % demoPolicies.length]?.id ?? null : null,
      type,
      status,
      title: `${tmpl.title}${i > 9 ? ` — Instance ${i}` : ''}`,
      description: tmpl.desc,
      contentHash: hash,
      fileUrl: null,
      rawData: { source: 'aws-config', timestamp: new Date(Date.now() - i * 86400000).toISOString() },
      blockchainTx: status !== 'COLLECTED' ? `0x${hash.slice(0, 64)}` : null,
      blockchainBlock: status !== 'COLLECTED' ? 45000000 + i : null,
      collectedAt: new Date(Date.now() - i * 86400000),
      anchoredAt: status !== 'COLLECTED' ? new Date(Date.now() - i * 86400000 + 3600000) : null,
    })
  }
  return items
}

// ─── REGULATORY CHANGES ─────────────────────────────

const demoRegChanges: RegulatoryChange[] = [
  { id: 'rc_001', title: 'EU AI Act — Final Implementation Guidelines Published', source: 'EUR-Lex', url: 'https://eur-lex.europa.eu', jurisdiction: 'EU', frameworks: ['GDPR', 'ISO27001'], publishedAt: new Date('2024-12-15'), summary: 'The European Commission published final implementation guidelines for the EU AI Act, establishing mandatory requirements for high-risk AI systems including transparency obligations, human oversight, and conformity assessments effective August 2025.', impact: 'ACTION_REQUIRED', actionItems: [{ action: 'Classify all AI systems by risk category per Annex III', effort: '5 days', owner: 'COMPLIANCE_OFFICER', priority: 1 }, { action: 'Implement AI system logging and monitoring for high-risk systems', effort: '15 days', owner: 'OWNER', priority: 2 }, { action: 'Update data protection impact assessments to include AI-specific risks', effort: '3 days', owner: 'COMPLIANCE_OFFICER', priority: 3 }], createdAt: new Date('2024-12-15') },
  { id: 'rc_002', title: 'SEC Cybersecurity Disclosure Rules — Enforcement Update', source: 'SEC', url: 'https://sec.gov', jurisdiction: 'US', frameworks: ['SOC2'], publishedAt: new Date('2024-12-10'), summary: 'SEC issued staff guidance clarifying material cybersecurity incident disclosure timelines under the December 2023 rules. Organizations must now report material incidents within 4 business days, with enhanced board oversight documentation requirements.', impact: 'MONITOR', actionItems: [{ action: 'Review incident response SLA to ensure 4-day disclosure capability', effort: '2 days', owner: 'COMPLIANCE_OFFICER', priority: 1 }], createdAt: new Date('2024-12-10') },
  { id: 'rc_003', title: 'RBI Digital Payment Security Controls Directive 2025', source: 'RBI', url: 'https://rbi.org.in', jurisdiction: 'IN', frameworks: ['PCI_DSS', 'ISO27001'], publishedAt: new Date('2024-12-08'), summary: 'Reserve Bank of India mandates enhanced security controls for all digital payment platforms including mandatory real-time transaction monitoring, multi-factor authentication for all payment APIs, and quarterly penetration testing effective April 2025.', impact: 'URGENT', actionItems: [{ action: 'Implement real-time transaction anomaly detection', effort: '20 days', owner: 'OWNER', priority: 1 }, { action: 'Upgrade payment API authentication to MFA', effort: '10 days', owner: 'OWNER', priority: 2 }, { action: 'Schedule quarterly penetration testing with CERT-IN empaneled auditor', effort: '3 days', owner: 'COMPLIANCE_OFFICER', priority: 3 }], createdAt: new Date('2024-12-08') },
  { id: 'rc_004', title: 'NIST Cybersecurity Framework 2.0 — Supply Chain Addendum', source: 'NIST', url: 'https://nist.gov', jurisdiction: 'US', frameworks: ['SOC2', 'ISO27001'], publishedAt: new Date('2024-12-01'), summary: 'NIST released a supply chain risk management addendum to CSF 2.0, introducing new subcategories for software supply chain security, SBOM requirements, and vendor security assessment frameworks.', impact: 'MONITOR', actionItems: [{ action: 'Evaluate SBOM generation capability for all shipped software', effort: '5 days', owner: 'OWNER', priority: 1 }], createdAt: new Date('2024-12-01') },
  { id: 'rc_005', title: 'DPDP Act Rules — India Data Protection Board Notification', source: 'MeitY', url: 'https://meity.gov.in', jurisdiction: 'IN', frameworks: ['GDPR', 'ISO27001'], publishedAt: new Date('2024-11-25'), summary: 'Ministry of Electronics and IT published draft rules under the Digital Personal Data Protection Act 2023, specifying consent manager registration requirements, cross-border data transfer mechanisms, and penalties for non-compliance up to ₹250 crore.', impact: 'ACTION_REQUIRED', actionItems: [{ action: 'Map all personal data processing activities under DPDP Act categories', effort: '10 days', owner: 'COMPLIANCE_OFFICER', priority: 1 }, { action: 'Implement consent management platform with logging', effort: '15 days', owner: 'OWNER', priority: 2 }], createdAt: new Date('2024-11-25') },
  { id: 'rc_006', title: 'PCI DSS v4.0.1 — Clarification on Targeted Risk Analysis', source: 'PCI SSC', url: 'https://pcisecuritystandards.org', jurisdiction: 'GLOBAL', frameworks: ['PCI_DSS'], publishedAt: new Date('2024-11-20'), summary: 'PCI Security Standards Council released clarifying guidance on targeted risk analysis requirements in PCI DSS 4.0.1, providing practical examples and templates for documenting risk-based approaches to control implementation.', impact: 'MONITOR', actionItems: [{ action: 'Download and review official TRA templates', effort: '1 day', owner: 'COMPLIANCE_OFFICER', priority: 1 }], createdAt: new Date('2024-11-20') },
]

// ─── ALERTS ─────────────────────────────────────────

const demoAlerts: Alert[] = [
  { id: 'alt_001', organizationId: 'org_demo_001', title: 'Critical: Root Account MFA Disabled', message: 'AWS root account does not have MFA enabled. This is a critical security finding that should be addressed immediately.', severity: 'CRITICAL', type: 'scan_finding', metadata: { scanId: 'scan_001', service: 'IAM' }, isRead: false, isResolved: false, createdAt: new Date(Date.now() - 3600000) },
  { id: 'alt_002', organizationId: 'org_demo_001', title: 'Regulatory: EU AI Act Implementation Deadline', message: 'EU AI Act final guidelines published. Action required to classify AI systems by August 2025.', severity: 'HIGH', type: 'reg_change', metadata: { changeId: 'rc_001' }, isRead: false, isResolved: false, createdAt: new Date(Date.now() - 86400000) },
  { id: 'alt_003', organizationId: 'org_demo_001', title: 'Urgent: RBI Digital Payment Controls Directive', message: 'RBI mandates enhanced security controls for digital payments effective April 2025. Immediate action needed.', severity: 'HIGH', type: 'reg_change', metadata: { changeId: 'rc_003' }, isRead: false, isResolved: false, createdAt: new Date(Date.now() - 2 * 86400000) },
  { id: 'alt_004', organizationId: 'org_demo_001', title: 'SOC2 Control Drift Detected', message: 'Control CC.6.1 (Logical Access) status changed from Implemented to Partial during latest assessment.', severity: 'MEDIUM', type: 'control_drift', metadata: { controlId: 'CC.6.1', framework: 'SOC2' }, isRead: true, isResolved: false, createdAt: new Date(Date.now() - 3 * 86400000) },
  { id: 'alt_005', organizationId: 'org_demo_001', title: 'GDPR Audit Target Date in 90 Days', message: 'Your GDPR compliance audit target date is March 31, 2025. Current compliance score: 89%.', severity: 'INFO', type: 'deadline', metadata: { framework: 'GDPR', daysRemaining: 90 }, isRead: true, isResolved: false, createdAt: new Date(Date.now() - 5 * 86400000) },
  { id: 'alt_006', organizationId: 'org_demo_001', title: 'S3 Public Access Finding', message: 'S3 bucket "acme-data-backup" has public read access enabled. This violates data protection controls.', severity: 'HIGH', type: 'scan_finding', metadata: { scanId: 'scan_001', service: 'S3' }, isRead: false, isResolved: false, createdAt: new Date(Date.now() - 3600000) },
  { id: 'alt_007', organizationId: 'org_demo_001', title: 'New Evidence Anchored to Blockchain', message: 'Batch of 5 evidence items successfully anchored to Polygon. Tx: 0x8a7b...3f2e', severity: 'INFO', type: 'evidence_anchored', metadata: { count: 5 }, isRead: true, isResolved: true, createdAt: new Date(Date.now() - 7 * 86400000) },
]

// ─── REPORTS ────────────────────────────────────────

const demoReports: Report[] = [
  { id: 'rpt_001', organizationId: 'org_demo_001', generatedById: 'usr_001', title: 'SOC 2 Type II Gap Analysis — Q4 2024', framework: 'SOC2', type: 'gap_analysis', dateFrom: new Date('2024-10-01'), dateTo: new Date('2024-12-31'), fileUrl: null, status: 'ready', data: { totalControls: 35, implemented: 22, gaps: 8, partial: 5 }, createdAt: new Date('2024-12-20') },
  { id: 'rpt_002', organizationId: 'org_demo_001', generatedById: 'usr_002', title: 'GDPR Evidence Summary — 2024', framework: 'GDPR', type: 'evidence_summary', dateFrom: new Date('2024-01-01'), dateTo: new Date('2024-12-31'), fileUrl: null, status: 'ready', data: { totalEvidence: 45, anchored: 38, verified: 30 }, createdAt: new Date('2024-12-18') },
  { id: 'rpt_003', organizationId: 'org_demo_001', generatedById: 'usr_001', title: 'Regulatory Impact Report — December 2024', framework: 'ALL', type: 'regulatory_impact', dateFrom: new Date('2024-12-01'), dateTo: new Date('2024-12-31'), fileUrl: null, status: 'ready', data: { changesAnalyzed: 6, actionRequired: 2, urgent: 1 }, createdAt: new Date('2024-12-25') },
]

// ─── CACHED INSTANCES ───────────────────────────────
const controlStatuses = generateControlStatuses()
const evidenceItems = generateEvidence()

// ─── EXPORT ─────────────────────────────────────────

type DemoDataKey = 'organization' | 'users' | 'currentUser' | 'frameworks' | 'orgFrameworks' | 'controls' | 'controlStatuses' | 'scans' | 'policies' | 'evidence' | 'regulatoryChanges' | 'alerts' | 'reports' | 'kpis' | 'unreadAlerts'

export function getDemoData(key: DemoDataKey): unknown {
  const map: Record<DemoDataKey, unknown> = {
    organization: demoOrg,
    users: demoUsers,
    currentUser: demoUsers[0],
    frameworks: demoFrameworks,
    orgFrameworks: demoOrgFrameworks,
    controls: allControls,
    controlStatuses,
    scans: demoScans,
    policies: demoPolicies,
    evidence: evidenceItems,
    regulatoryChanges: demoRegChanges,
    alerts: demoAlerts,
    reports: demoReports,
    unreadAlerts: demoAlerts.filter(a => !a.isRead).length,
    kpis: {
      complianceScore: 67,
      openGaps: controlStatuses.filter(cs => cs.status === 'NOT_IMPLEMENTED').length,
      evidenceCount: evidenceItems.length,
      pendingActions: demoRegChanges.filter(r => r.impact === 'ACTION_REQUIRED' || r.impact === 'URGENT').reduce((sum, r) => sum + r.actionItems.length, 0),
    },
  }
  return map[key]
}

export {
  demoOrg, demoUsers, demoFrameworks, demoOrgFrameworks, allControls,
  demoScans, demoPolicies, demoRegChanges, demoAlerts, demoReports,
}
