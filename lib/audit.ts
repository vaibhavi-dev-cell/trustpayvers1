export async function logAudit(params: {
  userId?: string
  action: string
  entityType: string
  entityId: string
  before?: Record<string, unknown> | null
  after?: Record<string, unknown> | null
  metadata?: Record<string, unknown>
  ipAddress?: string
}): Promise<void> {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    console.log(`[AUDIT] ${params.action} on ${params.entityType}/${params.entityId}`)
    return
  }

  try {
    const { prisma } = await import('./prisma')
    await (prisma as Record<string, unknown>)?.['auditLog']
    // In production, write to DB
  } catch {
    console.log(`[AUDIT] ${params.action} on ${params.entityType}/${params.entityId}`)
  }
}
