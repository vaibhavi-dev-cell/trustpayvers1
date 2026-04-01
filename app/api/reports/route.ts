import { NextResponse } from 'next/server'
import { getDemoData } from '@/lib/demo-data'
export async function GET() { return NextResponse.json(getDemoData('reports')) }
export async function POST() { return NextResponse.json({ id: 'rpt_' + Date.now(), status: 'generating' }) }