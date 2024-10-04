import type { APIRoute } from "astro";
import { isLocalService } from "astro/assets";
import { getConfiguredImageService, imageConfig } from "astro:assets";
import mime from "mime";
import { posts } from "../../modules/post";

export const GET: APIRoute = async ({ request }) => {
  const imageService = await getConfiguredImageService();

  if (!isLocalService(imageService)) {
    throw new Error("Image service is not local");
  }

  const { data, format } = await imageService.transform(
    new Uint8Array(),
    { src: request.url },
    imageConfig,
  );

  return new Response(data, {
    status: 200,
    headers: {
      "Content-Type": mime.getType(format) || "",
    },
  });
};

export async function getStaticPaths() {
  return posts.map((post) => ({
    params: { postId: post.id },
  }));
}
