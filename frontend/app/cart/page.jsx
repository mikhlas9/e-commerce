"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"

export default function Cart() {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo")
    if (!userInfo) {
      router.push("/login")
      return
    }
    loadCart()
  }, [router])

  const loadCart = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"))
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.get("https://e-commerce-8iub.vercel.app/api/cart", config)
      setCartItems(data)
    } catch (error) {
      console.error("Error loading cart:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"))
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          "Content-type": "application/json",
        },
      }

      if (newQuantity <= 0) {
        await axios.delete(`https://e-commerce-8iub.vercel.app/api/cart/remove/${itemId}`, config)
      } else {
        await axios.put("https://e-commerce-8iub.vercel.app/api/cart/update", { itemId, quantity: newQuantity }, config)
      }

      await loadCart()
    } catch (error) {
      console.error("Error updating cart:", error)
    }
  }

  const removeItem = async (itemId) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"))
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      await axios.delete(`https://e-commerce-8iub.vercel.app/api/cart/remove/${itemId}`, config)
      await loadCart()
    } catch (error) {
      console.error("Error removing item:", error)
    }
  }

  const getTotalPrice = () => {
    return cartItems
      .reduce((total, cartItem) => {
        return total + cartItem.item.price * cartItem.quantity
      }, 0)
      .toFixed(2)
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, cartItem) => total + cartItem.quantity, 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent mx-auto"></div>
              <p className="mt-4 text-stone-600 text-lg">Loading your cart...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-stone-900 mb-1 flex items-center gap-3">
            <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
              />
            </svg>
            Shopping Cart
          </h1>
          <p className="text-stone-600">Review your items and proceed to checkout</p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-sm p-8 max-w-md mx-auto border border-stone-200">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-stone-900 mb-2">Your cart is empty</h3>
              <p className="text-stone-600 mb-6 leading-relaxed">
                Start shopping to add items to your cart and discover amazing products.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-emerald-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-stone-200">
                <div className="p-4 border-b border-stone-200">
                  <h2 className="text-lg font-semibold text-stone-900 flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    Cart Items ({getTotalItems()})
                  </h2>
                </div>

                {cartItems.map((cartItem, index) => (
                  <div
                    key={cartItem.item._id}
                    className={`flex flex-col sm:flex-row items-start sm:items-center p-4 gap-4 ${index !== cartItems.length - 1 ? "border-b border-stone-100" : ""}`}
                  >
                    <div className="w-full sm:w-20 h-32 sm:h-20 flex-shrink-0">
                      <img
                        src={cartItem.item.image || "/placeholder.svg"}
                        alt={cartItem.item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-stone-900 mb-1">{cartItem.item.name}</h3>
                      <p className="text-sm text-stone-500 mb-1 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          />
                        </svg>
                        {cartItem.item.category}
                      </p>
                      <p className="text-lg font-bold text-emerald-600">₹{cartItem.item.price.toFixed(2)}</p>
                    </div>

                    <div className="flex items-center gap-2 bg-stone-50 rounded-lg p-2">
                      <button
                        onClick={() => updateQuantity(cartItem.item._id, cartItem.quantity - 1)}
                        className="w-8 h-8 rounded-md border border-stone-300 bg-white flex items-center justify-center hover:bg-stone-50 transition-colors duration-200 font-semibold text-stone-600"
                      >
                        −
                      </button>

                      <span className="w-10 text-center font-semibold text-stone-900">{cartItem.quantity}</span>

                      <button
                        onClick={() => updateQuantity(cartItem.item._id, cartItem.quantity + 1)}
                        className="w-8 h-8 rounded-md border border-stone-300 bg-white flex items-center justify-center hover:bg-stone-50 transition-colors duration-200 font-semibold text-stone-600"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-stone-900 mb-1">
                        ₹{(cartItem.item.price * cartItem.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeItem(cartItem.item._id)}
                        className="inline-flex items-center cursor-pointer gap-1 text-red-600 hover:text-red-800 text-sm font-medium transition-colors duration-200"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-4 sticky top-4 border border-stone-200">
                <h3 className="text-lg font-semibold text-stone-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  Order Summary
                </h3>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-stone-600">Items ({getTotalItems()})</span>
                    <span className="font-semibold text-stone-900">₹{getTotalPrice()}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-stone-600 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                      Shipping
                    </span>
                    <span className="font-semibold text-emerald-600">Free</span>
                  </div>
                  <div className="border-t border-stone-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-semibold text-stone-900">Total</span>
                      <span className="text-xl font-bold text-emerald-600">₹{getTotalPrice()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button className="w-full cursor-pointer bg-emerald-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-1 flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                    Proceed to Checkout
                  </button>

                  <Link
                    href="/products"
                    className="w-full border-2 border-stone-300 text-stone-700 font-semibold py-3 px-4 rounded-lg hover:bg-stone-50 transition-all duration-200 text-center block flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    Continue Shopping
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="mt-4 pt-4 border-t border-stone-200">
                  <div className="flex items-center justify-center gap-3 text-xs text-stone-500">
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
                      </svg>
                      Secure Checkout
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Money Back Guarantee
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
