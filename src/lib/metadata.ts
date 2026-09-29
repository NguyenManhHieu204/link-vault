import * as cheerio from "cheerio";

export interface URLMetadata {
  title: string | null;
  description: string | null;
  image: string | null;
  favicon: string | null;
}

export async function fetchMetadata(url: string): Promise<URLMetadata> {
  try {
    // 1. Thiết lập Timeout (5 giây) để không làm treo server nếu web load quá chậm
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    // 2. Đóng giả trình duyệt (User-Agent) để tránh bị chặn bởi các cơ chế chống bot
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    // Nếu không phải file HTML (ví dụ link ảnh, link pdf), bỏ qua việc cào dữ liệu
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("text/html")) {
      return { title: null, description: null, image: null, favicon: null };
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Hàm tiện ích lấy content của meta tag
    const getMetaTag = (name: string) => {
      return (
        $(`meta[property="${name}"]`).attr("content") ||
        $(`meta[name="${name}"]`).attr("content") ||
        null
      );
    };

    // 3. Bóc tách dữ liệu
    const title = getMetaTag("og:title") || getMetaTag("twitter:title") || $("title").text() || null;
    const description = getMetaTag("og:description") || getMetaTag("description") || null;
    const image = getMetaTag("og:image") || getMetaTag("twitter:image") || null;

    let favicon =
      $('link[rel="icon"]').attr("href") ||
      $('link[rel="shortcut icon"]').attr("href") ||
      $('link[rel="apple-touch-icon"]').attr("href");

    // 4. Xử lý URL tương đối (Relative URL) thành Tuyệt đối (Absolute URL)
    const baseUrl = new URL(url);

    if (favicon && !favicon.startsWith("http") && !favicon.startsWith("//")) {
      favicon = new URL(favicon, baseUrl.origin).toString();
    } else if (!favicon) {
      // Fallback: Nếu không tìm thấy, thử gọi đến /favicon.ico theo chuẩn chung
      favicon = new URL("/favicon.ico", baseUrl.origin).toString();
    }

    let finalImage = image;
    if (image && !image.startsWith("http") && !image.startsWith("//")) {
      finalImage = new URL(image, baseUrl.origin).toString();
    }

    return {
      title: title ? title.trim() : null,
      description: description ? description.trim() : null,
      image: finalImage,
      favicon,
    };
  } catch (error) {
    console.error("Lỗi khi fetch metadata cho URL:", url, error);
    // Bắt lỗi nhẹ nhàng, trả về rỗng chứ không làm chết API
    return {
      title: null,
      description: null,
      image: null,
      favicon: null,
    };
  }
}
