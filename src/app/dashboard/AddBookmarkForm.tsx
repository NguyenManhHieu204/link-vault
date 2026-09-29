"use client";
import { useState, useRef } from "react";
import { addBookmark } from "@/app/actions/bookmark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Loader2 } from "lucide-react";

export default function AddBookmarkForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    
    const res = await addBookmark(formData);
    
    if (res?.error) {
      setError(res.error);
    } else {
      formRef.current?.reset(); 
    }
    
    setLoading(false);
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col md:flex-row gap-3">
        <Input 
          name="url" 
          type="text" 
          placeholder="Dán đường link (URL) vào đây..." 
          required 
          disabled={loading}
          className="flex-2 bg-zinc-950"
        />
        <Input 
          name="tags" 
          type="text" 
          placeholder="Tags (cách nhau dấu phẩy, vd: react, tech)..." 
          disabled={loading}
          className="flex-1 bg-zinc-950"
        />
        <Button type="submit" disabled={loading} className="min-w-[140px]">
          {loading ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang lấy data...</>
          ) : (
            <><Plus className="w-4 h-4 mr-2" /> Thêm Link</>
          )}
        </Button>
      </div>
      {error && <p className="text-red-500 text-sm ml-1">{error}</p>}
    </form>
  );
}
