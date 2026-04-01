import { NextRequest, NextResponse } from 'next/server'
export async function POST(request: NextRequest) {
  const body = await request.json() as { ids: string[] }
  const txHash = '0x' + Array.from({length:64},()=>'0123456789abcdef'[Math.floor(Math.random()*16)]).join('')
  return NextResponse.json({ success: true, txHash, block: 45000000 + Math.floor(Math.random()*1000), anchored: body.ids?.length ?? 0 })
}