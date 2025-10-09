import React from "react";
import flag from "@/assets/eu-flag.svg";
import { Button } from "./ui/button";

const Footer = () => {
  return (
    <footer className="w-full h-32 flex items-center justify-between border-t-1 border-gray-400 bg-gray-100 px-8 py-4">
      <div className="flex items-center gap-8">
        <img src={flag} alt="EU Flag" className="w-24 h-24 object-cover" />
        <span className="text-primary w-50">
          Co-founded by the European Union
        </span>
      </div>
      <div className="flex items-center justify-between w-[75%]">
        <div className="flex flex-col items-start">
          <Button variant="link" size="md" className="text-black p-0">
            Contacts
          </Button>
          <Button variant="link" size="md" className="text-black p-0">
            Documentation
          </Button>
        </div>
        <span>© 2023 MDRepo. All rights reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;
