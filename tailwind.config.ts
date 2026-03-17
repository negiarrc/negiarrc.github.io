import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/mdx-components.tsx",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
};

export default config;
