import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Link as LinkIcon } from "lucide-react";
import Link from "next/link";

// Ở Next.js 15+, params là một Promise nên cần await
export default async function PublicSharePage({ params }: { params: Promise<{ userId: string, tag: string }> }) {
  const resolvedParams = await params;
  const decodedTag = decodeURIComponent(resolvedParams.tag);
  
  // Lấy dữ liệu công khai của User theo Tag
  const bookmarks = await prisma.bookmark.findMany({
    where: { 
      userId: resolvedParams.userId,
      isPublic: true,
      tags: { some: { tag: { name: decodedTag } } }
    },
    include: { tags: { include: { tag: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 min-h-screen bg-background">
      <header className="flex justify-between items-center pb-4 border-b border-zinc-800 text-center flex-col gap-2">
        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary mx-auto mb-2">
          <Globe className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold">Public Collection: #{decodedTag}</h1>
        <p className="text-zinc-500 text-sm">
          Được chia sẻ công khai bởi người dùng (ID: <span className="font-mono text-xs">{resolvedParams.userId.split("-")[0]}</span>)
        </p>
      </header>

      {bookmarks.length === 0 ? (
        <div className="text-center py-16 text-zinc-500 bg-zinc-900/20 rounded-xl border border-dashed border-zinc-800">
          Bộ sưu tập này không tồn tại hoặc chưa có liên kết nào được chia sẻ.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map(bm => (
            <Card key={bm.id} className="flex flex-col h-full bg-zinc-900/50 border-zinc-800 relative">
              <CardHeader className="pb-3 flex-row gap-3 space-y-0 items-start">
                {bm.favicon ? (
                  <img src={bm.favicon} alt="icon" className="w-8 h-8 rounded bg-white p-0.5 mt-1" />
                ) : (
                  <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center shrink-0 mt-1">
                    <Globe className="w-4 h-4 text-zinc-500" />
                  </div>
                )}
                <div className="flex-1 overflow-hidden">
                  <CardTitle className="text-base leading-tight line-clamp-2" title={bm.title || bm.url}>
                    {bm.title || bm.url}
                  </CardTitle>
                  <CardDescription className="mt-1 truncate" title={bm.url}>
                    {new URL(bm.url).hostname}
                  </CardDescription>
                </div>
              </CardHeader>
              
              <CardContent className="flex flex-col flex-1 pb-4">
                <p className="text-sm text-zinc-400 line-clamp-2 mb-3 flex-1">
                  {bm.description || "Không có mô tả"}
                </p>
                
                {bm.image && (
                   <div className="w-full aspect-video rounded-md bg-zinc-950 mb-4 overflow-hidden border border-zinc-800">
                     <img src={bm.image} alt="thumbnail" className="w-full h-full object-cover" />
                   </div>
                )}
                
                <a href={bm.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 text-sm font-medium mt-auto flex items-center transition">
                  Truy cập liên kết <span className="ml-1">↗</span>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <div className="text-center text-sm text-zinc-600 pt-8 pb-4">
        Powered by <Link href="/" className="hover:text-primary transition">Link Vault</Link>
      </div>
    </div>
  );
}
