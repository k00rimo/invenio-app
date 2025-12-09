import { cn, scrollToTop } from "@/lib/utils"
import { ArrowUp } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"

type ScrollToTopProps = {
  className?: string
  threshold?: number
}

const ScrollToTop = ({
  className,
  threshold = 200
}: ScrollToTopProps) => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > threshold)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [threshold])  

  return (
    <Button
      onClick={scrollToTop}
      aria-label="Jump to top"
      size="icon"
      type="button"
      className={cn(
        "bg-primary text-background rounded-full size-10 shadow-md transition-all duration-300 ease-in-out",
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none",
        className
      )}
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  )
}

export default ScrollToTop
