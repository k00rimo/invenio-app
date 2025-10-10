import { Link } from "react-router"
import { Button } from "../../ui/button"
import { Separator } from "../../ui/separator"
import { UserIcon } from "lucide-react"
import SiteLogoIcon from "../../icons/LogoIcon"
import LanguageChanger from "./LanguageChanger"

const Navbar = () => {

  return (
    <nav className="bg-primary flex items-center justify-between px-5">
      <Link to={"/"}>
        <SiteLogoIcon width={180} height={90} />
      </Link>
      <div className="flex items-center gap-8 px-4">
        <Button variant={"navbar"} size={"navbar"}>Community</Button>
        <Button variant={"navbar"} size={"navbar"}>Documentation</Button>
        <Separator orientation={"vertical"} decorative={false} className="min-h-[40px] m-0.5 border-[1px] bg-white" />
        <Button variant={"navbar"} size={"navbar"} leftIcon={<UserIcon className="min-h-6 min-w-6" />} >Login</Button>
        <LanguageChanger />
      </div>
    </nav>
  )
}

export default Navbar
