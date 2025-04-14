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
import { Login, SignUp } from "@/app/lib/LoginAction";
import Link from "next/link";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">SignUp with ServerAction</CardTitle>
          <CardDescription>
            Enter your email below to signup new Acount account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={SignUp}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" name="password" type="password" required />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="repeat-password">Repeat password</Label>
                </div>
                <Input id="repeat-password" name="repeat-password" type="password" required />
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
    </div>
  );
}
