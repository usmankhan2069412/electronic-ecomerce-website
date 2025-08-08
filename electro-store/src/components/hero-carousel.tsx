import * as React from "react"
import { Carousel, CarouselItem } from "@/components/ui/carousel"

interface HeroCarouselProps {
  children: React.ReactNode
  className?: string
  autoPlay?: boolean
  showDots?: boolean
  interval?: number
}

export function HeroCarousel({ 
  children, 
  className = "", 
  autoPlay = true, 
  showDots = true,
  interval = 5000 
}: HeroCarouselProps) {
  return (
    <Carousel 
      className={className}
      autoPlay={autoPlay}
      showDots={showDots}
      interval={interval}
    >
      {children}
    </Carousel>
  )
}