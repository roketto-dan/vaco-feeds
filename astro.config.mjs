import { defineConfig } from "astro/config";
import icon from "astro-icon";
import tailwind from "@astrojs/tailwind";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), icon(), react()],
  image: {
    service: {
      entrypoint: "src/services/thumbnail.ts",
    },
  },
});
