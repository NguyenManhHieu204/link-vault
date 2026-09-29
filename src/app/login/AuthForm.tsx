"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthForm() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    try {
      if (isLogin) {
        const res = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        
        if (res?.error) {
          setError("Sai email hoặc mật khẩu");
        } else {
          router.push("/dashboard");
          router.refresh();
        }
      } else {
        // Đăng ký
        const res = await fetch("/api/auth/register", {
          method: "POST",
          body: JSON.stringify({ email, password, name }),
          headers: { "Content-Type": "application/json" }
        });
        const data = await res.json();
        
        if (!res.ok) {
          setError(data.message || "Lỗi đăng ký");
        } else {
          // Thành công thì tự động đăng nhập luôn
          await signIn("credentials", { email, password, redirect: false });
          router.push("/dashboard");
          router.refresh();
        }
      }
    } catch (err) {
      setError("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          {isLogin ? "Đăng nhập Link Vault" : "Tạo tài khoản mới"}
        </CardTitle>
        <CardDescription className="text-center">
          Lưu trữ và quản lý bookmark của bạn
        </CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          {error && (
             <div className="p-3 text-sm text-red-500 bg-red-100/10 border border-red-500/20 rounded-md">
               {error}
             </div>
          )}
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Họ và tên</Label>
              <Input id="name" name="name" placeholder="Nguyễn Văn A" required={!isLogin} />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="email@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input id="password" name="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Đang xử lý..." : isLogin ? "Đăng nhập" : "Đăng ký"}
          </Button>
          <div className="text-sm text-center text-zinc-500">
            {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-white hover:underline"
            >
              {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
            </button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
