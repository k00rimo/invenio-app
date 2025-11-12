"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

import { useNavigate } from "react-router";

export default function DepositSuccessPage() {
  // --- 2. Initialize the hook ---
  const navigate = useNavigate();

  // --- 3. Create a simple handler function ---
  const handleReturnHome = () => {
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center mt-16">
      <Card className="w-full max-w-lg text-center shadow-lg">
        <CardHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle
              className="h-10 w-10 text-green-600 dark:text-green-400"
              aria-hidden="true"
            />
          </div>
          <CardTitle className="mt-4 text-2xl font-bold tracking-tight md:text-3xl">
            Deposition Submitted
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 pb-8">
          <Button className="mt-2" onClick={handleReturnHome}>
            Return to Homepage
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
