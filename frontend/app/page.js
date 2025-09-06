"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Home() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  // Function to check and load user data
  const checkUserData = () => {
    const userInfo = localStorage.getItem("userInfo")
    if (userInfo) {
      const userData = JSON.parse(userInfo)
      setUser(userData.user)
    } else {
      setUser(null)
    }
  }

  useEffect(() => {
    // Initial load
    checkUserData()

    // Listen for localStorage changes (when user logs in/out)
    const handleStorageChange = () => {
      checkUserData()
    }

    // Listen for custom login/logout events
    const handleAuthEvent = () => {
      checkUserData()
    }

    // Add event listeners
    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("userLogin", handleAuthEvent)
    window.addEventListener("userLogout", handleAuthEvent)

    // Cleanup event listeners
    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("userLogin", handleAuthEvent)
      window.removeEventListener("userLogout", handleAuthEvent)
    }
  }, [])

  const handleStartShopping = () => {
    if (user) {
      router.push("/products")
    } else {
      router.push("/signup")
    }
  }

  const handleBrowseCatalog = () => {
    if (user) {
      router.push("/products")
    } else {
      router.push("/products") // or wherever you want non-logged-in users to browse
    }
  }

  const handleViewCart = () => {
    router.push("/cart")
  }

  const handleLogin = () => {
    router.push("/login")
  }

  const handleSignup = () => {
    router.push("/signup")
  }

  return (
    <div className="bg-stone-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                New arrivals weekly
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-stone-900 leading-tight mb-6">
                Shop smarter,
                <br />
                <span className="text-emerald-600">live better</span>
              </h1>
              <p className="text-xl text-stone-600 mb-8 leading-relaxed">
                Discover carefully curated products that make everyday life more enjoyable. 
                From essentials to luxuries, we've got everything you need.
              </p>
              
              {user ? (
                <button 
                  onClick={handleStartShopping}
                  className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-700 transition-colors shadow-lg"
                >
                  Continue Shopping
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleSignup}
                    className="bg-emerald-600 cursor-pointer text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-700 transition-colors shadow-lg"
                  >
                    Start Shopping
                  </button>
               
                </div>
              )}
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-3xl p-8 transform rotate-2">
                <div className="bg-white rounded-2xl p-6 shadow-xl transform -rotate-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-stone-100 rounded-xl h-24"></div>
                    <div className="bg-emerald-100 rounded-xl h-24"></div>
                    <div className="bg-amber-100 rounded-xl h-24"></div>
                    <div className="bg-blue-100 rounded-xl h-24"></div>
                  </div>
                  <div className="mt-6 space-y-3">
                    <div className="h-3 bg-stone-200 rounded-full w-3/4"></div>
                    <div className="h-3 bg-stone-200 rounded-full w-1/2"></div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-amber-400 text-amber-900 px-4 py-2 rounded-xl font-semibold text-sm shadow-lg transform rotate-12">
                30% OFF
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16 border-t border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-stone-900 mb-2">50K+</div>
              <div className="text-stone-600">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-stone-900 mb-2">10K+</div>
              <div className="text-stone-600">Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-stone-900 mb-2">99%</div>
              <div className="text-stone-600">Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-stone-900 mb-2">24/7</div>
              <div className="text-stone-600">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-stone-900 mb-4">Why people love shopping with us</h2>
            <p className="text-xl text-stone-600">We've built our reputation on these core promises</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group">
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-3">Lightning Fast Delivery</h3>
                <p className="text-stone-600 leading-relaxed">
                  Same-day delivery in most cities. We know you don't like waiting, so we don't make you.
                </p>
                <div className="mt-6 text-blue-600 font-medium">Usually arrives in 2-4 hours →</div>
              </div>
            </div>
            <div className="group">
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-200 transition-colors">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-3">Handpicked Quality</h3>
                <p className="text-stone-600 leading-relaxed">
                  Every product is personally tested by our team. If we wouldn't buy it, we won't sell it.
                </p>
                <div className="mt-6 text-emerald-600 font-medium">30-day guarantee →</div>
              </div>
            </div>
            <div className="group">
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100">
                <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-200 transition-colors">
                  <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-3">Fair Prices Always</h3>
                <p className="text-stone-600 leading-relaxed">
                  No hidden fees, no surprise charges. The price you see is the price you pay.
                </p>
                <div className="mt-6 text-amber-600 font-medium">Price match promise →</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logged In User Section */}
      {user && (
        <section className="bg-emerald-50 py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="bg-white rounded-3xl p-12 shadow-sm">
              <h2 className="text-3xl font-bold text-stone-900 mb-4">
                Welcome back, {user.name}! 👋
              </h2>
              <p className="text-lg text-stone-600 mb-8">
                Your cart is waiting, and we've got some new arrivals you might love.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={handleViewCart}
                  className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-700 transition-colors shadow-lg"
                >
                  View My Cart
                </button>
                <button 
                  onClick={handleBrowseCatalog}
                  className="border-2 border-emerald-600 text-emerald-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-50 transition-colors"
                >
                  Browse New Items
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-stone-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg"></div>
                <span className="text-xl font-bold">ShopEasy</span>
              </div>
              <p className="text-stone-400">Making shopping simple and enjoyable for everyone.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-stone-400">
                <li>
                  <Link href="/products" className="hover:text-white transition-colors">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-white transition-colors">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-white transition-colors">
                    Sale Items
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-stone-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-stone-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-800 mt-12 pt-8 text-center text-stone-400">
            <p>&copy; 2025 ShopEasy. Made with care for our customers.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
