"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginFormValues } from "@/lib/validators/loginSchema";
import { Separator } from "@/components/ui/separator";
import { loginUser } from "@/api/login";
import type { LoginPayload } from "@/types/mdpositTypes";
import { toast } from "sonner";
import { useAuth } from "@/hooks";


const LoginPage = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { login } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    console.log("Form submitted with:", data);

    const payload: LoginPayload = {
      next: "/",
      email: data.email,
      password: data.password,
    }
    try {
      await loginUser(payload);
      login();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.error("Incorrect email or password", {
        position: "top-center"
      })
    }
  }

  return (
    <div className="flex min-h-svh flex-col gap-6 mt-16 items-center justify-start">
      <div className="space-y-2">
        <h1 className="w-xs font-heading">Login</h1>
        <Separator />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-xs">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    variant={"deposition"}
                    type="email"
                    placeholder="m.curie@radium.edu"
                    autoComplete="email"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    variant={"deposition"}
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LoginPage;
