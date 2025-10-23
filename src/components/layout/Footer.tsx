import { cn } from "@/lib/utils"
import euFlag from '@/assets/images/european-union.png';

type FooterProps = {
  className?: string
}

const Footer = ({ className }: FooterProps) => {
  
  return (
    <footer className={cn("bg-primary-light flex items-center gap-32 px-12 py-5 border-t border-gray-dark", className)}>
      <div className="flex items-center gap-8">
        <img
          src={euFlag}
          alt="Flag of the European Union"
          className="h-[50px] w-auto"
        />
        <p className="text-[#003399] max-w-40 font-body-small">Co-funded by the European Union</p>
      </div>
    </footer>
  )
}

export default Footer
