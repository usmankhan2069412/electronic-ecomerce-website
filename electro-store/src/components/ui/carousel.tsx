import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    children: React.ReactNode
    showArrows?: boolean
    showDots?: boolean
    autoPlay?: boolean
    interval?: number
  }
>(({ className, children, showArrows = true, showDots = true, autoPlay = false, interval = 5000, ...props }, ref) => {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [sliding, setSliding] = React.useState(false)
  const childrenArray = React.Children.toArray(children)
  
  const goToIndex = (index: number) => {
    if (sliding) return
    setSliding(true)
    setActiveIndex(index)
    setTimeout(() => {
      setSliding(false)
    }, 500)
  }

  const goToPrevious = () => {
    const newIndex = activeIndex === 0 ? childrenArray.length - 1 : activeIndex - 1
    goToIndex(newIndex)
  }

  const goToNext = () => {
    const newIndex = activeIndex === childrenArray.length - 1 ? 0 : activeIndex + 1
    goToIndex(newIndex)
  }

  React.useEffect(() => {
    if (autoPlay) {
      const slideInterval = setInterval(() => {
        goToNext()
      }, interval)
      return () => clearInterval(slideInterval)
    }
  }, [activeIndex, autoPlay, interval])

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden rounded-lg", className)}
      {...props}
    >
      <div 
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {childrenArray.map((child, index) => (
          <div key={index} className="w-full flex-shrink-0">
            {child}
          </div>
        ))}
      </div>
      
      {showArrows && (
        <>
          <button 
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/50"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button 
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/50"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}
      
      {showDots && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
          {childrenArray.map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={cn(
                "h-2 w-2 rounded-full transition-all",
                index === activeIndex 
                  ? "bg-white w-4" 
                  : "bg-white/50 hover:bg-white/80"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
})
Carousel.displayName = "Carousel"

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative h-full w-full", className)}
    {...props}
  />
))
CarouselItem.displayName = "CarouselItem"

export { Carousel, CarouselItem }
