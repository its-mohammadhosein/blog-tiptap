import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getServerSession();
    console.log(user?.user);
    if (user?.user) {
      redirect("/dashboard");
    }
  return (
    <div className="grid items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* <LoginForm /> */}
    </div>
  );
}
