import sharp from "sharp";
import axios from "axios";
import type { APIRoute } from "astro";
import { isLocalService } from "astro/assets";
import { getConfiguredImageService } from "astro:assets";

import { users } from "../../data/user";
import { getUserProfileImageUrl } from "../../modules/profile";

export const GET: APIRoute = async ({ request }) => {
  try {
    const imageService = await getConfiguredImageService();

    if (!isLocalService(imageService)) {
      throw new Error("Internal server error");
    }

    const userId = request.url.split("/").pop()?.replace(".webp", "");
    if (userId == null) {
      return new Response("Invalid URL", { status: 400 });
    }

    const user = users.find((user) => user.github === userId);
    if (user == null) {
      return new Response("User not found", { status: 404 });
    }

    const avatarUrl = await getUserProfileImageUrl(user.name);
    if (avatarUrl == null) {
      return new Response("Failed to get image", { status: 500 });
    }

    const response = await axios.get(avatarUrl, {
      responseType: "arraybuffer",
    });

    const avatar = await sharp(response.data).resize(120).webp().toBuffer();

    return new Response(avatar, {
      status: 200,
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": `public, max-age=${60 * 60}, s-maxage=${60 * 60 * 24 * 365}`,
        ETag: btoa(avatarUrl),
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
  return users.flatMap((user) =>
    user.github == null ? [] : [{ params: { userId: `${user.github}.webp` } }],
  );
}
