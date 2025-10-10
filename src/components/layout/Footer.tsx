import { cn } from "@/lib/utils"
import euFlag from '@/assets/images/european-union.png';
import { Link } from "react-router";

type FooterProps = {
  className?: string
}

const Footer = ({ className }: FooterProps) => {
  
  return (
    <footer className={cn("bg-primary-light flex items-center gap-32 px-12 py-5", className)}>
      <div className="flex items-center gap-8">
        <img
          src={euFlag}
          alt="Flag of the European Union"
          className="h-[100px] w-auto"
        />
        <p className="text-[#003399] max-w-40">Co-funded by the European Union</p>
      </div>
      
      <div className="flex flex-col gap-2.5">
        <Link to={"/contacts"}>
          Contacts
        </Link>

        <Link to={"/documentation"}>
          Documentation
        </Link>
      </div>
    </footer>
  )
}

export default Footer
