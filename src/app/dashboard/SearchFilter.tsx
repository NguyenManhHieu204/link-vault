"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useTransition } from "react";

export default function SearchFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    
    if (val) {
      params.set("q", val);
    } else {
      params.delete("q");
    }

    startTransition(() => {
      router.replace(`/dashboard?${params.toString()}`);
    });
  }

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
      <Input 
        defaultValue={searchParams.get("q") || ""}
        onChange={handleSearch}
        placeholder="Tìm kiếm tiêu đề, url..." 
        className="pl-9 bg-zinc-950" 
      />
    </div>
  );
}
