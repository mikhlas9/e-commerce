"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import Link from "next/link"
import { Search, Filter, ShoppingCart, CheckCircle, XCircle, X } from "lucide-react"

export default function Products() {
  const [items, setItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState(null)
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    search: "",
  })
  const router = useRouter()

  const categories = ["Electronics", "Clothing", "Books", "Home", "Sports", "Beauty"]

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo")
    if (!userInfo) {
      router.push("/login")
      return
    }
    loadItems()
  }, [router])

  useEffect(() => {
    applyFilters()
  }, [items, filters])

  const loadItems = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/items")
      setItems(data)
      setFilteredItems(data)
    } catch (error) {
      console.error("Error loading items:", error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...items]

    if (filters.category) {
      filtered = filtered.filter((item) => item.category === filters.category)
    }

    if (filters.minPrice) {
      filtered = filtered.filter((item) => item.price >= Number.parseFloat(filters.minPrice))
    }

    if (filters.maxPrice) {
      filtered = filtered.filter((item) => item.price <= Number.parseFloat(filters.maxPrice))
    }

    if (filters.search) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          item.description.toLowerCase().includes(filters.search.toLowerCase()),
      )
    }

    setFilteredItems(filtered)
  }

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }))
  }

  const clearFilters = () => {
    setFilters({
      category: "",
      minPrice: "",
      maxPrice: "",
      search: "",
    })
  }

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const dismissNotification = () => {
    setNotification(null)
  }

  const addToCart = async (itemId, itemName) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"))
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          "Content-type": "application/json",
        },
      }

      await axios.post("http://localhost:5000/api/cart/add", { itemId, quantity: 1 }, config)

      // Show success notification with item name
      showNotification(`${itemName} added to cart!`, 'success')

      // Dispatch custom event to update navbar cart count
      window.dispatchEvent(new CustomEvent("cartUpdated"))

    } catch (error) {
      console.error("Error adding to cart:", error)
      showNotification("Failed to add item to cart", 'error')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent mx-auto"></div>
              <p className="mt-4 text-stone-600 text-lg">Loading products...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Notification Component */}
      {notification && (
        <div 
          className={`fixed top-4 right-4 px-4 py-3 rounded-xl shadow-lg z-50 transition-all duration-300 flex items-center gap-3 ${
            notification.type === 'success' 
              ? 'bg-emerald-600 text-white' 
              : 'bg-red-500 text-white'
          }`}
          style={{
            animation: 'slideInRight 0.3s ease-out'
          }}
        >
          {notification.type === 'success' ? (
            <CheckCircle size={20} />
          ) : (
            <XCircle size={20} />
          )}
          <span className="font-medium">{notification.message}</span>
          <button 
            onClick={dismissNotification}
            className="ml-2 hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-stone-900 mb-1">Our Products</h1>
          <p className="text-stone-600">Discover amazing products at great prices</p>
        </div>

        {/* Compact Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6 border border-stone-200">
          <div className="flex flex-wrap gap-3 items-end">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <input
                  type="text"
                  className="w-full text-stone-900 px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all pl-9 text-sm bg-stone-50"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
                <Search size={16} className="text-stone-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            {/* Category */}
            <div className="w-36">
              <select
                className="w-full px-3 py-2 text-stone-900 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-stone-50 text-sm"
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="flex gap-2">
              <input
                type="number"
                className="w-20 px-3 py-2 text-stone-900 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-stone-50 text-sm"
                placeholder="Min ₹"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
              />
              <input
                type="number"
                className="w-20 px-3 py-2 text-stone-900 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-stone-50 text-sm"
                placeholder="Max ₹"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
              />
            </div>

            {/* Clear Button */}
            <button
              onClick={clearFilters}
              className="px-3 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-all text-sm font-medium"
            >
              Clear
            </button>
          </div>

          {/* Results Count */}
          <div className="mt-3 text-xs text-stone-600">
            Showing <span className="font-semibold text-emerald-600">{filteredItems.length}</span> of{" "}
            <span className="font-semibold">{items.length}</span> products
          </div>
        </div>

        {/* Products Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-sm p-8 border border-stone-200">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-stone-400" />
              </div>
              <h3 className="text-xl font-semibold text-stone-900 mb-2">No products found</h3>
              <p className="text-stone-500 mb-4">Try adjusting your filters to see more results.</p>
              <button
                onClick={clearFilters}
                className="bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-emerald-700 transition-all"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
                <Link href={`/product/${item._id}`} key={item._id} >
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-stone-200 h-full flex flex-col"
              >
                {/* Image */}
                <div className="aspect-square overflow-hidden bg-stone-100">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-semibold text-stone-900 line-clamp-2 flex-1 leading-tight">{item.name}</h3>
                    <span className="text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded-md ml-2 whitespace-nowrap">
                      {item.category}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-stone-600 text-xs mb-3 line-clamp-2 leading-relaxed flex-1">{item.description}</p>

                  {/* Price and Stock */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-emerald-600">₹{item.price.toFixed(2)}</span>
                    {item.inStock ? (
                      <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md font-medium">
                        In Stock
                      </span>
                    ) : (
                      <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-md font-medium">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  {item.inStock ? (
                    <button
                      onClick={() => addToCart(item._id, item.name)}
                      className="w-full cursor-pointer bg-emerald-600 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-emerald-700 transition-all duration-200 flex items-center justify-center gap-2 text-sm hover:scale-105 active:scale-95"
                    >
                      <ShoppingCart size={16} />
                      Add to Cart
                    </button>
                  ) : (
                    <button className="w-full bg-stone-200 text-stone-500 font-medium py-2.5 px-4 rounded-lg cursor-not-allowed text-sm">
                      Out of Stock
                    </button>
                  )}
                </div>
              </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* CSS Animation for notification */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
