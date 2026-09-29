"use client";
import { deleteBookmark } from "@/app/actions/bookmark";
import { Trash2 } from "lucide-react";

export default function DeleteButton({ id }: { id: string }) {
  return (
    <button 
      onClick={() => {
        if(confirm("Bạn có chắc muốn xoá Bookmark này?")) {
          deleteBookmark(id);
        }
      }}
      className="p-1.5 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-md transition"
      title="Xóa Bookmark"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
