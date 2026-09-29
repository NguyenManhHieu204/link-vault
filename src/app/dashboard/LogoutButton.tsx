"use client";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/login" })}>
      <LogOut className="w-4 h-4 mr-2" />
      Đăng xuất
    </Button>
  );
}
