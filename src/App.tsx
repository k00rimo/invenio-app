import { useState } from "react";
import "./App.css";
import { Button } from "./components/ui/button";
import { TvIcon } from "lucide-react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-2 rounded-lg">
        <span className="h-10 ">...</span>
        <span className="text-2xl font-bold">{count}</span>
        <Button onClick={() => setCount((count) => count + 1)}>Click me</Button>
        <Button onClick={() => setCount((count) => count + 1)} size={"md"}>Click me</Button>
        <Button onClick={() => setCount((count) => count + 1)} size={"md"} leftIcon={<TvIcon />}>Click me</Button>
        <Button onClick={() => setCount((count) => count + 1)} size={"md"} rightIcon={<TvIcon />}>Click me</Button>
        <div className="bg-primary">
          <Button onClick={() => setCount((count) => count + 1)} size={"navbar"} variant={"navbar"}>Click me</Button>
        </div>
        <Button onClick={() => setCount((count) => count + 1)} variant={"secondary"}>Click me</Button>
      </div>
    </>
  );
}

export default App;
