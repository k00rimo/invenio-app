import { cn } from "@/lib/utils"
import { ArrowUp } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"

type ScrollToTopProps = {
  className?: string
}

const ScrollToTop = ({ className }: ScrollToTopProps) => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <Button
      onClick={scrollToTop}
      aria-label="Jump to top"
      className={cn(
        "fixed bottom-6 right-6 z-50 rounded-full size-10 shadow-lg",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none",
        className
      )}
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  )
}

export default ScrollToTop
