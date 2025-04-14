"use server";

import { redirect } from "next/navigation";
import { Prisma } from "./Prisma";
import { authOptions } from "../api/auth/[...nextauth]/_authLib/AuthOption";
import bcrypt from "bcrypt";
import { headers } from "next/headers";
import { signIn } from "next-auth/react";
export async function Login(formData: FormData) {
  // Extract form data
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const csrf = formData.get("csrf") as string;

  // Perform your login logic here
  // For example, validate the credentials, authenticate the user, etc.
  console.log(email, password, csrf);
  const user = await Prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  if (!user) {
    console.log("user NotFound");
    redirect(authOptions.pages.signIn);
  }
  const compair = await bcrypt.compare(password, user.password);
  if (!compair) {
    console.log("wrong password");
    redirect("/login");
  }
  
  // If login is successful, redirect to the dashboard or home page
  //   redirect('/dashboard');

  // If login fails, you can return an error message or handle it accordingly
}

export async function SignUp(formData: FormData) {
  // Extract form data
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const repeatPassword = formData.get("repeat-password") as string;

  // Perform your login logic here
  // For example, validate the credentials, authenticate the user, etc.
  console.log(email, password, repeatPassword);

  // If login is successful, redirect to the dashboard or home page
  //   redirect('/dashboard');

  // If login fails, you can return an error message or handle it accordingly
}
