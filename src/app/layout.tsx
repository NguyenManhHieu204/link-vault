import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/toast"; // Giả định shadcn sinh ra toast, nếu không sẽ fix sau

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Link Vault - Bookmark Manager",
  description: "Lưu trữ và quản lý link web của bạn",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-background antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
