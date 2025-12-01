import { Link } from "react-router"
import { Button } from "../../ui/button"
import { UserIcon } from "lucide-react"
import SiteLogoIcon from "../../icons/LogoIcon"
import LanguageChanger from "./LanguageChanger"
import { useAuth } from "@/hooks"

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();

  return (
    <nav className="bg-primary flex items-center justify-between px-5 py-4">
      <Link to={"/"}>
        <SiteLogoIcon width={130} height={50} />
      </Link>
      <div className="flex items-center gap-6 px-4">
        <Link to={"/community"} className="hidden md:block">
          <Button variant={"navbar"} size={"navbar"}>
            Communities
          </Button>
        </Link>
        {isLoggedIn ? (
          <Button
            variant={"navbar"}
            size={"navbar"}
            leftIcon={
              <UserIcon
                className="min-h-6 min-w-6"
              />
            }
            className="hidden md:flex"
            onClick={logout}
            >
              Logout
          </Button>
        ) :
        (
          <Link to={"/login"} className="hidden md:block">
            <Button
              variant={"navbar"}
              size={"navbar"}
              leftIcon={
                <UserIcon
                  className="min-h-6 min-w-6"
                />
              }
              className="hidden md:flex"
              >
                Login
            </Button>
          </Link>
        )}
        <LanguageChanger />
      </div>
    </nav>
  )
}

export default Navbar
