import { prisma } from '@/lib/prisma'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const keyword = req.nextUrl.searchParams.get('keyword')?.trim().toLowerCase()

  if (!keyword) {
    return NextResponse.json({ message: 'Falta la palabra clave' }, { status: 400 })
  }

  const store = await prisma.store.findUnique({
    where: { keyword },
    select: { id: true, name: true, keyword: true, isActive: true },
  })

  if (!store || !store.isActive) {
    return NextResponse.json({ message: 'La palabra clave es incorrecta' }, { status: 404 })
  }

  return NextResponse.json(store)
}
