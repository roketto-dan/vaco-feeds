import type { LocalImageService, ImageOutputFormat } from "astro";
import axios from "axios";
import { getImage } from "../../src/modules/metadata";
import { posts } from "../modules/post";

const thumbnailService: LocalImageService = {
  getURL(options) {
    if (!(typeof options.src === "string")) {
      throw new Error("src must be a string");
    }

    return options.src;
  },
  parseURL(url: URL) {
    return {
      src: url.href,
    };
  },
  async transform(
    _: unknown,
    options: { src: string; [key: string]: any },
  ): Promise<{ data: Uint8Array; format: ImageOutputFormat }> {
    const postId = options.src.split("/").pop();

    if (postId == null) {
      throw new Error("Invalid URL");
    }

    const post = posts.find((post) => post.id === postId);

    if (post == null) {
      throw new Error("Post not found");
    }

    const image = await getImage(post.link);

    if (image == null) {
      throw new Error("Failed to get image");
    }

    const response = await axios.get(image, {
      responseType: "arraybuffer",
    });

    return {
      data: Buffer.from(response.data),
      format: options.format,
    };
  },
  getHTMLAttributes(options) {
    const { src, width, height, format, quality, ...attributes } = options;

    return {
      ...attributes,
      width,
      height,
      loading: attributes.loading ?? "lazy",
      decoding: attributes.decoding ?? "async",
    };
  },
};

export default thumbnailService;
