import type { MDXComponents } from "mdx/types";

export const sharedMdxComponents: MDXComponents = {};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...sharedMdxComponents,
    ...components,
  };
}
