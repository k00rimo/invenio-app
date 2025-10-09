// import { useState } from "react";
// import { Button } from "./components/ui/button";
// import { TvIcon } from "lucide-react";

import { Outlet } from "react-router";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  // const [count, setCount] = useState(0);

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

export default App;
