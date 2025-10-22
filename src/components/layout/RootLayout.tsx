import { Outlet } from "react-router";
import Navbar from "./navbar/Navbar";
import Footer from "./Footer";

const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col w-full bg-background antialiased">
      <Navbar />
      <main className="w-full flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
