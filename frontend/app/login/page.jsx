"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo")
    if (userInfo) {
      router.push("/products")
    }
  }, [router])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      }

      const { data } = await axios.post(
        `https://e-commerce-8iub.vercel.app/api/auth/login`,
        { email: formData.email, password: formData.password },
        config,
      )

      if (data) {
        localStorage.setItem("userInfo", JSON.stringify(data))

        // Dispatch custom event to update navbar
        window.dispatchEvent(new CustomEvent("userLogin"))

        router.push("/products")
      } else {
        setError("Invalid credentials. Please try again.")
      }
    } catch (error) {
      setError("Invalid email or password.")
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
     

        {/* Login Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 sm:p-8 space-y-6">
          <div className="text-center">
            <div className="mx-auto h-14 w-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
              <svg className="h-7 w-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-2">Welcome back</h2>
            <p className="text-stone-600 text-sm sm:text-base">
              Sign in to your account to continue shopping
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-stone-700 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 text-stone-900 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder-stone-400 hover:bg-white"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-stone-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-3 text-stone-900 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder-stone-400 hover:bg-white"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start space-x-3">
                <svg
                  className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 shadow-sm hover:shadow-md"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>

          {/* No Account Section */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-stone-500">Don't have an account?</span>
            </div>
          </div>

          <div>
            <Link
              href="/signup"
              className="w-full border-2 border-stone-200 text-stone-700 font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 hover:border-stone-300 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 flex items-center justify-center"
            >
              Create new account
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-stone-600 hover:text-stone-900 text-sm font-medium transition-colors inline-flex items-center space-x-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to home</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
