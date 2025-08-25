import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Since we're using localStorage for cart management,
  // this endpoint returns a success message for API completeness
  return NextResponse.json({ 
    message: 'Cart is managed client-side via localStorage',
    instructions: {
      add: 'Add items to cart using localStorage.setItem("cart", JSON.stringify(cartItems))',
      get: 'Get cart using localStorage.getItem("cart")',
      clear: 'Clear cart using localStorage.removeItem("cart")'
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const { items } = await request.json()

    // Validate cart items
    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Items must be an array' },
        { status: 400 }
      )
    }

    // Validate each item
    for (const item of items) {
      const requiredFields = ['id', 'name', 'price', 'image_url', 'size', 'quantity']
      
      for (const field of requiredFields) {
        if (!item[field]) {
          return NextResponse.json(
            { error: `Missing required field in item: ${field}` },
            { status: 400 }
          )
        }
      }

      if (item.quantity <= 0) {
        return NextResponse.json(
          { error: 'Item quantity must be greater than 0' },
          { status: 400 }
        )
      }

      if (item.price <= 0) {
        return NextResponse.json(
          { error: 'Item price must be greater than 0' },
          { status: 400 }
        )
      }
    }

    // Calculate total
    const total = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)

    return NextResponse.json({
      message: 'Cart validated successfully',
      items,
      totalItems: items.reduce((sum: number, item: any) => sum + item.quantity, 0),
      totalAmount: total
    })
  } catch (error) {
    console.error('Error validating cart:', error)
    return NextResponse.json({ error: 'Invalid cart data' }, { status: 400 })
  }
}

export async function DELETE() {
  // Clear cart endpoint (client should call localStorage.removeItem("cart"))
  return NextResponse.json({ 
    message: 'Cart cleared successfully',
    note: 'Client should call localStorage.removeItem("cart")'
  })
}