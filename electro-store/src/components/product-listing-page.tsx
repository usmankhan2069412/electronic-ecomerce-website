import * as React from "react"
import { useState, useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { Filter, SlidersHorizontal, ChevronDown, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { productApi } from "@/services/api"

export function ProductListingPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  
  // Get filter values from URL
  const categoryFilter = searchParams.get('category') || 'all'
  const sortBy = searchParams.get('sort') || 'featured'
  const priceRange = searchParams.get('price') || 'all'
  
  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(false)
        
        // Fetch products with filters
        const filters = {}
        if (categoryFilter !== 'all') {
          filters.category = categoryFilter
        }
        
        const productsResponse = await productApi.getProducts(filters)
        setProducts(productsResponse.products)
        
        // Fetch categories
        const categoriesResponse = await productApi.getCategories()
        setCategories(categoriesResponse.categories)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [categoryFilter])
  
  // Filter products based on criteria
  const filteredProducts = React.useMemo(() => {
    if (loading || error) return []
    
    let result = [...products]
    
    // Filter by price range
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number)
      result = result.filter(product => {
        const price = product.discountPrice || product.price
        if (!max) return price >= min
        return price >= min && price <= max
      })
    }
    
    // Sort products
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price))
        break
      case 'price-high':
        result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price))
        break
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'featured':
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
        break
    }
    
    return result
  }, [products, categoryFilter, sortBy, priceRange, loading, error])
  
  // Update filters
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set(key, value)
    setSearchParams(params)
  }
  
  // Clear all filters
  const clearFilters = () => {
    setSearchParams({})
  }
  
  // Check if any filters are active
  const hasActiveFilters = categoryFilter !== 'all' || priceRange !== 'all' || sortBy !== 'featured'
  
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">All Products</h1>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="ml-1 flex h-2 w-2 rounded-full bg-primary"></span>
              )}
            </Button>
            
            <div className="relative">
              <select
                className="appearance-none bg-white border rounded-md px-4 py-2 pr-8 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                value={sortBy}
                onChange={(e) => updateFilter('sort', e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-gray-500" />
            </div>
          </div>
        </div>
        
        {/* Filter Panel */}
        {isFilterOpen && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8 animate-in slide-in-from-top duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <SlidersHorizontal className="h-5 w-5 mr-2" />
                Filter Products
              </h2>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsFilterOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Filter */}
              <div>
                <h3 className="font-medium mb-3">Category</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      id="category-all" 
                      name="category"
                      className="h-4 w-4 text-primary"
                      checked={categoryFilter === 'all'}
                      onChange={() => updateFilter('category', 'all')}
                    />
                    <label htmlFor="category-all" className="ml-2 text-sm">All Categories</label>
                  </div>
                  
                  {categories.map(category => (
                    <div key={category.id} className="flex items-center">
                      <input 
                        type="radio" 
                        id={`category-${category.id}`} 
                        name="category"
                        className="h-4 w-4 text-primary"
                        checked={categoryFilter === category.id}
                        onChange={() => updateFilter('category', category.id)}
                      />
                      <label htmlFor={`category-${category.id}`} className="ml-2 text-sm">{category.name}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Price Range Filter */}
              <div>
                <h3 className="font-medium mb-3">Price Range</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      id="price-all" 
                      name="price"
                      className="h-4 w-4 text-primary"
                      checked={priceRange === 'all'}
                      onChange={() => updateFilter('price', 'all')}
                    />
                    <label htmlFor="price-all" className="ml-2 text-sm">All Prices</label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      id="price-0-100" 
                      name="price"
                      className="h-4 w-4 text-primary"
                      checked={priceRange === '0-100'}
                      onChange={() => updateFilter('price', '0-100')}
                    />
                    <label htmlFor="price-0-100" className="ml-2 text-sm">Under $100</label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      id="price-100-200" 
                      name="price"
                      className="h-4 w-4 text-primary"
                      checked={priceRange === '100-200'}
                      onChange={() => updateFilter('price', '100-200')}
                    />
                    <label htmlFor="price-100-200" className="ml-2 text-sm">$100 - $200</label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      id="price-200-500" 
                      name="price"
                      className="h-4 w-4 text-primary"
                      checked={priceRange === '200-500'}
                      onChange={() => updateFilter('price', '200-500')}
                    />
                    <label htmlFor="price-200-500" className="ml-2 text-sm">$200 - $500</label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      id="price-500" 
                      name="price"
                      className="h-4 w-4 text-primary"
                      checked={priceRange === '500-'}
                      onChange={() => updateFilter('price', '500-')}
                    />
                    <label htmlFor="price-500" className="ml-2 text-sm">$500 & Above</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            {categoryFilter !== 'all' && (
              <div className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center">
                Category: {categories.find(c => c.id === categoryFilter)?.name}
                <button 
                  className="ml-2 text-gray-500 hover:text-gray-700"
                  onClick={() => updateFilter('category', 'all')}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            
            {priceRange !== 'all' && (
              <div className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center">
                Price: {
                  priceRange === '0-100' ? 'Under $100' :
                  priceRange === '100-200' ? '$100 - $200' :
                  priceRange === '200-500' ? '$200 - $500' :
                  priceRange === '500-' ? '$500 & Above' : ''
                }
                <button 
                  className="ml-2 text-gray-500 hover:text-gray-700"
                  onClick={() => updateFilter('price', 'all')}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            
            {sortBy !== 'featured' && (
              <div className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center">
                Sort: {
                  sortBy === 'price-low' ? 'Price: Low to High' :
                  sortBy === 'price-high' ? 'Price: High to Low' :
                  sortBy === 'newest' ? 'Newest' :
                  sortBy === 'rating' ? 'Top Rated' : ''
                }
                <button 
                  className="ml-2 text-gray-500 hover:text-gray-700"
                  onClick={() => updateFilter('sort', 'featured')}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-lg h-80 animate-pulse">
                <div className="bg-gray-200 h-48 rounded-t-lg"></div>
                <div className="p-4 space-y-3">
                  <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                  <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                  <div className="bg-gray-200 h-4 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-xl font-medium mb-2">Error loading products</h2>
            <p className="text-gray-600 mb-4">There was a problem fetching the products. Please try again later.</p>
            <Button onClick={() => window.location.reload()}>Refresh Page</Button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-xl font-medium mb-2">No products found</h2>
            <p className="text-gray-600 mb-4">Try adjusting your filters to find what you're looking for.</p>
            <Button onClick={clearFilters}>Clear All Filters</Button>
          </div>
        ) : (
          <>
            <p className="mb-6 text-gray-600">{filteredProducts.length} products found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
