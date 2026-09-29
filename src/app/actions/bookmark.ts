"use server";

import { prisma } from "@/lib/prisma";
import { fetchMetadata } from "@/lib/metadata";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function addBookmark(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Vui lòng đăng nhập" };

  let url = formData.get("url") as string;
  const tagsInput = formData.get("tags") as string;
  
  if (!url) return { error: "Vui lòng nhập URL" };
  if (!url.startsWith("http://") && !url.startsWith("https://")) url = "https://" + url;

  try {
    const metadata = await fetchMetadata(url);
    
    // Tách tag từ chuỗi người dùng nhập (phân cách bằng dấu phẩy)
    const tagNames = tagsInput 
        ? tagsInput.split(",").map(t => t.trim().toLowerCase()).filter(t => t.length > 0)
        : [];

    // Lưu Bookmark
    const bookmark = await prisma.bookmark.create({
      data: {
        url,
        title: metadata.title || url,
        description: metadata.description,
        image: metadata.image,
        favicon: metadata.favicon,
        userId: session.user.id,
        isPublic: true, // Bật Public để lát hỗ trợ chia sẻ
      },
    });

    // Tạo & Gắn Tag vào Bookmark
    if (tagNames.length > 0) {
      for (const tagName of tagNames) {
        const tag = await prisma.tag.upsert({
          where: { name_userId: { name: tagName, userId: session.user.id } },
          update: {},
          create: { name: tagName, userId: session.user.id },
        });
        
        await prisma.bookmarkTag.create({
          data: { bookmarkId: bookmark.id, tagId: tag.id }
        });
      }
    }

    revalidatePath("/dashboard");
    return { success: true, bookmark };
  } catch (error) {
    console.error("Lỗi:", error);
    return { error: "Có lỗi xảy ra khi lưu Bookmark" };
  }
}

export async function deleteBookmark(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Vui lòng đăng nhập" };

  try {
    await prisma.bookmark.delete({
      where: { id, userId: session.user.id },
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    return { error: "Không thể xóa bookmark" };
  }
}
