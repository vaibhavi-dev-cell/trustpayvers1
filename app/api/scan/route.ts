import { NextRequest, NextResponse } from 'next/server'
import { getDemoData } from '@/lib/demo-data'
export async function GET() { return NextResponse.json(getDemoData('scans')) }
export async function POST(_request: NextRequest) { return NextResponse.json({ id: 'scan_' + Date.now(), status: 'QUEUED' }) }