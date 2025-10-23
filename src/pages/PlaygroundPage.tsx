import { Button } from "@/components/ui/button";
import { TvIcon } from "lucide-react";
import React from "react";

const PlaygroundPage = () => {
  const [count, setCount] = React.useState(0);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-2 rounded-lg">
      <span className="h-10 ">...</span>
      <span className="text-2xl font-bold">{count}</span>
      <Button onClick={() => setCount((count) => count + 1)}>Click me primary</Button>
      <Button onClick={() => setCount((count) => count + 1)} size={"md"}>
        Click me
      </Button>
      <Button
        onClick={() => setCount((count) => count + 1)}
        size={"md"}
        leftIcon={<TvIcon />}
      >
        Click me
      </Button>
      <Button
        onClick={() => setCount((count) => count + 1)}
        size={"md"}
        rightIcon={<TvIcon />}
      >
        Click medium
      </Button>
      <Button
        onClick={() => setCount((count) => count + 1)}
        size={"sm"}
        rightIcon={<TvIcon />}
      >
        small
      </Button>
      <div className="bg-primary">
        <Button
          onClick={() => setCount((count) => count + 1)}
          size={"navbar"}
          variant={"navbar"}
        >
          Click me
        </Button>
      </div>
      <Button
        onClick={() => setCount((count) => count + 1)}
        variant={"secondary"}
      >
        Click me
      </Button>
      <Button
        onClick={() => setCount((count) => count + 1)}
        variant={"outline"}
        leftIcon={<TvIcon />}
      >
        Click me
      </Button>
      <Button
        onClick={() => setCount((count) => count + 1)}
        variant={"outline"}
        leftIcon={<TvIcon />}
        className="px-4 rounded-sm"
      >
        Click me
      </Button>
    </div>
  );
};

export default PlaygroundPage;
