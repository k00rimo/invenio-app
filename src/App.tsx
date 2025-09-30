import { useState } from "react";
import "./App.css";
import { Button } from "./components/ui/button";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="flex min-h-svh flex-col items-center justify-center gap-4">
        <span className="text-2xl font-bold">{count}</span>
        <Button onClick={() => setCount((count) => count + 1)}>Click me</Button>
      </div>
    </>
  );
}

export default App;
