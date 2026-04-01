import { NextResponse } from 'next/server'
import { getDemoData } from '@/lib/demo-data'
export async function GET() { return NextResponse.json(getDemoData('regulatoryChanges')) }