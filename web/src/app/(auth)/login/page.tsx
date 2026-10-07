import * as React from "react";
import { LoginForm } from "@/components/screens/auth/login-form";

export const metadata = {
  title: "Login | HigherStudy",
  description: "Log in to continue your higher studies journey.",
};

export default function LoginPage() {
  return <LoginForm isModal={false} />;
}
