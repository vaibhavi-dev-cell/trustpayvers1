export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
}

export function getEnvOrDemo(key: string, demoFallback: string): string {
  const value = process.env[key]
  if (value && value.length > 0) return value
  return demoFallback
}
