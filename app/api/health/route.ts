import { NextResponse } from 'next/server'
export async function GET() {
  return NextResponse.json({ status: 'ok', version: '1.0.0', mode: process.env.NEXT_PUBLIC_DEMO_MODE === 'true' ? 'demo' : 'live', timestamp: new Date().toISOString() })
}