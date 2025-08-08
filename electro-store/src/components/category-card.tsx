import * as React from "react"
import { Link } from "react-router-dom"

import { cn } from "@/lib/utils"

interface CategoryCardProps {
  category: {
    id: string
    name: string
    image: string
    description?: string
  }
  className?: string
}

export function CategoryCard({ category, className }: CategoryCardProps) {
  return (
    <Link 
      to={`/categories/${category.id}`}
      className={cn("group", className)}
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
  )
}