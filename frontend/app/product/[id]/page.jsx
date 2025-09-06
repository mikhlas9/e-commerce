"use client"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import { ArrowLeft, ShoppingCart, Heart, Share2, Star, Truck, Shield, RotateCcw, CheckCircle, XCircle, X, Plus, Minus } from "lucide-react"

export default function ProductDetail() {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [notification, setNotification] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const router = useRouter()
  const params = useParams()
  const productId = params.id

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo")
    if (!userInfo) {
      router.push("/login")
      return
    }
    if (productId) {
      loadProduct()
    }
  }, [router, productId])

  const loadProduct = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/items/${productId}`)
      setProduct(data)
    } catch (error) {
      console.error("Error loading product:", error)
    } finally {
      setLoading(false)
    }
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

  const addToCart = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"))
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          "Content-type": "application/json",
        },
      }

      await axios.post("http://localhost:5000/api/cart/add", { itemId: productId, quantity }, config)
      showNotification(`${quantity} ${product.name}${quantity > 1 ? 's' : ''} added to cart!`, 'success')
      
      // Dispatch custom event to update navbar cart count
      window.dispatchEvent(new CustomEvent("cartUpdated"))

    } catch (error) {
      console.error("Error adding to cart:", error)
      showNotification("Failed to add item to cart", 'error')
    }
  }

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    showNotification(
      isWishlisted ? "Removed from wishlist" : "Added to wishlist", 
      'success'
    )
  }

  const shareProduct = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href)
      showNotification("Product link copied to clipboard!", 'success')
    }
  }

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1)
  }

  const decrementQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1)
  }

  // Mock related products - in real app, fetch from API
  const relatedProducts = [
    { _id: '1', name: 'Similar Product 1', price: 999, image: '/placeholder.svg' },
    { _id: '2', name: 'Similar Product 2', price: 1299, image: '/placeholder.svg' },
    { _id: '3', name: 'Similar Product 3', price: 899, image: '/placeholder.svg' },
    { _id: '4', name: 'Similar Product 4', price: 1499, image: '/placeholder.svg' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent mx-auto"></div>
              <p className="mt-4 text-stone-600 text-lg">Loading product...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-stone-50">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center py-16">
            <div className="bg-white rounded-xl shadow-sm p-8 border border-stone-200 max-w-md mx-auto">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle size={32} className="text-stone-400" />
              </div>
              <h3 className="text-xl font-semibold text-stone-900 mb-2">Product not found</h3>
              <p className="text-stone-500 mb-6">The product you're looking for doesn't exist.</p>
              <Link
                href="/products"
                className="bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-emerald-700 transition-all inline-flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Back to Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Mock multiple images - in real app, product would have multiple images
  const productImages = [
    product.image || '/placeholder.svg',
    '/placeholder.svg',
    '/placeholder.svg',
  ]

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
        {/* Breadcrumb & Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/products"
            className="flex items-center gap-2 text-stone-600 hover:text-stone-900 font-medium transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Products
          </Link>
          <span className="text-stone-400">/</span>
          <span className="text-stone-900 font-medium">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-xl border border-stone-200 overflow-hidden">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Images */}
            <div className="flex gap-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg border-2 overflow-hidden transition-all ${
                    selectedImage === index 
                      ? 'border-emerald-600 ring-2 ring-emerald-200' 
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-sm text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-md">
                    {product.category}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={toggleWishlist}
                    className={`p-2 rounded-lg border transition-all ${
                      isWishlisted 
                        ? 'border-red-300 bg-red-50 text-red-600' 
                        : 'border-stone-300 bg-white text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    onClick={shareProduct}
                    className="p-2 rounded-lg border border-stone-300 bg-white text-stone-600 hover:bg-stone-50 transition-all"
                  >
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-stone-900 mb-2">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className={`${i < 4 ? 'text-yellow-400 fill-current' : 'text-stone-300'}`} 
                    />
                  ))}
                </div>
                <span className="text-sm text-stone-600">(4.0) · 128 reviews</span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-emerald-600">₹{product.price.toFixed(2)}</span>
                {product.inStock ? (
                  <span className="text-sm text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full font-medium">
                    ✓ In Stock
                  </span>
                ) : (
                  <span className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded-full font-medium">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-stone-900 mb-2">Description</h3>
              <p className="text-stone-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Quantity & Add to Cart */}
            {product.inStock && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Quantity</label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-stone-300 rounded-lg bg-white">
                      <button
                        onClick={decrementQuantity}
                        className="p-3 hover:bg-stone-50 transition-colors"
                        disabled={quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4 py-3 font-semibold text-stone-900 min-w-[60px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={incrementQuantity}
                        className="p-3 hover:bg-stone-50 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <span className="text-sm text-stone-600">
                      Total: ₹{(product.price * quantity).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={addToCart}
                    className="flex-1 cursor-pointer bg-emerald-600 text-white font-semibold py-4 px-6 rounded-lg hover:bg-emerald-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                  >
                    <ShoppingCart size={20} />
                    Add to Cart
                  </button>
                  <Link
                    href="/cart"
                    className="px-6 py-4 border-2 border-emerald-600 text-emerald-600 font-semibold rounded-lg hover:bg-emerald-50 transition-all duration-200 text-center"
                  >
                    View Cart
                  </Link>
                </div>
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-stone-200">
              <div className="flex items-center gap-3 text-sm text-stone-600">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Truck size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-stone-900">Free Delivery</p>
                  <p className="text-xs">On orders over ₹500</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-stone-600">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Shield size={16} className="text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium text-stone-900">2 Year Warranty</p>
                  <p className="text-xs">Full protection</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-stone-600">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <RotateCcw size={16} className="text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-stone-900">Easy Returns</p>
                  <p className="text-xs">30-day policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div>
          <h2 className="text-2xl font-bold text-stone-900 mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct._id}
                href={`/product/${relatedProduct._id}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-stone-200"
              >
                <div className="aspect-square bg-stone-100 overflow-hidden">
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-stone-900 mb-2 line-clamp-2">{relatedProduct.name}</h3>
                  <p className="text-emerald-600 font-bold">₹{relatedProduct.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CSS Animation */}
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
