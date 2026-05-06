import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { firstName, lastName, email, phone, orderItems, totalAmount, storeKeyword } = body

    if (!firstName || !email || !phone || !orderItems || totalAmount == null) {
      return NextResponse.json({ message: 'Faltan campos obligatorios' }, { status: 400 })
    }

    // Resolve store by keyword entered in the form
    let storeId: string | null = null
    if (storeKeyword?.trim()) {
      const store = await prisma.store.findUnique({
        where: { keyword: storeKeyword.trim().toLowerCase() },
      })
      storeId = store?.id ?? null
    }

    // Generate next order number (e.g. TK-1001)
    const lastOrder = await prisma.order.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { orderNumber: true },
    })

    let nextNumber = 1001
    if (lastOrder?.orderNumber) {
      const match = lastOrder.orderNumber.match(/TK-(\d+)/)
      if (match) nextNumber = parseInt(match[1], 10) + 1
    }

    const orderNumber = `TK-${nextNumber}`

    const order = await prisma.order.create({
      data: {
        orderNumber,
        firstName,
        lastName: lastName || '-',
        email,
        phone,
        deliveryMethod: 'PICKUP',
        totalAmount,
        orderItems: orderItems,
        ...(storeId ? { storeId } : {}),
      },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ message: 'Error al crear la orden' }, { status: 500 })
  }
}
