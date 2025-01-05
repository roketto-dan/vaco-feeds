import sharp from "sharp";
import axios from "axios";
import type { APIRoute } from "astro";

import { posts } from "../../modules/post";
import { getImage } from "../../modules/metadata";

export const GET: APIRoute = async ({ request }) => {
  try {
    const postId = request.url.split("/").pop()?.replace(".webp", "");
    if (postId == null) {
      return new Response("Invalid URL", { status: 400 });
    }

    const post = posts.find((post) => encodeURIComponent(post.id) === postId);
    if (post == null) {
      return new Response("Post not found", { status: 404 });
    }

    const thumbnailUrl = await getImage(post.link);
    if (thumbnailUrl == null) {
      return new Response("Failed to get image", { status: 500 });
    }

    const response = await axios.get(thumbnailUrl, {
      responseType: "arraybuffer",
    });

    const thumbnail = await sharp(response.data)
      .resize(640, 360)
      .webp()
      .toBuffer();

    return new Response(thumbnail, {
      status: 200,
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": `public, max-age=${60 * 60}, s-maxage=${60 * 60 * 24 * 365}`,
        "CDN-Cache-Control": `max-age=${60 * 60 * 12}`,
        "Cloudflare-CDN-Cache-Control": `max-age=${60 * 60 * 24}`,
        "Content-Length": thumbnail.length.toString(),
        ETag: btoa(thumbnailUrl),
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }
    return new Response(null, { status: 500 });
  }
};

export async function getStaticPaths() {
  return posts.map((post) => ({
    params: { postId: post.id },
  }));
}
