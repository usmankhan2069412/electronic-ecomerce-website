import * as React from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Star } from "lucide-react"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Product } from "@/lib/data"

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  return (
    <Card className={`overflow-hidden group ${className}`}>
      <div className="aspect-square overflow-hidden relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
        />
        {product.isNew && (
          <Badge variant="new" className="absolute top-2 left-2">
            NEW
          </Badge>
        )}
        {product.discountPrice && (
          <Badge variant="sale" className="absolute top-2 right-2">
            SALE
          </Badge>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link to={`/products/${product.id}`}>
            <Button variant="gradient" size="sm" className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              View Details
            </Button>
          </Link>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center space-x-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({product.rating})</span>
        </div>
        <h3 className="font-medium text-base mb-1 line-clamp-1">{product.name}</h3>
        <div className="flex items-center space-x-2">
          {product.discountPrice ? (
            <>
              <span className="font-bold">${product.discountPrice.toFixed(2)}</span>
              <span className="text-sm text-muted-foreground line-through">${product.price.toFixed(2)}</span>
            </>
          ) : (
            <span className="font-bold">${product.price.toFixed(2)}</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button variant="outline" size="sm" className="w-full">
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
