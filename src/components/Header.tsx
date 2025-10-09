import React from "react";
import { Button } from "./ui/button";
import { User } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const LanguageSelector = () => {
  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Select Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="es">Spanish</SelectItem>
        <SelectItem value="fr">French</SelectItem>
      </SelectContent>
    </Select>
  );
};

const Header = () => {
  return (
    <header className="w-full h-32 flex items-center justify-between border-b-1 border-gray-400 px-8 py-4">
      <div className="flex items-center">
        {/* TODO: Provide an actual logo */}
        <div className="bg-gradient-to-br from-gray-300 to-transparent w-20 h-20 flex items-center justify-center rounded-full" />
        <span className="text-3xl font-medium relative right-14">MDRepo</span>
      </div>
      <div className="flex items-center">
        <div className="flex gap-4 border-r-2 border-black pr-4">
          <Button variant="ghost" size="navbar" className="font-semibold">
            Community
          </Button>
          <Button variant="ghost" size="navbar" className="font-semibold">
            Documentation
          </Button>
        </div>
        <div className="flex pl-4 items-center gap-4">
          <Button variant="ghost" size="navbar" className="font-semibold gap-1">
            <User className="size-5" />
            Login
          </Button>
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
};

export default Header;
