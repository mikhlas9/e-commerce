"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Menu, X, Store,ShoppingCart, Home, User, LogOut } from "lucide-react"

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [cartCount, setCartCount] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  // Function to check and load user data
  const checkUserData = () => {
    const userInfo = localStorage.getItem("userInfo")
    if (userInfo) {
      const userData = JSON.parse(userInfo)
      setUser(userData.user)
      loadCartCount(userData.token)
    } else {
      setUser(null)
      setCartCount(0)
    }
  }

  useEffect(() => {
    // Initial load
    checkUserData()

    // Listen for localStorage changes (when user logs in/out)
    const handleStorageChange = () => {
      checkUserData()
    }

    // Listen for custom login event
    const handleLoginEvent = () => {
      checkUserData()
    }

    // Add event listeners
    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("userLogin", handleLoginEvent)
    window.addEventListener("userLogout", handleLoginEvent)

    // Cleanup event listeners
    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("userLogin", handleLoginEvent)
      window.removeEventListener("userLogout", handleLoginEvent)
    }
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [router.pathname])

  const loadCartCount = async (token) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      const { data } = await axios.get("http://localhost:5000/api/cart", config)
      const count = data.reduce((total, item) => total + item.quantity, 0)
      setCartCount(count)
    } catch (error) {
      console.error("Error loading cart count:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("userInfo")
    setUser(null)
    setCartCount(0)
    setIsMobileMenuOpen(false)

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent("userLogout"))

    router.push("/login")
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
            <div className="w-8 h-8 bg-emerald-600 rounded-lg"></div>
            <span className="text-xl font-bold text-stone-900">ShopEasy</span>
          </Link>

          {/* Desktop Navigation - Only show when logged in */}
          {user && (
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                href="/" 
                className="text-stone-600 hover:text-stone-900 font-medium transition-colors"
              >
                Home
              </Link>
              <Link 
                href="/products" 
                className="text-stone-600 hover:text-stone-900 font-medium transition-colors"
              >
                Products
              </Link>
              <Link 
                href="/cart" 
                className="relative text-stone-600 hover:text-stone-900 font-medium transition-colors flex items-center gap-2"
              >
                Cart
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          )}

          {/* Desktop User Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 text-sm font-semibold">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <span className="text-stone-700 font-medium">
                  Hi, {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex cursor-pointer items-center gap-2 text-stone-600 hover:text-red-600 font-medium px-3 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="text-stone-600 hover:text-stone-900 font-medium transition-colors"
                >
                  Sign Up
                </Link>
                <Link
                  href="/login"
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 font-medium transition-colors shadow-sm"
                >
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-stone-100 transition-colors"
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6">
              <Menu 
                size={24} 
                className={`absolute inset-0 text-stone-600 transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'
                }`}
              />
              <X 
                size={24} 
                className={`absolute inset-0 text-stone-600 transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-0 opacity-100' : 'rotate-180 opacity-0'
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="pt-4 pb-2 space-y-2">
            {user ? (
              <>
                {/* User Info */}
                <div className="flex items-center gap-3 px-3 py-2 border-b border-stone-200 mb-2">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 font-semibold">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-stone-900 font-medium">Hi, {user.name}</p>
                    <p className="text-stone-500 text-sm">Welcome back!</p>
                  </div>
                </div>

                {/* Navigation Links */}
                <Link
                  href="/"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-3 py-3 text-stone-700 hover:bg-stone-50 rounded-lg transition-colors font-medium"
                >
                  <div className="w-5 h-5 bg-emerald-100 rounded flex items-center justify-center">
                    <Home size={20} className="text-emerald-600" />
                  </div>
                  Home
                </Link>
                <Link
                  href="/products"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-3 py-3 text-stone-700 hover:bg-stone-50 rounded-lg transition-colors font-medium"
                >
                  <div className="w-5 h-5 bg-emerald-100 rounded flex items-center justify-center">
                    <Store size={20} className="text-emerald-600" />
                  </div>
                  Products
                </Link>

                <Link
                  href="/cart"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-between px-3 py-3 text-stone-700 hover:bg-stone-50 rounded-lg transition-colors font-medium"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingCart size={20} className="text-emerald-600" />
                    Cart
                  </div>
                  {cartCount > 0 && (
                    <span className="bg-emerald-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-semibold">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full cursor-pointer flex items-center gap-3 px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium mt-2"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signup"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-3 py-3 text-stone-700 hover:bg-stone-50 rounded-lg transition-colors font-medium"
                >
                  <User size={20} className="text-emerald-600" />
                  Sign Up
                </Link>
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-3 py-3 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg transition-colors font-medium"
                >
                  <LogOut size={20} />
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
