import { Outlet } from "react-router";
import Navbar from "./navbar/Navbar";
import Footer from "./Footer";
import { Toaster } from "@/components/ui/sonner";

const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col w-full bg-background antialiased">
      <Toaster />
      <Navbar />
      <main className="w-full flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
