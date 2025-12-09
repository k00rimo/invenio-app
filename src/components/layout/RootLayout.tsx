import { Outlet } from "react-router";
import Navbar from "./navbar/Navbar";
import Footer from "./Footer";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/authContext";

const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col w-full bg-background antialiased">
      <Toaster />
      <AuthProvider>
        <Navbar />
        <main className="w-full flex-1 flex flex-col">
          <Outlet />
        </main>
      </AuthProvider>
      <Footer />
    </div>
  );
};

export default RootLayout;
