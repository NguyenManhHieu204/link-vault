import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import LogoutButton from "./LogoutButton";
import AddBookmarkForm from "./AddBookmarkForm";
import SearchFilter from "./SearchFilter";
import DeleteButton from "./DeleteButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Link as LinkIcon, Share2 } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ q?: string; tag?: string }> }) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) redirect("/login");

  // Ở Next.js 15+, searchParams là một Promise nên cần await
  const resolvedSearchParams = await searchParams;
  const q = resolvedSearchParams.q || "";
  const tagQuery = resolvedSearchParams.tag || "";

  // Query DB kết hợp Search (từ khóa) và Filter (theo Tag)
  const bookmarks = await prisma.bookmark.findMany({
    where: { 
      userId: session.user.id,
      ...(q ? {
        OR: [
          { title: { contains: q } },
          { url: { contains: q } },
          { description: { contains: q } }
        ]
      } : {}),
      ...(tagQuery ? {
        tags: { some: { tag: { name: tagQuery } } }
      } : {})
    },
    include: { tags: { include: { tag: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      <header className="flex justify-between items-center pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Link Vault</h1>
            <p className="text-sm text-zinc-400">Xin chào, {session.user.name || session.user.email}</p>
          </div>
        </div>
        <LogoutButton />
      </header>

      <main className="space-y-8">
        <section className="bg-zinc-900/40 p-6 rounded-xl border border-zinc-800">
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-zinc-400" />
            Lưu Bookmark mới
          </h2>
          <AddBookmarkForm />
        </section>

        <section>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h2 className="text-xl font-medium">Kho liên kết {tagQuery && <span className="text-primary">#{tagQuery}</span>} ({bookmarks.length})</h2>
            <SearchFilter />
          </div>
          
          {bookmarks.length === 0 ? (
            <div className="text-center py-16 text-zinc-500 bg-zinc-900/20 rounded-xl border border-dashed border-zinc-800">
              Không tìm thấy Bookmark nào.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.map(bm => (
                <Card key={bm.id} className="flex flex-col h-full bg-zinc-900/50 hover:bg-zinc-900 border-zinc-800 transition-colors relative group">
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition">
                    <DeleteButton id={bm.id} />
                  </div>
                  <CardHeader className="pb-3 flex-row gap-3 space-y-0 items-start pr-12">
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
                    
                    {/* Tags */}
                    {bm.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {bm.tags.map(t => (
                          <Link href={`/dashboard?tag=${t.tag.name}`} key={t.tag.id} className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded hover:bg-zinc-700">
                            #{t.tag.name}
                          </Link>
                        ))}
                      </div>
                    )}

                    {bm.image && (
                       <div className="w-full aspect-video rounded-md bg-zinc-950 mb-4 overflow-hidden border border-zinc-800">
                         <img src={bm.image} alt="thumbnail" className="w-full h-full object-cover" />
                       </div>
                    )}
                    
                    <div className="flex justify-between items-center mt-auto">
                      <a href={bm.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 text-sm font-medium flex items-center transition">
                        Truy cập <span className="ml-1">↗</span>
                      </a>
                      
                      {/* Nút Copy Link Chia sẻ Public */}
                      {bm.tags.length > 0 && (
                        <a 
                          href={`/share/${session.user.id}/${bm.tags[0].tag.name}`} 
                          target="_blank"
                          title="Chia sẻ Collection theo Tag đầu tiên"
                          className="text-zinc-500 hover:text-white p-1"
                        >
                          <Share2 className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
