"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { links } from "@/app/lib/links";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { redirect } from "next/navigation";

interface SignUpFormData {
  email: string;
  password: string;
  repeatPassword: string;
}

const schema = z
  .object({
    email: z
      .string()
      .email("Please enter a valid email")
      .nonempty("Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    repeatPassword: z
      .string()
      .min(6, "Repeat password must be at least 6 characters long"),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords don't match",
    path: ["repeatPassword"],
  });

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  // Initialize the form using react-hook-form with zodResolver
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    mode:'onChange'
  });
  const [error, setError] = useState<"exist" | "success" | "failed">();
  // Handle form submission
  const onSubmit = async (data: any) => {
    const { email, password } = data;

    try {
      const response = await fetch(`${links.baseUrl}/api/createuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        console.log("error : ", response);
        // throw new Error("Sign up failed");
        const err = await response.json();
        if (err.statusKey) {
          setError(err.statusKey);
          if (err.statusKey == "exist") {
            redirect("/login");
          }
        }
        return null;
      }

      const result = await response.json();
      console.log("Signup successful:", result);
      // You can redirect the user or show a success message here
      redirect("/login");
    } catch (error) {
      console.error("Error during signup:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };
  const errorColor = {
    failed: { class: "", message: "User Creation failed." },
    success: { class: "", message: "User Created Successfully." },
    exist: { class: "", message: "User Exists." },
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">SignUp with fetch</CardTitle>
          <CardDescription>
            Enter your email below to signup for a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  {...register("email")}
                  type="email"
                  placeholder="m@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  {...register("password")}
                  type="password"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="repeat-password">Repeat password</Label>
                </div>
                <Input
                  id="repeat-password"
                  {...register("repeatPassword")}
                  type="password"
                />
                {errors.repeatPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.repeatPassword.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full">
                Signup
              </Button>
              <Link prefetch={false} href={"/login"}>
                <Button variant="outline" className="w-full">
                  Do you have an account? Sign in
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
      {error  && (
        <div
          className={`${errorColor[error].class} bg-blue-200 rounded-xl p-2 text-gray-800`}
        >
          {errorColor[error].message}
        </div>
      )}
    </div>
  );
}
