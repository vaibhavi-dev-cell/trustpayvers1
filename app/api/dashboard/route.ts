import { NextResponse } from 'next/server'
import { getDemoData } from '@/lib/demo-data'
export async function GET() {
  return NextResponse.json({ kpis: getDemoData('kpis'), orgFrameworks: getDemoData('orgFrameworks'), alerts: getDemoData('alerts'), regulatoryChanges: getDemoData('regulatoryChanges') })
}