import * as React from "react"
import { Link } from "react-router-dom"
import { ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Carousel, CarouselItem } from "@/components/ui/carousel"
import { ProductCard } from "@/components/product-card"
import { categories, featuredProducts, newProducts } from "@/lib/data"

export function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-16">
        <div className="container px-4 mx-auto">
          <Carousel className="h-[400px] md:h-[500px] mb-12" autoPlay showDots>
            <CarouselItem>
              <div className="relative h-full w-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-10"></div>
                <div className="relative h-full flex flex-col justify-center p-8 md:p-12">
                  <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 animate-fade-up animate-once animate-duration-[800ms] animate-delay-100">
                    Next-Gen Smartphones
                  </h1>
                  <p className="text-white/90 text-lg md:text-xl max-w-md mb-8 animate-fade-up animate-once animate-duration-[800ms] animate-delay-200">
                    Experience the future with our latest collection of cutting-edge smartphones.
                  </p>
                  <div className="animate-fade-up animate-once animate-duration-[800ms] animate-delay-300">
                    <Button size="lg" variant="default" className="bg-white text-blue-600 hover:bg-white/90">
                      Shop Now
                    </Button>
                  </div>
                </div>
                <div className="hidden md:block absolute right-0 bottom-0 w-1/2 h-full">
                  <div className="relative h-full w-full">
                    <img 
                      src="/images/hero-smartphone.png" 
                      alt="Smartphone" 
                      className="absolute bottom-0 right-12 h-[90%] object-contain animate-float"
                    />
                  </div>
                </div>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="relative h-full w-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-10"></div>
                <div className="relative h-full flex flex-col justify-center p-8 md:p-12">
                  <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 animate-fade-up animate-once animate-duration-[800ms] animate-delay-100">
                    Premium Audio Experience
                  </h1>
                  <p className="text-white/90 text-lg md:text-xl max-w-md mb-8 animate-fade-up animate-once animate-duration-[800ms] animate-delay-200">
                    Immerse yourself in crystal clear sound with our wireless earbuds collection.
                  </p>
                  <div className="animate-fade-up animate-once animate-duration-[800ms] animate-delay-300">
                    <Button size="lg" variant="default" className="bg-white text-purple-600 hover:bg-white/90">
                      Explore Audio
                    </Button>
                  </div>
                </div>
                <div className="hidden md:block absolute right-0 bottom-0 w-1/2 h-full">
                  <div className="relative h-full w-full">
                    <img 
                      src="/images/hero-earbuds.png" 
                      alt="Wireless Earbuds" 
                      className="absolute bottom-0 right-12 h-[80%] object-contain animate-float"
                    />
                  </div>
                </div>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="relative h-full w-full bg-gradient-to-r from-green-600 to-teal-600 rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-10"></div>
                <div className="relative h-full flex flex-col justify-center p-8 md:p-12">
                  <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 animate-fade-up animate-once animate-duration-[800ms] animate-delay-100">
                    Smart Wearables
                  </h1>
                  <p className="text-white/90 text-lg md:text-xl max-w-md mb-8 animate-fade-up animate-once animate-duration-[800ms] animate-delay-200">
                    Track your fitness and stay connected with our latest smartwatches.
                  </p>
                  <div className="animate-fade-up animate-once animate-duration-[800ms] animate-delay-300">
                    <Button size="lg" variant="default" className="bg-white text-green-600 hover:bg-white/90">
                      View Collection
                    </Button>
                  </div>
                </div>
                <div className="hidden md:block absolute right-0 bottom-0 w-1/2 h-full">
                  <div className="relative h-full w-full">
                    <img 
                      src="/images/hero-watch.png" 
                      alt="Smartwatch" 
                      className="absolute bottom-0 right-12 h-[80%] object-contain animate-float"
                    />
                  </div>
                </div>
              </div>
            </CarouselItem>
          </Carousel>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Shop by Category</h2>
            <Link to="/categories" className="text-primary flex items-center hover:underline">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                to={`/categories/${category.id}`}
                className="group"
              >
                <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
                  <div className="aspect-square relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <h3 className="absolute bottom-3 left-3 right-3 text-white font-medium z-20">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
            <Link to="/products" className="text-primary flex items-center hover:underline">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-12 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">New Arrivals</h2>
            <Link to="/products?filter=new" className="text-primary flex items-center hover:underline">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Promotion Banner */}
      <section className="py-12">
        <div className="container px-4 mx-auto">
          <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600">
            <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-10"></div>
            <div className="relative py-12 px-8 md:py-16 md:px-12 flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
                  Summer Sale is On!
                </h2>
                <p className="text-white/90 text-lg max-w-md mb-6">
                  Get up to 40% off on selected items. Limited time offer.
                </p>
                <Button size="lg" variant="default" className="bg-white text-blue-600 hover:bg-white/90">
                  Shop the Sale
                </Button>
              </div>
              <div className="md:w-1/2 flex justify-center md:justify-end">
                <img 
                  src="/images/sale-devices.png" 
                  alt="Sale Devices" 
                  className="max-h-[300px] object-contain animate-float"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free shipping on all orders over $50</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure Payments</h3>
              <p className="text-gray-600">100% secure payment processing</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Easy Returns</h3>
              <p className="text-gray-600">30-day money-back guarantee</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
