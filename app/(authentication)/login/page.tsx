// import { LoginForm } from "@/components/login-form";
import { LoginForm } from "@/components/nextauthlogin";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getServerSession();
  console.log(user?.user);
  if (user?.user) {
    redirect("/dashboard");
  }
  return <LoginForm/>
  // return <LoginForm />;
}
