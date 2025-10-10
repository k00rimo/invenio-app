import { Outlet } from "react-router"
import Navbar from "./navbar/Navbar"
import Footer from "./Footer"

const RootLayout = () => {

  return (
    <div className="min-h-screen w-full bg-background antialiased">
      <Navbar />
      <main className="w-full flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default RootLayout
