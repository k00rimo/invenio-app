import { Link } from "react-router"
import { Button } from "../../ui/button"
import { UserIcon } from "lucide-react"
import SiteLogoIcon from "../../icons/LogoIcon"
import LanguageChanger from "./LanguageChanger"

const Navbar = () => {

  return (
    <nav className="bg-primary flex items-center justify-between px-5 py-4">
      <Link to={"/"}>
        <SiteLogoIcon width={130} height={50} />
      </Link>
      <div className="flex items-center gap-6 px-4">
        <Link to={"/community"}>
          <Button variant={"navbar"} size={"navbar"}>
            Communities
          </Button>
        </Link>
        <Button variant={"navbar"} size={"navbar"} leftIcon={<UserIcon className="min-h-6 min-w-6" />} >Login</Button>
        <LanguageChanger />
      </div>
    </nav>
  )
}

export default Navbar
